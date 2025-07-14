
import { NextResponse } from 'next/server';
import { db } from '@/lib/data';

// DELETE /api/banners/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const initialLength = db.banners.length;
        
        db.banners = db.banners.filter(b => b.id !== id);

        if (db.banners.length === initialLength) {
             return NextResponse.json({ message: 'Banner not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Banner deleted successfully' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error deleting banner', error }, { status: 500 });
    }
}
