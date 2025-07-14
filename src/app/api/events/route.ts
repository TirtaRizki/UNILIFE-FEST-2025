
import { NextResponse } from 'next/server';
import { db } from '@/lib/data';
import type { Event } from '@/lib/types';

// GET /api/events
export async function GET() {
    try {
        return NextResponse.json(db.events);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching events', error }, { status: 500 });
    }
}

// POST /api/events
export async function POST(request: Request) {
    try {
        const eventData: Event = await request.json();
        const events = db.events;
        let savedEvent: Event;

        if (eventData.id) { // Update
             const index = events.findIndex(e => e.id === eventData.id);
            if (index !== -1) {
                events[index] = eventData;
                savedEvent = eventData;
            } else {
                return NextResponse.json({ message: 'Event not found' }, { status: 404 });
            }
        } else { // Create
            savedEvent = { ...eventData, id: `EVT${Date.now()}` };
            events.push(savedEvent);
        }

        return NextResponse.json({ message: 'Event saved successfully', event: savedEvent }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: 'Error saving event', error }, { status: 500 });
    }
}
