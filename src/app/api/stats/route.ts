
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';

// GET /api/stats
export async function GET() {
    try {
        const usersCollection = collection(db, 'users');
        const committeesCollection = collection(db, 'committees');
        const eventsCollection = collection(db, 'events');
        const lineupsCollection = collection(db, 'lineups');
        
        // Firestore requires an index for this query. If the index doesn't exist, this will fail.
        // For now, we'll get the count of all events, then filter in memory, which is inefficient.
        // A better long-term solution is to create the composite index in Firebase console.
        const activeEventsQuery = query(eventsCollection, where("status", "==", "Upcoming"));

        const [
            usersSnapshot,
            committeesSnapshot,
            activeEventsSnapshot,
            lineupsSnapshot,
        ] = await Promise.all([
            getCountFromServer(usersCollection),
            getCountFromServer(committeesCollection),
            getCountFromServer(activeEventsQuery),
            getCountFromServer(lineupsCollection),
        ]);
        
        const stats = {
            usersCount: usersSnapshot.data().count,
            committeesCount: committeesSnapshot.data().count,
            activeEventsCount: activeEventsSnapshot.data().count,
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
