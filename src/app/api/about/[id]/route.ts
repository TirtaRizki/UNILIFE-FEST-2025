
import { NextResponse } from 'next/server';
import type { About } from '@/lib/types';

const getAbouts = (): About[] => {
    if (!global.abouts) {
        global.abouts = [];
    }
    return global.abouts;
};

const saveAbouts = (abouts: About[]) => {
    global.abouts = abouts;
};

// DELETE /api/about/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        let abouts = getAbouts();
        const initialLength = abouts.length;
        
        abouts = abouts.filter(a => a.id !== id);

        if (abouts.length === initialLength) {
             return NextResponse.json({ message: 'About content not found' }, { status: 404 });
        }

        saveAbouts(abouts);
        return NextResponse.json({ message: 'About content deleted successfully' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error deleting about content', error }, { status: 500 });
    }
}
