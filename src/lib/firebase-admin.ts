/**
 * @fileoverview This file handles the Firebase Admin SDK initialization.
 * It ensures the SDK is initialized only once and provides a global instance.
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
    privateKey: privateKey.replace(/\\n/g, '\n'), // Important for Vercel/similar environments
  };
}

function getStorageBucket() {
    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!bucketName) {
        throw new Error('Firebase Storage bucket name is not configured in environment variables (NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET).');
    }
    return bucketName;
}

// A function to get or initialize the Firebase Admin app
export function getAdminApp(): App {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  const serviceAccount = getServiceAccount();
  const storageBucket = getStorageBucket();

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: storageBucket,
  });

  return admin.app();
}

// Export a ready-to-use db and storage instance
export const adminDb = () => getAdminApp().firestore();
export const adminStorage = () => getAdminApp().storage();
