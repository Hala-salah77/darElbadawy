export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: Date;
  updatedAt: Date;
  featuredImage?: string;
  tags: string[];
  isPublished: boolean;
  slug: string;
}

export interface BlogPostCreate {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  featuredImage?: string;
  tags: string[];
  isPublished: boolean;
  slug: string;
}
