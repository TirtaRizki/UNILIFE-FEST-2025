
import { NextResponse } from 'next/server';
import { db } from '@/lib/data';
import type { User } from '@/lib/types';

// GET /api/users
export async function GET() {
    try {
        const users = db.users.map(({ password, ...user }) => user); // Don't send password to client
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching users', error }, { status: 500 });
    }
}

// POST /api/users
export async function POST(request: Request) {
    try {
        const userData: User = await request.json();
        const users = db.users;
        let savedUser: User;

        if (userData.id) { // Update
            const userIndex = users.findIndex(u => u.id === userData.id);
            if (userIndex !== -1) {
                const updated = { ...users[userIndex], ...userData };
                if (!userData.password) {
                    updated.password = users[userIndex].password; // Keep old password if not provided
                }
                users[userIndex] = updated;
                savedUser = updated;
            } else {
                 return NextResponse.json({ message: 'User not found for update' }, { status: 404 });
            }
        } else { // Create
            savedUser = { ...userData, id: `USR${Date.now()}` };
            users.push(savedUser);
        }

        const { password, ...userToReturn } = savedUser!;
        return NextResponse.json({ message: 'User saved successfully', user: userToReturn }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error saving user', error }, { status: 500 });
    }
}
