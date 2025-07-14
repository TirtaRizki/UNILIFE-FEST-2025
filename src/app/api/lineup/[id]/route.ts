
import { NextResponse } from 'next/server';
import type { Lineup } from '@/lib/types';

const getLineups = (): Lineup[] => {
    if (!global.lineups) {
        global.lineups = [];
    }
    return global.lineups;
};

const saveLineups = (lineups: Lineup[]) => {
    global.lineups = lineups;
};

// DELETE /api/lineup/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        let lineups = getLineups();
        const initialLength = lineups.length;
        
        lineups = lineups.filter(l => l.id !== id);

        if (lineups.length === initialLength) {
             return NextResponse.json({ message: 'Lineup artist not found' }, { status: 404 });
        }

        saveLineups(lineups);
        return NextResponse.json({ message: 'Lineup artist deleted successfully' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error deleting lineup artist', error }, { status: 500 });
    }
}
