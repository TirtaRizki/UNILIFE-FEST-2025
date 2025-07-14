
import { NextResponse } from 'next/server';
import { db } from '@/lib/data';
import { getAuthenticatedUser } from '@/lib/auth';

// DELETE /api/events/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const authUser = await getAuthenticatedUser();
        if (!authUser || !['Admin', 'Panitia'].includes(authUser.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const id = params.id;
        const data = db.read();
        const initialLength = data.events.length;
        
        data.events = data.events.filter(e => e.id !== id);

        if (data.events.length === initialLength) {
             return NextResponse.json({ message: 'Event not found' }, { status: 404 });
        }
        
        db.write(data);
        return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });

    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        return NextResponse.json({ message: 'Error deleting event', error }, { status: 500 });
    }
}
