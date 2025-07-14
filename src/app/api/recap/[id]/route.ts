
import { NextResponse } from 'next/server';
import { db } from '@/lib/data';

// DELETE /api/recap/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const initialLength = db.recaps.length;
        
        db.recaps = db.recaps.filter(r => r.id !== id);

        if (db.recaps.length === initialLength) {
             return NextResponse.json({ message: 'Recap not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Recap deleted successfully' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error deleting recap', error }, { status: 500 });
    }
}
