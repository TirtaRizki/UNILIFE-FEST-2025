
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import type { User } from '@/lib/types';
import { rateLimitMiddleware } from '@/lib/rate-limiter';

// POST /api/auth/login
export async function POST(request: Request) {
    const rateLimitResponse = await rateLimitMiddleware(request);
    if (rateLimitResponse) return rateLimitResponse;

    try {
        const { email, password } = await request.json();
        const db = adminDb(); // Correctly call the function to get the db instance
        const usersCollection = db.collection('users');

        // Find the user by email
        const userQuery = usersCollection.where("email", "==", email);
        const userSnapshot = await userQuery.get();

        if (userSnapshot.empty) {
            return NextResponse.json({ message: 'Invalid credentials or user not found.' }, { status: 401 });
        }

        const userDoc = userSnapshot.docs[0];
        const foundUser = { id: userDoc.id, ...userDoc.data() } as User;

        // Directly compare passwords (assuming they are stored as plain text as per the seed script)
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
