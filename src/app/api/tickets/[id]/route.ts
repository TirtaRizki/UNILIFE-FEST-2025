
import { NextResponse } from 'next/server';
import { db } from '@/lib/data';

// DELETE /api/tickets/{id} - Delete a ticket
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const data = db.read();
        const initialLength = data.tickets.length;
        
        data.tickets = data.tickets.filter(t => t.id !== id);

        if (data.tickets.length === initialLength) {
             return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
        }
        
        db.write(data);
        return NextResponse.json({ message: 'Ticket deleted successfully' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error deleting ticket', error }, { status: 500 });
    }
}
