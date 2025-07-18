// Use dotenv to load environment variables from .env.local
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { adminDb } from './firebase-admin';
import type { User } from './types';

const defaultUsers: Omit<User, 'id'>[] = [
    { email: 'admin@unilifefest.com', password: 'unilifejaya123', role: 'Admin', name: 'Super Admin', phoneNumber: '08001234567' },
    { email: 'panitia2025@unilife.com', password: 'lampungfest123', role: 'Panitia', name: 'Panitia 2025', phoneNumber: '08119876543' }
];

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
