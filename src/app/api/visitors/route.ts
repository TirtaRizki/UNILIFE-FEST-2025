
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, increment, runTransaction } from "firebase/firestore";

const visitorDocRef = doc(db, "siteStats", "visitors");

// GET /api/visitors - Fetches the current visitor count
export async function GET() {
    try {
        const docSnap = await getDoc(visitorDocRef);

        if (docSnap.exists()) {
            return NextResponse.json({ count: docSnap.data().count });
        } else {
            // If the document doesn't exist, initialize it
            await setDoc(visitorDocRef, { count: 0 });
            return NextResponse.json({ count: 0 });
        }
    } catch (error) {
        console.error("Error fetching visitor count:", error);
        return NextResponse.json({ message: 'Error fetching visitor count', error: (error as Error).message }, { status: 500 });
    }
}


// POST /api/visitors - Increments the visitor count
export async function POST() {
    try {
        let finalCount = 0;
        
        await runTransaction(db, async (transaction) => {
            const visitorDoc = await transaction.get(visitorDocRef);
            
            if (!visitorDoc.exists()) {
                transaction.set(visitorDocRef, { count: 1 });
                finalCount = 1;
            } else {
                const newCount = visitorDoc.data().count + 1;
                transaction.update(visitorDocRef, { count: newCount });
                finalCount = newCount;
            }
        });

        return NextResponse.json({ count: finalCount });

    } catch (error) {
        console.error("Error incrementing visitor count:", error);
        return NextResponse.json({ message: 'Error incrementing visitor count', error: (error as Error).message }, { status: 500 });
    }
}
