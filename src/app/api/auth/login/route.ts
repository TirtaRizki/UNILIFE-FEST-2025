
import { NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User } from '@/lib/types';
import { rateLimitMiddleware } from '@/lib/rate-limiter';

const usersCollection = collection(db, 'users');

// POST /api/auth/login
export async function POST(request: Request) {
    const rateLimitResponse = await rateLimitMiddleware(request);
    if (rateLimitResponse) return rateLimitResponse;

    try {
        const { email, password } = await request.json();

        // Find the user by email
        const q = query(usersCollection, where("email", "==", email));
        const userSnapshot = await getDocs(q);

        if (userSnapshot.empty) {
            return NextResponse.json({ message: 'Invalid credentials or user not found.' }, { status: 401 });
        }

        const userDoc = userSnapshot.docs[0];
        const foundUser = { id: userDoc.id, ...userDoc.data() } as User;

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
