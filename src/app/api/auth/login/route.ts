
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

// POST /api/auth/login
export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, 
            where("email", "==", email),
            where("password", "==", password)
        );
        
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return NextResponse.json({ message: 'Invalid credentials or not an Admin/Panitia account.' }, { status: 401 });
        }
        
        const userDoc = querySnapshot.docs[0];
        const foundUser = { id: userDoc.id, ...userDoc.data() };

        if (foundUser.role === 'Admin' || foundUser.role === 'Panitia') {
            const { password, ...userToReturn } = foundUser;
            return NextResponse.json({ message: 'Login successful', user: userToReturn });
        } else {
            return NextResponse.json({ message: 'Invalid credentials or not an Admin/Panitia account.' }, { status: 401 });
        }
        
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ message: 'An internal server error occurred', error }, { status: 500 });
    }
}
