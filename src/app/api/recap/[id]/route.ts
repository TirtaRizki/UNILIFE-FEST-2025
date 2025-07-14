
import { NextResponse } from 'next/server';
import { db } from '@/lib/data';

// DELETE /api/recap/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const data = db.read();
        const initialLength = data.recaps.length;
        
        data.recaps = data.recaps.filter(r => r.id !== id);

        if (data.recaps.length === initialLength) {
             return NextResponse.json({ message: 'Recap not found' }, { status: 404 });
        }
        
        db.write(data);
        return NextResponse.json({ message: 'Recap deleted successfully' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error deleting recap', error }, { status: 500 });
    }
}
