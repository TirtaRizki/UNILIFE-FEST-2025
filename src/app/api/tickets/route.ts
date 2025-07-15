
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import type { Ticket } from '@/lib/types';
import { getAuthenticatedUser } from '@/lib/auth';

const ticketsCollection = collection(db, 'tickets');

// GET /api/tickets - Fetch all tickets
export async function GET() {
    try {
        const snapshot = await getDocs(ticketsCollection);
        const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Ticket[];
        return NextResponse.json(tickets);
    } catch (error) {
        console.error("Error fetching tickets:", error);
        return NextResponse.json({ message: 'Error fetching tickets', error }, { status: 500 });
    }
}

// POST /api/tickets - Create a new ticket or update an existing one
export async function POST(request: Request) {
    try {
        const authUser = await getAuthenticatedUser();
        if (!authUser || !['Admin', 'Panitia'].includes(authUser.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const ticketData: Ticket = await request.json();
        let savedTicket: Ticket;

        if (ticketData.id) {
            // Update existing ticket
            const ticketDoc = doc(db, 'tickets', ticketData.id);
            const { id, ...dataToUpdate } = ticketData;
            await updateDoc(ticketDoc, dataToUpdate);
            savedTicket = ticketData;
        } else {
            // Create new ticket
            const { id, ...dataToAdd } = ticketData;
            const docRef = await addDoc(ticketsCollection, dataToAdd);
            savedTicket = { ...ticketData, id: docRef.id };
        }
        
        return NextResponse.json({ message: 'Ticket saved successfully', ticket: savedTicket }, { status: 201 });

    } catch (error) {
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        console.error("Error saving ticket:", error);
        return NextResponse.json({ message: 'Error saving ticket', error }, { status: 500 });
    }
}
