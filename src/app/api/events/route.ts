
import { NextResponse } from 'next/server';
import type { Event } from '@/lib/types';

// In-memory store (simulates a database)
if (!global.events) {
    global.events = [];
}

const getEvents = (): Event[] => {
    return global.events;
};

const saveEvents = (events: Event[]) => {
    global.events = events;
};

// GET /api/events
export async function GET() {
    try {
        const events = getEvents();
        return NextResponse.json(events);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching events', error }, { status: 500 });
    }
}

// POST /api/events
export async function POST(request: Request) {
    try {
        const eventData: Event = await request.json();
        const events = getEvents();
        
        let savedEvent: Event;
        let updatedEvents;

        if (eventData.id) { // Update
            updatedEvents = events.map(e => (e.id === eventData.id ? eventData : e));
            savedEvent = eventData;
        } else { // Create
            savedEvent = { ...eventData, id: `EVT${Date.now()}` };
            updatedEvents = [...events, savedEvent];
        }

        saveEvents(updatedEvents);
        return NextResponse.json({ message: 'Event saved successfully', event: savedEvent }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: 'Error saving event', error }, { status: 500 });
    }
}
