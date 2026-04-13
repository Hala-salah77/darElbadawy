export interface Service {
  id?: string;
  title: string;
  description: string;
  shortDescription: string;
  icon?: string;
  image?: string;
  price?: number;
  currency?: string;
  duration?: string;
  category: ServiceCategory;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  features: string[];
}

export enum ServiceCategory {
  ENTERTAINMENT = 'entertainment',
  EDUCATION = 'education',
  TRIPS = 'trips',
  ACCOMMODATION = 'accommodation',
  DINING = 'dining'
}

export interface ServiceCreate {
  title: string;
  description: string;
  shortDescription: string;
  icon?: string;
  image?: string;
  price?: number;
  currency?: string;
  duration?: string;
  category: ServiceCategory;
  isActive: boolean;
  features: string[];
}
