
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { getAuthenticatedUser } from '@/lib/auth';

// DELETE /api/recap/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const authUser = await getAuthenticatedUser();
        if (!authUser || !['Admin', 'Panitia'].includes(authUser.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const id = params.id;
        const recapDoc = doc(db, "recaps", id);

        const docSnap = await getDoc(recapDoc);
        if (!docSnap.exists()) {
             return NextResponse.json({ message: 'Recap not found' }, { status: 404 });
        }
        
        await deleteDoc(recapDoc);
        return NextResponse.json({ message: 'Recap deleted successfully' }, { status: 200 });

    } catch (error) {
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        console.error("Error deleting recap:", error);
        return NextResponse.json({ message: 'Error deleting recap', error }, { status: 500 });
    }
}
