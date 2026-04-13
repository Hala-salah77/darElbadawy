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
  limit,
  Timestamp
} from 'firebase/firestore';
import { Observable, from } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { BlogPost, BlogPostCreate } from '../models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private collectionName = 'blogPosts';

  constructor(private firebaseService: FirebaseService) {}

  createBlogPost(blogPost: BlogPostCreate): Observable<string> {
    const blogPostData = {
      ...blogPost,
      publishedAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    return from(
      addDoc(collection(this.firebaseService.db, this.collectionName), blogPostData)
        .then(docRef => docRef.id)
    );
  }

  getBlogPosts(limitCount?: number): Observable<BlogPost[]> {
    let q = query(
      collection(this.firebaseService.db, this.collectionName),
      // where('isPublished', '==', true),
      orderBy('publishedAt', 'desc')
    );
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    return from(
      getDocs(q).then(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          publishedAt: doc.data()['publishedAt']?.toDate(),
          updatedAt: doc.data()['updatedAt']?.toDate()
        } as BlogPost))
      )
    );
  }

  getBlogPost(id: string): Observable<BlogPost | null> {
    return from(
      getDoc(doc(this.firebaseService.db, this.collectionName, id))
        .then(doc => {
          if (doc.exists()) {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              publishedAt: data['publishedAt']?.toDate(),
              updatedAt: data['updatedAt']?.toDate()
            } as BlogPost;
          }
          return null;
        })
    );
  }

  updateBlogPost(id: string, blogPost: Partial<BlogPostCreate>): Observable<void> {
    const updateData = {
      ...blogPost,
      updatedAt: Timestamp.now()
    };
    
    return from(
      updateDoc(doc(this.firebaseService.db, this.collectionName, id), updateData)
    );
  }

  deleteBlogPost(id: string): Observable<void> {
    return from(
      deleteDoc(doc(this.firebaseService.db, this.collectionName, id))
    );
  }

  getAllBlogPosts(): Observable<BlogPost[]> {
    const q = query(
      collection(this.firebaseService.db, this.collectionName),
      orderBy('publishedAt', 'desc')
    );

    return from(
      getDocs(q).then(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          publishedAt: doc.data()['publishedAt']?.toDate(),
          updatedAt: doc.data()['updatedAt']?.toDate()
        } as BlogPost))
      )
    );
  }
}
