
import { NextResponse } from 'next/server';
import type { Ticket } from '@/lib/types';

// Helper functions to simulate database interaction with localStorage
// In a real app, these would be replaced with database calls (e.g., Prisma, Drizzle, etc.)
const getTicketsFromStorage = (): Ticket[] => {
    // NOTE: localStorage is not available in Node.js runtime. 
    // This is a simplified simulation. A real implementation would use a proper database.
    // For this simulation to work, we'll rely on a temporary in-memory store.
    // This will reset on every server restart.
    if (!global.tickets) {
        global.tickets = [];
    }
    return global.tickets;
};

const saveTicketsToStorage = (tickets: Ticket[]) => {
    global.tickets = tickets;
};

// GET /api/tickets - Fetch all tickets
export async function GET() {
    try {
        const tickets = getTicketsFromStorage();
        return NextResponse.json(tickets);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching tickets', error }, { status: 500 });
    }
}

// POST /api/tickets - Create a new ticket or update an existing one
export async function POST(request: Request) {
    try {
        const ticketData: Ticket = await request.json();
        const tickets = getTicketsFromStorage();
        
        let updatedTickets;

        if (ticketData.id) {
            // Update existing ticket
            updatedTickets = tickets.map(t => t.id === ticketData.id ? ticketData : t);
        } else {
            // Create new ticket
            const newTicket = { ...ticketData, id: `TKT${Date.now()}` };
            updatedTickets = [...tickets, newTicket];
        }

        saveTicketsToStorage(updatedTickets);
        return NextResponse.json({ message: 'Ticket saved successfully', ticket: ticketData.id ? ticketData : updatedTickets.find(t => t.id === newTicket.id) }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: 'Error saving ticket', error }, { status: 500 });
    }
}
