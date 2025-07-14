
import { NextResponse } from 'next/server';
import { db } from '@/lib/data';
import { getAuthenticatedUser } from '@/lib/auth';

// DELETE /api/about/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const authUser = await getAuthenticatedUser();
        if (!authUser || !['Admin', 'Panitia'].includes(authUser.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const id = params.id;
        const data = db.read();
        const initialLength = data.abouts.length;
        
        data.abouts = data.abouts.filter(a => a.id !== id);

        if (data.abouts.length === initialLength) {
             return NextResponse.json({ message: 'About content not found' }, { status: 404 });
        }
        
        db.write(data);
        return NextResponse.json({ message: 'About content deleted successfully' }, { status: 200 });

    } catch (error) {
         if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        return NextResponse.json({ message: 'Error deleting about content', error }, { status: 500 });
    }
}
