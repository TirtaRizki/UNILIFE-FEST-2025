
import { NextResponse } from 'next/server';
import { db } from '@/lib/data';
import { getAuthenticatedUser } from '@/lib/auth';

// DELETE /api/lineup/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const authUser = await getAuthenticatedUser();
        if (!authUser || !['Admin', 'Panitia'].includes(authUser.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const id = params.id;
        const data = db.read();
        const initialLength = data.lineups.length;
        
        data.lineups = data.lineups.filter(l => l.id !== id);

        if (data.lineups.length === initialLength) {
             return NextResponse.json({ message: 'Lineup artist not found' }, { status: 404 });
        }
        
        db.write(data);
        return NextResponse.json({ message: 'Lineup artist deleted successfully' }, { status: 200 });

    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        return NextResponse.json({ message: 'Error deleting lineup artist', error }, { status: 500 });
    }
}
