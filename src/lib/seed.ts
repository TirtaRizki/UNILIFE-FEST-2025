<<<<<<< HEAD

/**
 * @fileoverview This script is used to seed the Firestore database with initial data.
 * It's meant to be run manually from the command line, NOT as part of the application runtime.
 * 
 * To run this script:
 * 1. Ensure your .env.local file is correctly set up with FIREBASE_CREDENTIALS.
 * 2. Run `npm run db:seed` in your terminal.
 */
import { adminDb } from './firebase-admin';
import type { User } from './types';

// --- Default Users ---
=======
// Use dotenv to load environment variables from .env.local
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { adminDb } from './firebase-admin';
import type { User } from './types';

>>>>>>> e2a9ec0cc22da326c26226fb9702dad42eb68f24
const defaultUsers: Omit<User, 'id'>[] = [
    { email: 'admin@unilifefest.com', password: 'unilifejaya123', role: 'Admin', name: 'Super Admin', phoneNumber: '08001234567' },
    { email: 'panitia2025@unilife.com', password: 'lampungfest123', role: 'Panitia', name: 'Panitia 2025', phoneNumber: '08119876543' }
];

<<<<<<< HEAD
async function seedCollection<T extends { [key: string]: any }>(collectionName: string, data: T[], uniqueField: keyof T) {
    console.log(`\n- Seeding collection: ${collectionName}`);
    const collectionRef = adminDb().collection(collectionName);
    let addedCount = 0;

    for (const item of data) {
        const q = collectionRef.where(uniqueField as string, '==', item[uniqueField]);
        const existingSnapshot = await q.get();

        if (existingSnapshot.empty) {
            await collectionRef.add(item);
            addedCount++;
        }
    }
    console.log(`  Added ${addedCount} new documents.`);
    console.log(`  Collection '${collectionName}' now contains ${ (await collectionRef.get()).size } documents.`);
}

async function seedDatabase() {
    console.log('🌱 Starting database seeding...');
    
    // Only seeding users now, other data is handled by dummy data in components.
    await seedCollection<Omit<User, 'id'>>('users', defaultUsers, 'email');

    console.log('\n🌲 Database seeding complete!');
    process.exit(0);
}

seedDatabase().catch((error) => {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
});
=======
async function seedDatabase() {
    console.log('🌱 Starting database seeding...');
    try {
        const usersCollection = adminDb().collection('users');

        for (const userData of defaultUsers) {
            // Check if a user with the same email already exists
            const existingUserQuery = await usersCollection.where('email', '==', userData.email).limit(1).get();
            
            if (existingUserQuery.empty) {
                // If no user exists, add the new user
                await usersCollection.add(userData);
                console.log(`✅ Created user: ${userData.email}`);
            } else {
                console.log(`- Skipping user (already exists): ${userData.email}`);
            }
        }

        console.log('🎉 Database seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1); // Exit with an error code
    }
}

seedDatabase();
>>>>>>> e2a9ec0cc22da326c26226fb9702dad42eb68f24
