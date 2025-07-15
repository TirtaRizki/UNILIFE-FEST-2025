
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import type { User } from '@/lib/types';

const usersCollection = collection(db, 'users');

// GET /api/users
export async function GET() {
    try {
        const snapshot = await getDocs(usersCollection);
        const users = snapshot.docs.map(doc => {
            const data = doc.data();
            const { password, ...user } = data;
            return { id: doc.id, ...user };
        });
        return NextResponse.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ message: 'Error fetching users', error }, { status: 500 });
    }
}

// POST /api/users
export async function POST(request: Request) {
    try {
        const userData: User = await request.json();
        let savedUser: User;
        const { id, ...data } = userData;

        if (id) { // Update
            const userDoc = doc(db, "users", id);
            await updateDoc(userDoc, data);
            savedUser = userData;
        } else { // Create
            // Check if email already exists
            const q = query(usersCollection, where("email", "==", userData.email));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
            }
            const docRef = await addDoc(usersCollection, data);
            savedUser = { ...userData, id: docRef.id };
        }
        
        const { password, ...userToReturn } = savedUser!;
        return NextResponse.json({ message: 'User saved successfully', user: userToReturn }, { status: 201 });
    } catch (error) {
        console.error("Error saving user:", error);
        return NextResponse.json({ message: 'Error saving user', error }, { status: 500 });
    }
}
