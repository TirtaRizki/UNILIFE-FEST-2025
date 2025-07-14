
import { NextResponse } from 'next/server';
import { db } from '@/lib/data';
import type { User } from '@/lib/types';

// GET /api/users
export async function GET() {
    try {
        const data = db.read();
        const users = data.users.map(({ password, ...user }) => user); // Don't send password to client
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching users', error }, { status: 500 });
    }
}

// POST /api/users
export async function POST(request: Request) {
    try {
        const userData: User = await request.json();
        const data = db.read();
        let savedUser: User;

        if (userData.id) { // Update
            const userIndex = data.users.findIndex(u => u.id === userData.id);
            if (userIndex !== -1) {
                const updated = { ...data.users[userIndex], ...userData };
                if (!userData.password) {
                    updated.password = data.users[userIndex].password; // Keep old password if not provided
                }
                data.users[userIndex] = updated;
                savedUser = updated;
            } else {
                 return NextResponse.json({ message: 'User not found for update' }, { status: 404 });
            }
        } else { // Create
            // Check if email already exists
            if (data.users.some(user => user.email === userData.email)) {
                return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
            }
            savedUser = { ...userData, id: `USR${Date.now()}` };
            data.users.push(savedUser);
        }
        
        db.write(data);
        const { password, ...userToReturn } = savedUser!;
        return NextResponse.json({ message: 'User saved successfully', user: userToReturn }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error saving user', error }, { status: 500 });
    }
}
