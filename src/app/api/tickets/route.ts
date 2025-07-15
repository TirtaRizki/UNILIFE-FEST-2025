
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import type { Ticket } from '@/lib/types';

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
        console.error("Error saving ticket:", error);
        return NextResponse.json({ message: 'Error saving ticket', error }, { status: 500 });
    }
}
