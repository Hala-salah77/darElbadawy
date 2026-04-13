# Dahab Hostel Website

A modern, responsive website for a hostel in Dahab, Egypt, built with Angular and Firebase.

## Features

### User Interface
- **Home Page**: Hero section with featured content, services overview, blog preview, and gallery
- **Services Page**: Display of all hostel services with categories
- **Gallery Page**: Photo gallery showcasing the hostel and Dahab
- **Blog Page**: Latest blog posts and stories
- **About Page**: Information about the hostel and Dahab
- **Contact Page**: Contact information and contact form

### Admin Interface
- **Dashboard**: Overview of content statistics and recent items
- **Blog Management**: Create, edit, and manage blog posts
- **Services Management**: Manage hostel services and activities
- **Image Management**: Upload and organize images for the gallery

## Tech Stack

- **Frontend**: Angular 17, TypeScript, SCSS
- **Backend**: Firebase (Authentication, Firestore, Storage, Hosting)
- **UI/UX**: Responsive design with modern CSS practices
- **Icons**: Font Awesome
- **Fonts**: Inter (Google Fonts)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd badwyAPP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication, Firestore Database, and Storage
   - Copy your Firebase configuration
   - Update `src/environments/environment.ts` with your Firebase config:
   ```typescript
   export const environment = {
     production: false,
     firebase: {
       apiKey: "your-api-key",
       authDomain: "your-project.firebaseapp.com",
       projectId: "your-project-id",
       storageBucket: "your-project.appspot.com",
       messagingSenderId: "your-sender-id",
       appId: "your-app-id"
     }
   };
   ```

4. **Set up Firestore Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow read access to all users for public content
       match /blogPosts/{document} {
         allow read: if true;
         allow write: if request.auth != null && request.auth.token.role in ['admin', 'editor'];
       }
       match /services/{document} {
         allow read: if true;
         allow write: if request.auth != null && request.auth.token.role in ['admin', 'editor'];
       }
       match /images/{document} {
         allow read: if true;
         allow write: if request.auth != null && request.auth.token.role in ['admin', 'editor'];
       }
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

5. **Set up Storage Security Rules**
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /images/{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null && request.auth.token.role in ['admin', 'editor'];
       }
     }
   }
   ```

6. **Start the development server**
   ```bash
   npm start
   ```

7. **Open your browser**
   Navigate to `http://localhost:4200`

## Project Structure

```
src/
├── app/
│   ├── components/           # UI Components
│   │   ├── header/          # Navigation header
│   │   ├── footer/          # Site footer
│   │   ├── home/            # Home page
│   │   ├── services/        # Services page
│   │   ├── gallery/         # Gallery page
│   │   ├── blog/            # Blog listing
│   │   ├── blog-detail/     # Individual blog post
│   │   ├── about/           # About page
│   │   ├── contact/         # Contact page
│   │   ├── login/           # Admin login
│   │   └── admin/           # Admin dashboard
│   │       ├── dashboard/    # Admin dashboard
│   │       ├── blog-management/
│   │       ├── services-management/
│   │       └── image-management/
│   ├── models/              # TypeScript interfaces
│   ├── services/            # Firebase services
│   ├── guards/              # Route guards
│   └── app.routes.ts        # Routing configuration
├── environments/            # Environment configurations
└── styles.scss             # Global styles
```

## Admin Setup

1. **Create an admin user**
   - Sign up through the login page
   - In Firebase Console, go to Authentication > Users
   - Find your user and edit their custom claims
   - Add `role: "admin"` to their custom claims

2. **Access admin dashboard**
   - Login with your admin credentials
   - Navigate to `/admin` to access the dashboard

## Deployment

### Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project**
   ```bash
   firebase init hosting
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

## Features Overview

### User Features
- Responsive design for all devices
- Fast loading with lazy loading
- SEO-friendly URLs
- Modern UI with smooth animations
- Contact form integration

### Admin Features
- Secure authentication
- Role-based access control
- Content management system
- Image upload and management
- Real-time data updates

## Future Enhancements

- Online booking system
- Real-time chat support
- User reviews and ratings
- Event calendar
- Multi-language support
- Advanced analytics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.