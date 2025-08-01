
import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase-admin';
import { revalidateTag } from 'next/cache';


// GET /api/visitors - Fetches the current visitor count
export async function GET() {
    try {
        const db = adminDb();
        const visitorDocRef = db.collection("siteStats").doc("visitors");
        const docSnap = await visitorDocRef.get();
        if (docSnap.exists) {
            const data = docSnap.data();
            return NextResponse.json({ count: data?.count || 0 });
        } else {
            // If the document doesn't exist, create it.
            await visitorDocRef.set({ count: 0 });
            return NextResponse.json({ count: 0 });
        }
    } catch (error) {
        console.error("Error fetching visitor count:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return NextResponse.json({ message: 'Error fetching visitor count', error: errorMessage }, { status: 500 });
    }
}

// POST /api/visitors - Increments the visitor count
export async function POST() {
    try {
        const db = adminDb();
        const visitorDocRef = db.collection("siteStats").doc("visitors");
        const docSnap = await visitorDocRef.get();
        if (!docSnap.exists) {
            await visitorDocRef.set({ count: 1 });
        } else {
            await visitorDocRef.update({ count: FieldValue.increment(1) });
        }
        // Revalidate the tag to update the cached visitor count
        revalidateTag('visitor_count');
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error incrementing visitor count:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return NextResponse.json({ message: 'Error incrementing visitor count', error: errorMessage }, { status: 500 });
    }
}
