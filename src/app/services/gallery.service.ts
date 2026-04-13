import { Injectable } from '@angular/core';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  updateDoc,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { Observable, from } from 'rxjs';
import { FirebaseService } from './firebase.service';

export interface GalleryItem {
  id?: string;
  imgUrl: string;
  name?: string;
  created_at?: Timestamp | Date | any;
}

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private collectionName = 'gallery';

  constructor(private firebaseService: FirebaseService) {}

  getGalleryItems(): Observable<GalleryItem[]> {
    const q = query(
      collection(this.firebaseService.db, this.collectionName),
      orderBy('created_at', 'desc')
    );

    return from(
      getDocs(q).then(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as GalleryItem))
      )
    );
  }

  addGalleryItem(imgUrl: string, name?: string): Observable<GalleryItem> {
    const data = {
      imgUrl,
      name: name || '',
      created_at: Timestamp.now()
    };
    return from(
      addDoc(collection(this.firebaseService.db, this.collectionName), data)
        .then(docRef => ({ id: docRef.id, ...data }))
    );
  }

  updateGalleryItem(id: string, imgUrl: string, name?: string): Observable<void> {
    const data: any = { imgUrl };
    if (name !== undefined) {
      data.name = name;
    }
    return from(updateDoc(doc(this.firebaseService.db, this.collectionName, id), data));
  }

  deleteGalleryItem(id: string): Observable<void> {
    return from(deleteDoc(doc(this.firebaseService.db, this.collectionName, id)));
  }
}
