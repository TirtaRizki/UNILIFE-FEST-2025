
import { NextResponse } from 'next/server';
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
    try {
        const snapshot = await getDocs(query(usersCollection, where("email", "!=", ""))); // A simple query to check connection
        if (snapshot.empty) {
            console.log("Users collection is empty or not initialized, attempting to add default users...");
            for (const user of defaultUsers) {
                // Check if user already exists before adding
                const existingUserQuery = await getDocs(query(usersCollection, where("email", "==", user.email)));
                if(existingUserQuery.empty) {
                    await addDoc(usersCollection, user);
                }
            }
            console.log("Default users initialization check complete.");
        }
    } catch (error) {
        console.error("Failed to initialize default users. This might be a Firestore rules or configuration issue.", error);
        // We don't re-throw here, as login should still be attempted with existing data.
    }
}


// POST /api/auth/login
export async function POST(request: Request) {
    const rateLimitResponse = await rateLimitMiddleware(request);
    if (rateLimitResponse) return rateLimitResponse;

    try {
        // Run initialization check, but don't block login if it fails
        await initializeDefaultUsers();

        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
        }

        // Find the user by email
        const userQuery = query(usersCollection, where("email", "==", email));
        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
            return NextResponse.json({ message: 'Invalid credentials or user not found.' }, { status: 401 });
        }

        const userDoc = userSnapshot.docs[0];
        const foundUser = { id: userDoc.id, ...userDoc.data() } as User;

        // In a real app, you would compare a hashed password.
        // For this project, we'll stick to plaintext comparison as per existing logic.
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
