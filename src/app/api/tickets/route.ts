
import { NextResponse } from 'next/server';
import { db } from '@/lib/data';
import type { Ticket } from '@/lib/types';

// GET /api/tickets - Fetch all tickets
export async function GET() {
    try {
        return NextResponse.json(db.tickets);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching tickets', error }, { status: 500 });
    }
}

// POST /api/tickets - Create a new ticket or update an existing one
export async function POST(request: Request) {
    try {
        const ticketData: Ticket = await request.json();
        const tickets = db.tickets;
        let savedTicket: Ticket;

        if (ticketData.id) {
            // Update existing ticket
            const index = tickets.findIndex(t => t.id === ticketData.id);
            if (index !== -1) {
                tickets[index] = ticketData;
                savedTicket = ticketData;
            } else {
                return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
            }
        } else {
            // Create new ticket
            savedTicket = { ...ticketData, id: `TKT${Date.now()}` };
            tickets.push(savedTicket);
        }

        return NextResponse.json({ message: 'Ticket saved successfully', ticket: savedTicket }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: 'Error saving ticket', error }, { status: 500 });
    }
}
