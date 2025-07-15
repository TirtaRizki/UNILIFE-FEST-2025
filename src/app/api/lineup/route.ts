
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import type { Lineup } from '@/lib/types';
import { getAuthenticatedUser } from '@/lib/auth';

const lineupsCollection = collection(db, 'lineups');

// GET /api/lineup
export async function GET() {
    try {
        const snapshot = await getDocs(lineupsCollection);
        const lineups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Lineup[];
        return NextResponse.json(lineups);
    } catch (error) {
        console.error("Error fetching lineups:", error);
        return NextResponse.json({ message: 'Error fetching lineups', error }, { status: 500 });
    }
}

// POST /api/lineup
export async function POST(request: Request) {
    try {
        const authUser = await getAuthenticatedUser();
        if (!authUser || !['Admin', 'Panitia'].includes(authUser.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const lineupData: Lineup = await request.json();
        let savedLineup: Lineup;

        if (lineupData.id) { // Update
            const lineupDoc = doc(db, "lineups", lineupData.id);
            const { id, ...dataToUpdate } = lineupData;
            await updateDoc(lineupDoc, dataToUpdate);
            savedLineup = lineupData;
        } else { // Create
            const { id, ...dataToAdd } = lineupData;
            const docRef = await addDoc(lineupsCollection, dataToAdd);
            savedLineup = { ...lineupData, id: docRef.id };
        }
        
        return NextResponse.json({ message: 'Lineup artist saved successfully', lineup: savedLineup }, { status: 201 });

    } catch (error) {
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        console.error("Error saving lineup:", error);
        return NextResponse.json({ message: 'Error saving lineup artist', error }, { status: 500 });
    }
}
