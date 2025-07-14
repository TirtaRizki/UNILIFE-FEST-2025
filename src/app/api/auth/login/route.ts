
import { NextResponse } from 'next/server';
import type { User } from '@/lib/types';

// In-memory store (simulates a database)
if (!global.users) {
    global.users = [
        { id: 'USR001', name: 'Admin User', email: 'admin@unilifefest.com', role: 'Admin', password: 'unilifejaya123', phoneNumber: '081234567890' },
        { id: 'USR002', name: 'Panitia Event', email: 'panitia2025@unilife.com', role: 'Panitia', password: 'lampungfest123', phoneNumber: '080987654321' }
    ];
}

const getFullUsers = (): User[] => {
    return global.users;
}

// POST /api/auth/login
export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        const users = getFullUsers();
        
        const foundUser = users.find(user => user.email === email && user.password === password);

        if (foundUser) {
            const { password, ...userToReturn } = foundUser;
            return NextResponse.json({ message: 'Login successful', user: userToReturn });
        } else {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'An internal server error occurred', error }, { status: 500 });
    }
}
