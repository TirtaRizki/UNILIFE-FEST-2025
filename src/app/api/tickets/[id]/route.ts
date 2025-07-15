
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, deleteDoc, getDoc } from "firebase/firestore";

// DELETE /api/tickets/{id} - Delete a ticket
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const ticketDoc = doc(db, 'tickets', id);

        const docSnap = await getDoc(ticketDoc);
        if (!docSnap.exists()) {
             return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
        }
        
        await deleteDoc(ticketDoc);
        return NextResponse.json({ message: 'Ticket deleted successfully' }, { status: 200 });

    } catch (error) {
        console.error("Error deleting ticket:", error);
        return NextResponse.json({ message: 'Error deleting ticket', error }, { status: 500 });
    }
}
