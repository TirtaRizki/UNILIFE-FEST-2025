/**
 * @fileoverview This file handles the Firebase Admin SDK initialization using a robust singleton pattern.
 * This pattern ensures the SDK is initialized only once and is safe for Next.js server environments,
 * including serverless functions and hot-reloads during development.
 */
import admin from 'firebase-admin';
import type { App } from 'firebase-admin/app';
import path from 'path';
import fs from 'fs';

// Use globalThis to store the initialized app, preventing re-initialization.
declare global {
  var firebaseAdminApp: App | undefined;
}

/**
 * Initializes and returns the Firebase Admin app instance, ensuring it's created only once.
 * This function now reads credentials directly from a JSON file for better reliability in Node.js environments.
 * @returns The initialized Firebase Admin App.
 */
function getAdminApp(): App {
  // If the app is already initialized on the global object, return it.
  if (globalThis.firebaseAdminApp) {
    return globalThis.firebaseAdminApp;
  }
  
  // Path to your service account key file
  const serviceAccountPath = path.resolve(process.cwd(), 'firebase-credentials.json');

  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(
      `Firebase credentials file not found at ${serviceAccountPath}. Please create 'firebase-credentials.json' in the root of your project with the service account key.`
    );
  }

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

  // Initialize the app with the retrieved credentials.
  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });

  console.log('Firebase Admin SDK initialized successfully.');

  // Store the initialized app on the global object for reuse.
  globalThis.firebaseAdminApp = app;

  return app;
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