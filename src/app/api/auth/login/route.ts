
import { NextResponse } from 'next/server';
import type { User } from '@/lib/types';

// Hardcoded default users - This list is used to bootstrap the first users if the database is empty.
const defaultUsers: User[] = [
    { id: 'default-admin', email: 'admin@unilifefest.com', password: 'unilifejaya123', role: 'Admin', name: 'Super Admin', phoneNumber: '08001234567' },
    { id: 'default-panitia', email: 'panitia2025@unilife.com', password: 'lampungfest123', role: 'Panitia', name: 'Panitia 2025', phoneNumber: '08119876543' }
];

// Helper function to simulate database interaction. In a real app, this would be a Firestore call.
const findUserByEmail = (email: string, allUsers: User[]): User | undefined => {
    return allUsers.find(u => u.email === email);
};

// In a real app, you wouldn't store all users in localStorage. 
// This is a simplified approach for this project's scope.
// We'll simulate fetching all users. For this example, we'll just use the defaults.
const getAllUsers = (): User[] => {
    // This is a placeholder. In a real scenario, you'd fetch from Firestore.
    // For this simulation, we'll assume the defaults are the only users if none are in a simulated DB.
    return [...defaultUsers];
};


// POST /api/auth/login
export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        
        // This is a simulation of fetching users from a database.
        // In this project, user data is managed on the client-side via localStorage after login.
        // For the login process itself, we'll check against a hardcoded list of default/initial users.
        const allUsers = getAllUsers();
        
        const foundUser = findUserByEmail(email, allUsers);

        if (!foundUser || foundUser.password !== password) {
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
        return NextResponse.json({ message: 'An internal server error occurred', error: (error as Error).message }, { status: 500 });
    }
}
