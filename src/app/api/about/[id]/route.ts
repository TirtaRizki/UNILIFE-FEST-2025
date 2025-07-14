
import { NextResponse } from 'next/server';
import { db } from '@/lib/data';

// DELETE /api/about/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
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
        return NextResponse.json({ message: 'Error deleting about content', error }, { status: 500 });
    }
}
