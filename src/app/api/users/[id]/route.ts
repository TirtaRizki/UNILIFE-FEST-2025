
import { NextResponse } from 'next/server';
import { db } from '@/lib/data';

// DELETE /api/users/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const data = db.read();
        const initialLength = data.users.length;
        
        data.users = data.users.filter(u => u.id !== id);

        if (data.users.length === initialLength) {
             return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        
        db.write(data);
        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error deleting user', error }, { status: 500 });
    }
}
