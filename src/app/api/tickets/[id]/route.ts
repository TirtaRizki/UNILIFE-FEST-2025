
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { getAuthenticatedUser } from '@/lib/auth';

// DELETE /api/tickets/{id} - Delete a ticket
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const authUser = await getAuthenticatedUser();
        if (!authUser || !['Admin', 'Panitia'].includes(authUser.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const id = params.id;
        const ticketDoc = doc(db, 'tickets', id);

        const docSnap = await getDoc(ticketDoc);
        if (!docSnap.exists()) {
             return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
        }
        
        await deleteDoc(ticketDoc);
        return NextResponse.json({ message: 'Ticket deleted successfully' }, { status: 200 });

    } catch (error) {
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        console.error("Error deleting ticket:", error);
        return NextResponse.json({ message: 'Error deleting ticket', error }, { status: 500 });
    }
}
