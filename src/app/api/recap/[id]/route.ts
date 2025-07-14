
import { NextResponse } from 'next/server';
import type { Recap } from '@/lib/types';

const getRecaps = (): Recap[] => {
    if (!global.recaps) {
        global.recaps = [];
    }
    return global.recaps;
};

const saveRecaps = (recaps: Recap[]) => {
    global.recaps = recaps;
};

// DELETE /api/recap/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        let recaps = getRecaps();
        const initialLength = recaps.length;
        
        recaps = recaps.filter(r => r.id !== id);

        if (recaps.length === initialLength) {
             return NextResponse.json({ message: 'Recap not found' }, { status: 404 });
        }

        saveRecaps(recaps);
        return NextResponse.json({ message: 'Recap deleted successfully' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error deleting recap', error }, { status: 500 });
    }
}
