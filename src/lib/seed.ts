
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
const defaultUsers: Omit<User, 'id'>[] = [
    { email: 'admin@unilifefest.com', password: 'unilifejaya123', role: 'Admin', name: 'Super Admin', phoneNumber: '08001234567' },
    { email: 'panitia2025@unilife.com', password: 'lampungfest123', role: 'Panitia', name: 'Panitia 2025', phoneNumber: '08119876543' }
];

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
