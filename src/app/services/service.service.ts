import { Injectable } from '@angular/core';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { Observable, from } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { Service, ServiceCreate, ServiceCategory } from '../models/service.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private collectionName = 'services';

  constructor(private firebaseService: FirebaseService) {}

  createService(service: ServiceCreate): Observable<string> {
    console.log('Creating service:', service);
    const serviceData = {
      ...service,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    return from(
      addDoc(collection(this.firebaseService.db, this.collectionName), serviceData)
        .then(docRef => docRef.id)
    );
  }

  getServices(): Observable<Service[]> {
    const q = query(
      collection(this.firebaseService.db, this.collectionName),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );

    return from(
      getDocs(q).then(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data()['createdAt']?.toDate(),
          updatedAt: doc.data()['updatedAt']?.toDate()
        } as Service))
      )
    );
  }

  getServicesByCategory(category: ServiceCategory): Observable<Service[]> {
    const q = query(
      collection(this.firebaseService.db, this.collectionName),
      where('category', '==', category),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );

    return from(
      getDocs(q).then(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data()['createdAt']?.toDate(),
          updatedAt: doc.data()['updatedAt']?.toDate()
        } as Service))
      )
    );
  }

  getService(id: string): Observable<Service | null> {
    return from(
      getDoc(doc(this.firebaseService.db, this.collectionName, id))
        .then(doc => {
          if (doc.exists()) {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              createdAt: data['createdAt']?.toDate(),
              updatedAt: data['updatedAt']?.toDate()
            } as Service;
          }
          return null;
        })
    );
  }

  updateService(id: string, service: Partial<ServiceCreate>): Observable<void> {
    const updateData = {
      ...service,
      updatedAt: Timestamp.now()
    };
    
    return from(
      updateDoc(doc(this.firebaseService.db, this.collectionName, id), updateData)
    );
  }

  deleteService(id: string): Observable<void> {
    return from(
      deleteDoc(doc(this.firebaseService.db, this.collectionName, id))
    );
  }

  getAllServices(): Observable<Service[]> {
    const q = query(
      collection(this.firebaseService.db, this.collectionName),
      orderBy('createdAt', 'desc')
    );

    return from(
      getDocs(q).then(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data()['createdAt']?.toDate(),
          updatedAt: doc.data()['updatedAt']?.toDate()
        } as Service))
      )
    );
  }
}
