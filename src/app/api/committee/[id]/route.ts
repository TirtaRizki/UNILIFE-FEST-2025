
import { NextResponse } from 'next/server';
import { db } from '@/lib/data';

// DELETE /api/committee/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const initialLength = db.committees.length;
        
        db.committees = db.committees.filter(c => c.id !== id);

        if (db.committees.length === initialLength) {
             return NextResponse.json({ message: 'Committee member not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Committee member deleted successfully' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error deleting committee member', error }, { status: 500 });
    }
}
