# Firebase Setup Guide for Dahab Hostel Website

## 🔥 Firebase Project Configuration

Your Firebase project is now configured with the following details:
- **Project ID**: dahab-4ebd5
- **Auth Domain**: dahab-4ebd5.firebaseapp.com
- **Storage Bucket**: dahab-4ebd5.firebasestorage.app

## 📋 Required Firebase Services Setup

### 1. Authentication Setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **dahab-4ebd5**
3. Navigate to **Authentication** > **Sign-in method**
4. Enable **Email/Password** authentication
5. Optionally enable **Google** sign-in for easier admin access

### 2. Firestore Database Setup
1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (we'll add security rules later)
4. Select a location (choose closest to your users)

### 3. Storage Setup
1. Go to **Storage**
2. Click **Get started**
3. Choose **Start in test mode** (we'll add security rules later)
4. Select the same location as Firestore

## 🔒 Security Rules Configuration

### Firestore Security Rules
Replace the default rules with these:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all users for public content
    match /blogPosts/{document} {
      allow read: if true;
      allow write: if request.auth != null && 
        (request.auth.token.role == 'admin' || request.auth.token.role == 'editor');
    }
    
    match /services/{document} {
      allow read: if true;
      allow write: if request.auth != null && 
        (request.auth.token.role == 'admin' || request.auth.token.role == 'editor');
    }
    
    match /images/{document} {
      allow read: if true;
      allow write: if request.auth != null && 
        (request.auth.token.role == 'admin' || request.auth.token.role == 'editor');
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Storage Security Rules
Replace the default rules with these:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        (request.auth.token.role == 'admin' || request.auth.token.role == 'editor');
    }
  }
}
```

## 👤 Admin User Setup

### Method 1: Using Firebase Console (Recommended)
1. Go to **Authentication** > **Users**
2. Click **Add user**
3. Create an admin user with email/password
4. Go to **Authentication** > **Users** > Select your user
5. Click **Custom claims** > **Edit**
6. Add: `{"role": "admin"}`
7. Click **Save**

### Method 2: Using Firebase Admin SDK
If you have access to Firebase Admin SDK, you can set custom claims programmatically:

```javascript
// Set custom claims for admin user
admin.auth().setCustomUserClaims(uid, { role: 'admin' });
```

## 🚀 Testing Your Setup

### 1. Start the Development Server
```bash
npm start
```

### 2. Test Authentication
1. Navigate to `http://localhost:4200/login`
2. Try logging in with your admin credentials
3. You should be redirected to `/admin` dashboard

### 3. Test Content Management
1. In the admin dashboard, try creating:
   - A new blog post
   - A new service
   - Upload an image

## 📱 Firebase Hosting Setup (Optional)

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Initialize Firebase in your project
```bash
firebase init hosting
```
- Select your project: **dahab-4ebd5**
- Set public directory: `dist/badwy-app`
- Configure as single-page app: **Yes**
- Set up automatic builds: **No** (for now)

### 4. Deploy to Firebase Hosting
```bash
npm run build
firebase deploy
```

## 🔧 Troubleshooting

### Common Issues:

1. **Authentication not working**
   - Check if Email/Password is enabled in Firebase Console
   - Verify your Firebase configuration in environment files

2. **Permission denied errors**
   - Check Firestore and Storage security rules
   - Ensure user has proper role claims

3. **Build errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check for TypeScript errors in the console

4. **Images not uploading**
   - Check Storage security rules
   - Verify Storage is enabled in Firebase Console

## 📊 Monitoring and Analytics

Your Firebase project includes Google Analytics (measurementId: G-CEEEW3ZRW8). You can:
1. View analytics in Firebase Console > Analytics
2. Monitor user engagement and app performance
3. Track custom events for better insights

## 🎯 Next Steps

1. **Set up your admin user** with proper role claims
2. **Test all functionality** in development mode
3. **Add sample content** (blog posts, services, images)
4. **Deploy to Firebase Hosting** when ready
5. **Configure custom domain** (optional)

## 📞 Support

If you encounter any issues:
1. Check the Firebase Console for error logs
2. Review the browser console for client-side errors
3. Ensure all security rules are properly configured
4. Verify your Firebase project settings

Your Dahab Hostel website is now ready for development and testing! 🎉

