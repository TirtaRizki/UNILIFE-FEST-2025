import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

// This is a server-only file. It uses environment variables that should
// only be available on the server.

const serviceAccount = {
  project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  // The private key must be correctly formatted to be parsed from the environment variable.
  // When setting FIREBASE_PRIVATE_KEY in your .env.local, wrap the key in quotes.
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!getApps().length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const adminDb = admin.firestore();

export { adminDb };
