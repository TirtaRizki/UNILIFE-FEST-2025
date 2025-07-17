
import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

// This is a server-only file. It uses environment variables that should
// only be available on the server.

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

if (!projectId || !clientEmail || !privateKey) {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      'Firebase Admin SDK not initialized. Missing one or more environment variables: NEXT_PUBLIC_FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY. This is expected in some environments like client-side storybooks, but may be an error.'
    );
  } else {
    // In production, we should throw an error to fail fast.
    throw new Error('Firebase Admin SDK failed to initialize due to missing environment variables.');
  }
}

const serviceAccount = {
  project_id: projectId,
  client_email: clientEmail,
  private_key: privateKey,
};

if (!getApps().length && projectId && clientEmail && privateKey) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: storageBucket,
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
    throw new Error('Failed to initialize Firebase Admin SDK. Please check your service account credentials.');
  }
}

// Ensure storage is part of the admin export
const adminDb = getApps().length ? admin.firestore() : null;

// Export a getter function for the database to ensure it's accessed only when initialized.
const getAdminDb = () => {
  if (!adminDb) {
    // This provides a clearer error message if something tries to use the db when it's not available.
    throw new Error('Firebase Admin SDK is not initialized. Database operations are not available.');
  }
  // The Admin SDK combines services, so we can return the entire admin object
  // if we need more than just Firestore. Let's return just the DB for now.
  return admin.apps[0];
}


export { getAdminDb, adminDb };
