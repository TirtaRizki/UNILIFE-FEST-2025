
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import type { Event } from '@/lib/types';
import { getAuthenticatedUser } from '@/lib/auth';

const eventsCollection = collection(db, 'events');

// GET /api/events
export async function GET() {
    try {
        const snapshot = await getDocs(eventsCollection);
        const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Event[];
        return NextResponse.json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json({ message: 'Error fetching events', error }, { status: 500 });
    }
}

// POST /api/events
export async function POST(request: Request) {
    try {
        const authUser = await getAuthenticatedUser();
        if (!authUser || !['Admin', 'Panitia'].includes(authUser.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const eventData: Event = await request.json();
        let savedEvent: Event;

        if (eventData.id) { // Update
            const eventDoc = doc(db, "events", eventData.id);
            const { id, ...dataToUpdate } = eventData;
            await updateDoc(eventDoc, dataToUpdate);
            savedEvent = eventData;
        } else { // Create
            const { id, ...dataToAdd } = eventData;
            const docRef = await addDoc(eventsCollection, dataToAdd);
            savedEvent = { ...eventData, id: docRef.id };
        }
        
        return NextResponse.json({ message: 'Event saved successfully', event: savedEvent }, { status: 201 });

    } catch (error) {
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        console.error("Error saving event:", error);
        return NextResponse.json({ message: 'Error saving event', error }, { status: 500 });
    }
}
