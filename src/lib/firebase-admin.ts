
/**
 * @fileoverview This file handles the Firebase Admin SDK initialization using a robust singleton pattern.
 * This pattern ensures the SDK is initialized only once and is safe for Next.js server environments,
 * including serverless functions and hot-reloads during development.
 */
import admin from 'firebase-admin';
import type { App } from 'firebase-admin/app';

// Use globalThis to store the initialized app, preventing re-initialization.
declare global {
  var firebaseAdminApp: App | undefined;
}

/**
 * Initializes and returns the Firebase Admin app instance, ensuring it's created only once.
 * This function now reads credentials from an environment variable for better reliability and security.
 * @returns The initialized Firebase Admin App.
 */
function getAdminApp(): App {
  // If the app is already initialized on the global object, return it.
  if (globalThis.firebaseAdminApp) {
    return globalThis.firebaseAdminApp;
  }
  
  // Validate that the required environment variables are set.
  if (!process.env.FIREBASE_CREDENTIALS || !process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) {
    throw new Error(
      'FIREBASE_CREDENTIALS and NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET environment variables must be set.'
    );
  }

  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

    // Initialize the app with the retrieved credentials.
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });

    console.log('Firebase Admin SDK initialized successfully.');

    // Store the initialized app on the global object for reuse.
    globalThis.firebaseAdminApp = app;
    return app;
    
  } catch (error) {
    console.error("Failed to parse FIREBASE_CREDENTIALS. Make sure it's a valid JSON string.", error);
    throw new Error("Firebase Admin SDK initialization failed.");
  }
}

/**
 * Provides access to the Firestore database instance from the initialized Firebase Admin SDK.
 * @returns The Firestore database instance.
 */
export const adminDb = () => getAdminApp().firestore();

/**
 * Provides access to the Cloud Storage instance from the initialized Firebase Admin SDK.
 * @returns The Cloud Storage instance.
 */
export const adminStorage = () => getAdminApp().storage();
