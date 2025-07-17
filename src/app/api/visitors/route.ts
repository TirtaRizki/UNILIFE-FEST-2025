
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, increment } from "firebase/firestore";

const visitorDocRef = doc(db, "siteStats", "visitors");

// GET /api/visitors - Fetches the current visitor count
export async function GET() {
    try {
        const docSnap = await getDoc(visitorDocRef);
        if (docSnap.exists()) {
            return NextResponse.json({ count: docSnap.data().count });
        } else {
            // If the document doesn't exist, create it.
            await setDoc(visitorDocRef, { count: 0 });
            return NextResponse.json({ count: 0 });
        }
    } catch (error) {
        console.error("Error fetching visitor count:", error);
        return NextResponse.json({ message: 'Error fetching visitor count' }, { status: 500 });
    }
}

// POST /api/visitors - Increments the visitor count
export async function POST() {
    try {
        // Ensure the document exists before incrementing
        const docSnap = await getDoc(visitorDocRef);
        if (!docSnap.exists()) {
            await setDoc(visitorDocRef, { count: 0 });
        }
        
        await setDoc(visitorDocRef, { count: increment(1) }, { merge: true });
        
        // We don't need to return the exact count here to improve performance.
        // The GET request will fetch the updated (or cached) count.
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error incrementing visitor count:", error);
        return NextResponse.json({ message: 'Error incrementing visitor count', error: (error as Error).message }, { status: 500 });
    }
}
