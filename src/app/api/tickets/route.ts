
import { NextResponse } from 'next/server';
import { db } from '@/lib/data';
import type { Ticket } from '@/lib/types';
import { getAuthenticatedUser } from '@/lib/auth';

// GET /api/tickets - Fetch all tickets
export async function GET() {
    try {
        const data = db.read();
        return NextResponse.json(data.tickets);
    } catch (error) {
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
        const data = db.read();
        let savedTicket: Ticket;

        if (ticketData.id) {
            // Update existing ticket
            const index = data.tickets.findIndex(t => t.id === ticketData.id);
            if (index !== -1) {
                data.tickets[index] = ticketData;
                savedTicket = ticketData;
            } else {
                return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
            }
        } else {
            // Create new ticket
            savedTicket = { ...ticketData, id: `TKT${Date.now()}` };
            data.tickets.push(savedTicket);
        }
        
        db.write(data);
        return NextResponse.json({ message: 'Ticket saved successfully', ticket: savedTicket }, { status: 201 });

    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        return NextResponse.json({ message: 'Error saving ticket', error }, { status: 500 });
    }
}
