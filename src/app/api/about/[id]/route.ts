
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { getAuthenticatedUser } from '@/lib/auth';

// DELETE /api/about/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const authUser = await getAuthenticatedUser();
        if (!authUser || !['Admin', 'Panitia'].includes(authUser.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const id = params.id;
        const aboutDoc = doc(db, "abouts", id);
        
        const docSnap = await getDoc(aboutDoc);
        if (!docSnap.exists()) {
             return NextResponse.json({ message: 'About content not found' }, { status: 404 });
        }
        
        await deleteDoc(aboutDoc);
        return NextResponse.json({ message: 'About content deleted successfully' }, { status: 200 });

    } catch (error) {
         if (error instanceof Error && error.message.includes('Unauthorized')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        console.error("Error deleting about content:", error);
        return NextResponse.json({ message: 'Error deleting about content', error }, { status: 500 });
    }
}
