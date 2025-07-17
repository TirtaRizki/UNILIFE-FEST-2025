/**
 * @fileoverview This file handles the Firebase Admin SDK initialization.
 * It ensures the SDK is initialized only once (singleton pattern) and provides global instances.
 * This pattern is robust for Next.js server environments, including serverless functions.
 */
import admin from 'firebase-admin';
import type { App } from 'firebase-admin/app';

// Ensure this file is only run on the server
import 'server-only';

function getServiceAccount() {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!privateKey || !clientEmail || !projectId) {
    throw new Error(
      'Firebase Admin credentials are not set in environment variables. Required: FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, NEXT_PUBLIC_FIREBASE_PROJECT_ID'
    );
  }

  return {
    projectId: projectId,
    clientEmail: clientEmail,
    privateKey: privateKey.replace(/\\n/g, '\n'),
  };
}

function getStorageBucket() {
    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!bucketName) {
        throw new Error('Firebase Storage bucket name is not configured in environment variables (NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET).');
    }
    return bucketName;
}

// Use globalThis to store the initialized app, preventing re-initialization during hot-reloads.
// This is a best practice for Next.js.
declare global {
  var firebaseAdminApp: App | undefined;
}

function getAdminApp(): App {
  if (globalThis.firebaseAdminApp) {
    return globalThis.firebaseAdminApp;
  }
  
  const serviceAccount = getServiceAccount();
  const storageBucket = getStorageBucket();

  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: storageBucket,
  });

  console.log('Firebase Admin SDK initialized successfully.');
  globalThis.firebaseAdminApp = app;
  return app;
}

// Export ready-to-use db and storage instances that lazily initialize the app on first use.
export const adminDb = () => getAdminApp().firestore();
export const adminStorage = () => getAdminApp().storage();
