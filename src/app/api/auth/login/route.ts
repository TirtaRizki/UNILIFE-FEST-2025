
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import type { User } from '@/lib/types';

// Hardcoded default users
const defaultUsers = [
    { email: 'admin@unilifefest.com', password: 'unilifejaya123', role: 'Admin', name: 'Super Admin' },
    { email: 'panitia2025@unilife.com', password: 'lampungfest123', role: 'Panitia', name: 'Panitia 2025' }
];

// POST /api/auth/login
export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        
        const usersCollection = collection(db, 'users');
        
        // Check if it's a default user trying to log in
        const defaultUser = defaultUsers.find(u => u.email === email);
        
        // Query for the user in Firestore
        const q = query(usersCollection, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            // User not found in Firestore. If it's a default user, create them.
            if (defaultUser && defaultUser.password === password) {
                const { ...userData } = defaultUser;
                const docRef = await addDoc(usersCollection, userData);
                
                const userToReturn: Omit<User, 'password'> = {
                    id: docRef.id,
                    name: userData.name,
                    email: userData.email,
                    role: userData.role as "Admin" | "Panitia",
                };
                
                return NextResponse.json({ message: 'Login successful, default user created.', user: userToReturn });
            } else {
                 return NextResponse.json({ message: 'Invalid credentials or user not found.' }, { status: 401 });
            }
        }
        
        // User exists in Firestore, validate password
        const userDoc = querySnapshot.docs[0];
        const foundUser = { id: userDoc.id, ...userDoc.data() } as User;

        if (foundUser.password !== password) {
             return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
        }

        if (foundUser.role === 'Admin' || foundUser.role === 'Panitia') {
            const { password, ...userToReturn } = foundUser;
            return NextResponse.json({ message: 'Login successful', user: userToReturn });
        } else {
            return NextResponse.json({ message: 'This account does not have admin/committee privileges.' }, { status: 403 });
        }
        
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ message: 'An internal server error occurred', error: (error as Error).message }, { status: 500 });
    }
}
