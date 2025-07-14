
import { NextResponse } from 'next/server';
import { db } from '@/lib/data';

// DELETE /api/lineup/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const initialLength = db.lineups.length;
        
        db.lineups = db.lineups.filter(l => l.id !== id);

        if (db.lineups.length === initialLength) {
             return NextResponse.json({ message: 'Lineup artist not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Lineup artist deleted successfully' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error deleting lineup artist', error }, { status: 500 });
    }
}
