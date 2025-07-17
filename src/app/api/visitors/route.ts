
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, increment } from "firebase/firestore";
import { unstable_cache } from 'next/cache';

const visitorDocRef = doc(db, "siteStats", "visitors");

// GET /api/visitors - Fetches the current visitor count with caching
export const GET = async () => {
    try {
        const getCachedVisitorCount = unstable_cache(
            async () => {
                const docSnap = await getDoc(visitorDocRef);
                if (docSnap.exists()) {
                    return { count: docSnap.data().count };
                } else {
                    await setDoc(visitorDocRef, { count: 0 });
                    return { count: 0 };
                }
            },
            ['visitor-count'],
            { revalidate: 60 } // Cache for 1 minute
        );
        const data = await getCachedVisitorCount();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching visitor count:", error);
        return NextResponse.json({ message: 'Error fetching visitor count' }, { status: 500 });
    }
}

// POST /api/visitors - Increments the visitor count
export async function POST() {
    try {
        await setDoc(visitorDocRef, { count: increment(1) }, { merge: true });
        // We don't need to return the exact count here to improve performance.
        // The GET request will fetch the updated (or cached) count.
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error incrementing visitor count:", error);
        return NextResponse.json({ message: 'Error incrementing visitor count', error: (error as Error).message }, { status: 500 });
    }
}
