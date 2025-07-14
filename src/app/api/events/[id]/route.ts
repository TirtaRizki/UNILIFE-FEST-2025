
import { NextResponse } from 'next/server';
import type { Event } from '@/lib/types';

const getEvents = (): Event[] => {
    if (!global.events) {
        global.events = [];
    }
    return global.events;
};

const saveEvents = (events: Event[]) => {
    global.events = events;
};

// DELETE /api/events/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        let events = getEvents();
        const initialLength = events.length;
        
        events = events.filter(e => e.id !== id);

        if (events.length === initialLength) {
             return NextResponse.json({ message: 'Event not found' }, { status: 404 });
        }

        saveEvents(events);
        return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error deleting event', error }, { status: 500 });
    }
}
