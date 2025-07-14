
import { NextResponse } from 'next/server';
import { db } from '@/lib/data';
import type { Event } from '@/lib/types';

// GET /api/events
export async function GET() {
    try {
        const data = db.read();
        return NextResponse.json(data.events);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching events', error }, { status: 500 });
    }
}

// POST /api/events
export async function POST(request: Request) {
    try {
        const eventData: Event = await request.json();
        const data = db.read();
        let savedEvent: Event;

        if (eventData.id) { // Update
             const index = data.events.findIndex(e => e.id === eventData.id);
            if (index !== -1) {
                data.events[index] = eventData;
                savedEvent = eventData;
            } else {
                return NextResponse.json({ message: 'Event not found' }, { status: 404 });
            }
        } else { // Create
            savedEvent = { ...eventData, id: `EVT${Date.now()}` };
            data.events.push(savedEvent);
        }
        
        db.write(data);
        return NextResponse.json({ message: 'Event saved successfully', event: savedEvent }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: 'Error saving event', error }, { status: 500 });
    }
}
