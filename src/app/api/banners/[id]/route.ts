
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { getAuthenticatedUser } from '@/lib/auth';

// DELETE /api/banners/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const authUser = await getAuthenticatedUser();
        if (!authUser || !['Admin', 'Panitia'].includes(authUser.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const id = params.id;
        const bannerDoc = doc(db, "banners", id);
        
        const docSnap = await getDoc(bannerDoc);
        if (!docSnap.exists()) {
             return NextResponse.json({ message: 'Banner not found' }, { status: 404 });
        }
        
        await deleteDoc(bannerDoc);
        return NextResponse.json({ message: 'Banner deleted successfully' }, { status: 200 });

    } catch (error) {
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        console.error("Error deleting banner:", error);
        return NextResponse.json({ message: 'Error deleting banner', error }, { status: 500 });
    }
}
