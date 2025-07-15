
import { NextResponse } from 'next/server';
import { db } from '@/lib/data';
import type { User } from '@/lib/types';

// POST /api/auth/login
export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        const data = db.read();
        const users = data.users;
        
        const foundUser = users.find(user => 
            user.email === email && 
            user.password === password &&
            (user.role === 'Admin' || user.role === 'Panitia')
        );

        if (foundUser) {
            const { password, ...userToReturn } = foundUser;
            return NextResponse.json({ message: 'Login successful', user: userToReturn });
        } else {
            return NextResponse.json({ message: 'Invalid credentials or not an Admin/Panitia account.' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'An internal server error occurred', error }, { status: 500 });
    }
}
