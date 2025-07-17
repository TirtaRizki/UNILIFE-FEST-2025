/**
 * @fileoverview This script is used to seed the Firestore database with initial data.
 * It's meant to be run manually from the command line, NOT as part of the application runtime.
 * This prevents issues with data being re-initialized on serverless function cold starts.
 * 
 * To run this script:
 * 1. Create a `firebase-credentials.json` file in the root of your project with your service account key.
 * 2. Run `pnpm db:seed` or `npm run db:seed` in your terminal.
 */
import { adminDb } from './firebase-admin';
import type { User } from './types';

const defaultUsers: Omit<User, 'id'>[] = [
    { email: 'admin@unilifefest.com', password: 'unilifejaya123', role: 'Admin', name: 'Super Admin', phoneNumber: '08001234567' },
    { email: 'panitia2025@unilife.com', password: 'lampungfest123', role: 'Panitia', name: 'Panitia 2025', phoneNumber: '08119876543' }
];

async function seedDatabase() {
    console.log('🌱 Starting database seeding...');
    const db = adminDb();
    const usersCollection = db.collection('users');

    try {
        for (const userData of defaultUsers) {
            const q = usersCollection.where('email', '==', userData.email);
            const existingUserSnapshot = await q.get();

            if (existingUserSnapshot.empty) {
                await usersCollection.add(userData);
                console.log(`✅ Created user: ${userData.email}`);
            } else {
                console.log(`🔶 User already exists, skipping: ${userData.email}`);
            }
        }
        console.log('🌲 Database seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
