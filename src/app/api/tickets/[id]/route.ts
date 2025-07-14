
import { NextResponse } from 'next/server';
import type { Ticket } from '@/lib/types';

// Helper functions to simulate database interaction.
const getTicketsFromStorage = (): Ticket[] => {
    if (!global.tickets) {
        global.tickets = [];
    }
    return global.tickets;
};

const saveTicketsToStorage = (tickets: Ticket[]) => {
    global.tickets = tickets;
};

// DELETE /api/tickets/{id} - Delete a ticket
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        let tickets = getTicketsFromStorage();
        const initialLength = tickets.length;
        
        tickets = tickets.filter(t => t.id !== id);

        if (tickets.length === initialLength) {
             return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
        }

        saveTicketsToStorage(tickets);
        return NextResponse.json({ message: 'Ticket deleted successfully' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error deleting ticket', error }, { status: 500 });
    }
}
