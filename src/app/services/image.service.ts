import { Injectable } from '@angular/core';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll,
  getMetadata
} from 'firebase/storage';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { Observable, from } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { Image, ImageCategory, ImageUpload } from '../models/image.model';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private collectionName = 'images';
  private storagePath = 'images';

  constructor(private firebaseService: FirebaseService) {}

  uploadImage(imageUpload: ImageUpload, userId: string): Observable<Image> {
    const fileName = `${Date.now()}_${imageUpload.file.name}`;
    const imageRef = ref(this.firebaseService.storage, `${this.storagePath}/${fileName}`);
    
    return from(
      uploadBytes(imageRef, imageUpload.file).then(async (snapshot) => {
        const downloadURL = await getDownloadURL(snapshot.ref);
        const metadata = await getMetadata(snapshot.ref);
        
        const imageData: Omit<Image, 'id'> = {
          url: downloadURL,
          name: imageUpload.file.name,
          alt: imageUpload.alt,
          category: imageUpload.category,
          uploadedAt: new Date(),
          uploadedBy: userId,
          size: imageUpload.file.size,
          width: metadata.customMetadata?.['width'] ? parseInt(metadata.customMetadata['width']) : 0,
          height: metadata.customMetadata?.['height'] ? parseInt(metadata.customMetadata['height']) : 0
        };

        const docRef = await addDoc(collection(this.firebaseService.db, this.collectionName), {
          ...imageData,
          uploadedAt: Timestamp.now()
        });

        return {
          id: docRef.id,
          ...imageData
        } as any;
      })
    );
  }

  getImagesByCategory(category: ImageCategory): Observable<Image[]> {
    const q = query(
      collection(this.firebaseService.db, this.collectionName),
      where('category', '==', category),
      orderBy('uploadedAt', 'desc')
    );

    return from(
      getDocs(q).then(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          uploadedAt: doc.data()['uploadedAt']?.toDate()
        } as any))
      )
    );
  }

  getAllImages(): Observable<Image[]> {
    const q = query(
      collection(this.firebaseService.db, this.collectionName),
      orderBy('uploadedAt', 'desc')
    );

    return from(
      getDocs(q).then(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          uploadedAt: doc.data()['uploadedAt']?.toDate()
        } as any))
      )
    );
  }

  deleteImage(imageId: string, imageUrl: string): Observable<void> {
    return from(
      Promise.all([
        deleteDoc(doc(this.firebaseService.db, this.collectionName, imageId)),
        deleteObject(ref(this.firebaseService.storage, imageUrl))
      ]).then(() => {})
    );
  }
}
