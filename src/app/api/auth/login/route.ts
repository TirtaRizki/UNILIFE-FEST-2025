
import { NextResponse } from 'next/server';
<<<<<<< HEAD
import { adminDb } from '@/lib/firebase-admin';
import type { User } from '@/lib/types';
import { rateLimitMiddleware } from '@/lib/rate-limiter';

=======
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User } from '@/lib/types';
import { rateLimitMiddleware } from '@/lib/rate-limiter';

const usersCollection = collection(db, 'users');

const defaultUsers: Omit<User, 'id'>[] = [
    { email: 'admin@unilifefest.com', password: 'unilifejaya123', role: 'Admin', name: 'Super Admin', phoneNumber: '08001234567' },
    { email: 'panitia2025@unilife.com', password: 'lampungfest123', role: 'Panitia', name: 'Panitia 2025', phoneNumber: '08119876543' }
];

// Helper function to initialize users if the collection is empty
async function initializeDefaultUsers() {
    const snapshot = await getDocs(usersCollection);
    if (snapshot.empty) {
        console.log("Users collection is empty, initializing default users...");
        for (const user of defaultUsers) {
            await addDoc(usersCollection, user);
        }
        console.log("Default users initialized.");
    }
}


>>>>>>> e2a9ec0cc22da326c26226fb9702dad42eb68f24
// POST /api/auth/login
export async function POST(request: Request) {
    const rateLimitResponse = await rateLimitMiddleware(request);
    if (rateLimitResponse) return rateLimitResponse;

    try {
        await initializeDefaultUsers();

        const { email, password } = await request.json();
<<<<<<< HEAD
        const db = adminDb(); // Correctly call the function to get the db instance
        const usersCollection = db.collection('users');
=======

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
        }
>>>>>>> e2a9ec0cc22da326c26226fb9702dad42eb68f24

        // Find the user by email
        const userQuery = usersCollection.where("email", "==", email);
        const userSnapshot = await userQuery.get();

        if (userSnapshot.empty) {
            return NextResponse.json({ message: 'Invalid credentials or user not found.' }, { status: 401 });
        }

        const userDoc = userSnapshot.docs[0];
        const foundUser = { id: userDoc.id, ...userDoc.data() } as User;

<<<<<<< HEAD
        // Directly compare passwords (assuming they are stored as plain text as per the seed script)
=======
        // In a real app, you would compare a hashed password.
        // For this project, we'll stick to plaintext comparison as per existing logic.
>>>>>>> e2a9ec0cc22da326c26226fb9702dad42eb68f24
        if (foundUser.password !== password) {
            return NextResponse.json({ message: 'Invalid credentials or user not found.' }, { status: 401 });
        }

        // Only allow Admin or Panitia to log in to the CMS
        if (foundUser.role === 'Admin' || foundUser.role === 'Panitia') {
            const { password, ...userToReturn } = foundUser;
            return NextResponse.json({ message: 'Login successful', user: userToReturn });
        } else {
            return NextResponse.json({ message: 'This account does not have admin/committee privileges.' }, { status: 403 });
        }
        
    } catch (error) {
        console.error("Login error:", error);
        const err = error as Error;
        return NextResponse.json({ message: 'An internal server error occurred', error: err.message }, { status: 500 });
    }
}
