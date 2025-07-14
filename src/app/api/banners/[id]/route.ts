
import { NextResponse } from 'next/server';
import { db } from '@/lib/data';

// DELETE /api/banners/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const data = db.read();
        const initialLength = data.banners.length;
        
        data.banners = data.banners.filter(b => b.id !== id);

        if (data.banners.length === initialLength) {
             return NextResponse.json({ message: 'Banner not found' }, { status: 404 });
        }
        
        db.write(data);
        return NextResponse.json({ message: 'Banner deleted successfully' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error deleting banner', error }, { status: 500 });
    }
}
