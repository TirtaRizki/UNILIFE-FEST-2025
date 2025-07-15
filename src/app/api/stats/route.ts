
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getCountFromServer, getDocs, query, where } from 'firebase/firestore';
import type { Event } from '@/lib/types';

// GET /api/stats
export async function GET() {
    try {
        const usersCollection = collection(db, 'users');
        const committeesCollection = collection(db, 'committees');
        const eventsCollection = collection(db, 'events');
        const lineupsCollection = collection(db, 'lineups');
        
        // Fetch all events and filter in memory to avoid needing a composite index for now.
        // This is more robust for environments where the index might not be created.
        const allEventsSnapshot = await getDocs(eventsCollection);
        const allEvents = allEventsSnapshot.docs.map(doc => doc.data() as Event);
        const activeEventsCount = allEvents.filter(event => event.status === 'Upcoming').length;

        const [
            usersSnapshot,
            committeesSnapshot,
            lineupsSnapshot,
        ] = await Promise.all([
            getCountFromServer(usersCollection),
            getCountFromServer(committeesCollection),
            getCountFromServer(lineupsCollection),
        ]);
        
        const stats = {
            usersCount: usersSnapshot.data().count,
            committeesCount: committeesSnapshot.data().count,
            activeEventsCount: activeEventsCount, // Use the count filtered in-memory
            lineupsCount: lineupsSnapshot.data().count,
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error("Error fetching stats:", error);
        // If the error is due to a missing index, we can try to return partial data or a more specific error message.
        if (error instanceof Error && (error as any).code === 'failed-precondition') {
             return NextResponse.json({ 
                message: 'Query requires a composite index. Please create it in your Firebase console.', 
                details: (error as Error).message,
             }, { status: 500 });
        }
        return NextResponse.json({ message: 'Error fetching stats', error: (error as Error).message }, { status: 500 });
    }
}
