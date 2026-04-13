import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  // Public routes
  { path: '', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
  { path: 'services', loadComponent: () => import('./components/services/services.component').then(m => m.ServicesComponent) },
  { path: 'gallery', loadComponent: () => import('./components/gallery/gallery.component').then(m => m.GalleryComponent) },
  { path: 'blog', loadComponent: () => import('./components/blog/blog.component').then(m => m.BlogComponent) },
  { path: 'blog/:id', loadComponent: () => import('./components/blog-detail/blog-detail.component').then(m => m.BlogDetailComponent) },
  { path: 'about', loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent) },
  { path: 'contact', loadComponent: () => import('./components/contact/contact.component').then(m => m.ContactComponent) },
  
  // Auth routes
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  
  // Admin routes
  { 
    path: 'admin', 
    canActivate: [AuthGuard, AdminGuard],
    loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./components/admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'blog', loadComponent: () => import('./components/admin/blog-management/blog-management.component').then(m => m.BlogManagementComponent) },
      { path: 'services', loadComponent: () => import('./components/admin/services-management/services-management.component').then(m => m.ServicesManagementComponent) },
      { path: 'images', loadComponent: () => import('./components/admin/image-management/image-management.component').then(m => m.ImageManagementComponent) }
    ]
  },
  
  // 404 redirect
  { path: '**', redirectTo: '' }
];
