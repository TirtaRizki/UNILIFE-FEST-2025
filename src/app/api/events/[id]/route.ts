
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { getAuthenticatedUser } from '@/lib/auth';

// DELETE /api/events/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const authUser = await getAuthenticatedUser();
        if (!authUser || !['Admin', 'Panitia'].includes(authUser.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const id = params.id;
        const eventDoc = doc(db, "events", id);

        const docSnap = await getDoc(eventDoc);
        if (!docSnap.exists()) {
             return NextResponse.json({ message: 'Event not found' }, { status: 404 });
        }
        
        await deleteDoc(eventDoc);
        return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });

    } catch (error) {
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        console.error("Error deleting event:", error);
        return NextResponse.json({ message: 'Error deleting event', error }, { status: 500 });
    }
}
