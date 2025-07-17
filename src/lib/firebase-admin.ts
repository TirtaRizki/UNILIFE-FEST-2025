/**
 * @fileoverview This file handles the Firebase Admin SDK initialization using a robust singleton pattern.
 * This pattern ensures the SDK is initialized only once and is safe for Next.js server environments,
 * including serverless functions and hot-reloads during development.
 */
import admin from 'firebase-admin';
import type { App } from 'firebase-admin/app';

// Ensure this file is only run on the server
import 'server-only';

// Use globalThis to store the initialized app, preventing re-initialization.
declare global {
  var firebaseAdminApp: App | undefined;
}

function getServiceAccount() {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!privateKey || !clientEmail || !projectId) {
    // This error will be thrown if the environment variables are not set.
    // This is the root cause of the previous errors.
    throw new Error(
      'Firebase Admin credentials are not set in environment variables. Required: FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, NEXT_PUBLIC_FIREBASE_PROJECT_ID'
    );
  }

  return {
    projectId: projectId,
    clientEmail: clientEmail,
    // The private key from environment variables often has escaped newlines.
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


/**
 * Initializes and returns the Firebase Admin app instance, ensuring it's created only once.
 * @returns The initialized Firebase Admin App.
 */
function getAdminApp(): App {
  // If the app is already initialized, return it from the global cache.
  if (globalThis.firebaseAdminApp) {
    return globalThis.firebaseAdminApp;
  }
  
  const serviceAccount = getServiceAccount();
  const storageBucket = getStorageBucket();

  // Initialize the app with credentials.
  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: storageBucket,
  });

  console.log('Firebase Admin SDK initialized successfully.');

  // Cache the initialized app in globalThis for subsequent calls.
  globalThis.firebaseAdminApp = app;

  return app;
}

// Export ready-to-use db and storage instances.
// They lazily initialize the app on first use by calling getAdminApp().
export const adminDb = () => getAdminApp().firestore();
export const adminStorage = () => getAdminApp().storage();
