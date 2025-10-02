# YouthLink Deployment Guide

This guide provides step-by-step instructions for deploying the YouthLink application to production.

## Prerequisites

- Node.js 20.19.0 or 22.12.0+
- Firebase project with Firestore enabled
- Domain name (optional, for custom domain)

## Environment Configuration

### 1. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Enable Authentication with Email/Password provider
4. Copy your Firebase configuration

### 2. Environment Variables

Create a `.env.production` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Build for Production

```bash
# Install dependencies
npm install

# Run type checking and build
npm run build
```

The production-ready files will be in the `dist/` directory.

## Deployment Options

### Option 1: Firebase Hosting (Recommended)

#### Install Firebase CLI
```bash
npm install -g firebase-tools
```

#### Login to Firebase
```bash
firebase login
```

#### Initialize Firebase Hosting
```bash
firebase init hosting
```

Select:
- Use existing project
- Public directory: `dist`
- Configure as single-page app: Yes
- Set up automatic builds with GitHub: No

#### Deploy
```bash
npm run build
firebase deploy --only hosting
```

Your app will be live at: `https://your-project-id.web.app`

### Option 2: Netlify

#### Using Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
npm run build
netlify deploy --prod --dir=dist
```

#### Using Netlify Web UI

1. Push your code to GitHub
2. Go to [Netlify](https://app.netlify.com/)
3. Click "New site from Git"
4. Select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables in Site settings > Environment variables
7. Deploy

### Option 3: Vercel

#### Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Using Vercel Web UI

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Click "New Project"
4. Import your repository
5. Framework preset: Vite
6. Add environment variables
7. Deploy

## Post-Deployment Steps

### 1. Firestore Security Rules

Update Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
      allow update: if request.auth.uid == userId ||
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Appointments collection
    match /appointments/{appointmentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth.uid == resource.data.userId ||
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow delete: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Add similar rules for other collections
  }
}
```

### 2. Create Admin User

After deployment, register a user and manually update their role in Firestore:

1. Register through the app
2. Go to Firestore Console
3. Find the user document in `users` collection
4. Set `role` field to `"admin"`

### 3. Configure Domain (Optional)

#### Firebase Hosting
1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow the DNS configuration steps

#### Netlify/Vercel
1. Go to Domain settings in your dashboard
2. Add custom domain
3. Update DNS records as instructed

## Monitoring & Maintenance

### Performance Monitoring

Enable Firebase Performance Monitoring:
```bash
firebase init performance
```

### Error Tracking

Consider integrating:
- Sentry for error tracking
- Google Analytics for usage analytics
- Firebase Analytics for user behavior

### Backup Strategy

1. Enable automatic Firestore backups
2. Export data regularly:
```bash
gcloud firestore export gs://your-bucket/backups
```

### Update Strategy

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Build and test
npm run build
npm run preview

# Deploy
firebase deploy --only hosting
```

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

### Environment Variables Not Working

- Ensure variables start with `VITE_`
- Restart dev server after adding variables
- Check that `.env.production` is in project root

### Firebase Connection Issues

- Verify Firebase configuration
- Check Firestore security rules
- Ensure Firebase project is active

### Deployment Size Too Large

```bash
# Analyze bundle
npm run build -- --analyze

# Optimize images
# Enable lazy loading
# Use code splitting
```

## Security Checklist

- [ ] Environment variables secured
- [ ] Firestore security rules configured
- [ ] Authentication enabled
- [ ] HTTPS enforced
- [ ] CORS configured properly
- [ ] API keys restricted
- [ ] Regular security audits scheduled

## Performance Checklist

- [ ] Images optimized
- [ ] Code splitting implemented
- [ ] Lazy loading enabled
- [ ] Caching configured
- [ ] CDN configured
- [ ] Compression enabled

## Support

For deployment issues:
- Email: support@youthlink.org
- Documentation: https://youthlink.org/docs
- GitHub Issues: https://github.com/your-org/youthlink/issues
