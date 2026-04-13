import { inject, Injectable, signal } from '@angular/core';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  getIdTokenResult
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(true);
  public user$ = this.userSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  private firebaseService = inject(FirebaseService);
  userRole = signal<string | null>(null);
  constructor() {

    onAuthStateChanged(this.firebaseService.auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = await this.getUserData(firebaseUser.uid);
        this.userSubject.next(user);
        const tokenResult = await getIdTokenResult(firebaseUser);
        console.log("tokenResult", tokenResult);
        document.cookie = `access_token=${tokenResult.token}; path=/; max-age=${60 * 60 * 24 * 5}; SameSite=Strict`;
        const role = tokenResult.claims['admin'] ? 'admin' : 'user';
        this.userRole.set(role);
        console.log(this.userRole());
      } else {
        this.userSubject.next(null);
        document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      }
      this.loadingSubject.next(false);
    });
  }

  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.firebaseService.auth,
        email,
        password
      );
      const user = await this.getUserData(userCredential.user.uid);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async signOut(): Promise<void> {
    await signOut(this.firebaseService.auth);
  }

  private async getUserData(uid: string): Promise<User> {
    const userDoc = await getDoc(doc(this.firebaseService.db, 'users', uid));

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        uid,
        email: userData['email'],
        displayName: userData['displayName'],
        photoURL: userData['photoURL'],
        role: userData['role'] || UserRole.VIEWER,
        createdAt: userData['createdAt']?.toDate(),
        lastLoginAt: new Date(),
        isActive: userData['isActive'] ?? true
      };
    }
    else {
      // Create user document if it doesn't exist
      const user = this.firebaseService.auth.currentUser;
      const newUser: User = {
        uid,
        email: user?.email || '',
        displayName: user?.displayName || undefined,
        photoURL: user?.photoURL || undefined,
        role: UserRole.VIEWER,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        isActive: true
      };

      // await setDoc(doc(this.firebaseService.db, 'users', uid), newUser);
      return newUser;
    }
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    // return user?.role === UserRole.ADMIN;]
    return user?.email === "admin@gmail.com";

  }

  isEditor(): boolean {
    const user = this.getCurrentUser();
    // return user?.role === UserRole.ADMIN || user?.role === UserRole.EDITOR;
    return user?.email === "admin@gmail.com" || user?.email === "admin@gmail.com";
  }
}
