
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';

// DELETE /api/recap/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const recapDoc = doc(db, "recaps", id);

        const docSnap = await getDoc(recapDoc);
        if (!docSnap.exists()) {
             return NextResponse.json({ message: 'Recap not found' }, { status: 404 });
        }
        
        await deleteDoc(recapDoc);
        return NextResponse.json({ message: 'Recap deleted successfully' }, { status: 200 });

    } catch (error) {
        console.error("Error deleting recap:", error);
        return NextResponse.json({ message: 'Error deleting recap', error }, { status: 500 });
    }
}
