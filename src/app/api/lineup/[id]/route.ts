
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { getAuthenticatedUser } from '@/lib/auth';

// DELETE /api/lineup/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const authUser = await getAuthenticatedUser();
        if (!authUser || !['Admin', 'Panitia'].includes(authUser.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const id = params.id;
        const lineupDoc = doc(db, "lineups", id);
        
        const docSnap = await getDoc(lineupDoc);
        if (!docSnap.exists()) {
             return NextResponse.json({ message: 'Lineup artist not found' }, { status: 404 });
        }
        
        await deleteDoc(lineupDoc);
        return NextResponse.json({ message: 'Lineup artist deleted successfully' }, { status: 200 });

    } catch (error) {
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        console.error("Error deleting lineup artist:", error);
        return NextResponse.json({ message: 'Error deleting lineup artist', error }, { status: 500 });
    }
}
