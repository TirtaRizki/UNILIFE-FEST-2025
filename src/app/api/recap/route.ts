
import { NextResponse } from 'next/server';
import type { Recap } from '@/lib/types';

// In-memory store (simulates a database)
if (!global.recaps) {
    global.recaps = [];
}

const getRecaps = (): Recap[] => {
    return global.recaps;
};

const saveRecaps = (recaps: Recap[]) => {
    global.recaps = recaps;
};

// GET /api/recap
export async function GET() {
    try {
        const recaps = getRecaps();
        return NextResponse.json(recaps);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching recaps', error }, { status: 500 });
    }
}

// POST /api/recap
export async function POST(request: Request) {
    try {
        const recapData: Recap = await request.json();
        const recaps = getRecaps();
        
        let savedRecap: Recap;
        let updatedRecaps;

        if (recapData.id) { // Update
            updatedRecaps = recaps.map(r => (r.id === recapData.id ? recapData : r));
            savedRecap = recapData;
        } else { // Create
            savedRecap = { ...recapData, id: `RCP${Date.now()}` };
            updatedRecaps = [...recaps, savedRecap];
        }

        saveRecaps(updatedRecaps);
        return NextResponse.json({ message: 'Recap saved successfully', recap: savedRecap }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: 'Error saving recap', error }, { status: 500 });
    }
}
