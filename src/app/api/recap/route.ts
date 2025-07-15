
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import type { Recap } from '@/lib/types';
import { getAuthenticatedUser } from '@/lib/auth';

const recapsCollection = collection(db, 'recaps');

// GET /api/recap
export async function GET() {
    try {
        const snapshot = await getDocs(recapsCollection);
        const recaps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Recap[];
        return NextResponse.json(recaps);
    } catch (error) {
        console.error("Error fetching recaps:", error);
        return NextResponse.json({ message: 'Error fetching recaps', error }, { status: 500 });
    }
}

// POST /api/recap
export async function POST(request: Request) {
    try {
        const authUser = await getAuthenticatedUser();
        if (!authUser || !['Admin', 'Panitia'].includes(authUser.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const recapData: Recap = await request.json();
        let savedRecap: Recap;

        if (recapData.id) { // Update
            const recapDoc = doc(db, "recaps", recapData.id);
            const { id, ...dataToUpdate } = recapData;
            await updateDoc(recapDoc, dataToUpdate);
            savedRecap = recapData;
        } else { // Create
            const { id, ...dataToAdd } = recapData;
            const docRef = await addDoc(recapsCollection, dataToAdd);
            savedRecap = { ...recapData, id: docRef.id };
        }
        
        return NextResponse.json({ message: 'Recap saved successfully', recap: savedRecap }, { status: 201 });

    } catch (error) {
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        console.error("Error saving recap:", error);
        return NextResponse.json({ message: 'Error saving recap', error }, { status: 500 });
    }
}
