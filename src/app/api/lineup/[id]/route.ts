
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { revalidateTag } from 'next/cache';

// DELETE /api/lineup/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const lineupDoc = doc(db, "lineups", id);
        
        const docSnap = await getDoc(lineupDoc);
        if (!docSnap.exists()) {
             return NextResponse.json({ message: 'Lineup artist not found' }, { status: 404 });
        }
        
        await deleteDoc(lineupDoc);
        revalidateTag('lineups'); // Revalidate the cache for lineups

        return NextResponse.json({ message: 'Lineup artist deleted successfully' }, { status: 200 });

    } catch (error) {
        console.error("Error deleting lineup artist:", error);
        return NextResponse.json({ message: 'Error deleting lineup artist', error }, { status: 500 });
    }
}
