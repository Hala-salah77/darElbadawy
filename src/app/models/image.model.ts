export interface Image {
  id?: number;
  url: string;
  name: string;
  alt: string;
  category?: ImageCategory;
  uploadedAt?: Date;
  uploadedBy?: string;
  size?: number;
  width?: number;
  height?: number;
}

export enum ImageCategory {
  GALLERY = 'gallery',
  BLOG = 'blog',
  SERVICE = 'service',
  HOSTEL = 'hostel',
  ACTIVITIES = 'activities'
}

export interface ImageUpload {
  file: File;
  category: ImageCategory;
  alt: string;
}
