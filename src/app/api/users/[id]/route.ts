
import { NextResponse } from 'next/server';
import type { User } from '@/lib/types';

const getFullUsers = (): User[] => {
    if (!global.users) {
        global.users = [];
    }
    return global.users;
}

const saveUsers = (users: User[]) => {
    global.users = users;
}

// DELETE /api/users/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        let users = getFullUsers();
        const initialLength = users.length;
        
        users = users.filter(u => u.id !== id);

        if (users.length === initialLength) {
             return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        saveUsers(users);
        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error deleting user', error }, { status: 500 });
    }
}
