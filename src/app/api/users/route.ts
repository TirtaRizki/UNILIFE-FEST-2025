
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

const saveUsers = (users: User[]) => {
    global.users = users;
}

// GET /api/users
export async function GET() {
    try {
        const users = getFullUsers().map(({ password, ...user }) => user); // Don't send password to client
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching users', error }, { status: 500 });
    }
}

// POST /api/users
export async function POST(request: Request) {
    try {
        const userData: User = await request.json();
        const users = getFullUsers();
        let updatedUsers;
        let savedUser: User;

        if (userData.id) { // Update
            updatedUsers = users.map(u => {
                if (u.id === userData.id) {
                    const updated = { ...u, ...userData };
                    if (!userData.password) {
                        updated.password = u.password; // Keep old password if not provided
                    }
                    savedUser = updated;
                    return updated;
                }
                return u;
            });
        } else { // Create
            savedUser = { ...userData, id: `USR${Date.now()}` };
            updatedUsers = [...users, savedUser];
        }

        saveUsers(updatedUsers);
        const { password, ...userToReturn } = savedUser!;
        return NextResponse.json({ message: 'User saved successfully', user: userToReturn }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error saving user', error }, { status: 500 });
    }
}
