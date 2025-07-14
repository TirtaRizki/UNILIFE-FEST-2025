
import { NextResponse } from 'next/server';
import type { Lineup } from '@/lib/types';

// In-memory store (simulates a database)
if (!global.lineups) {
    global.lineups = [];
}

const getLineups = (): Lineup[] => {
    return global.lineups;
};

const saveLineups = (lineups: Lineup[]) => {
    global.lineups = lineups;
};

// GET /api/lineup
export async function GET() {
    try {
        const lineups = getLineups();
        return NextResponse.json(lineups);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching lineups', error }, { status: 500 });
    }
}

// POST /api/lineup
export async function POST(request: Request) {
    try {
        const lineupData: Lineup = await request.json();
        const lineups = getLineups();
        
        let savedLineup: Lineup;
        let updatedLineups;

        if (lineupData.id) { // Update
            updatedLineups = lineups.map(l => (l.id === lineupData.id ? lineupData : l));
            savedLineup = lineupData;
        } else { // Create
            savedLineup = { ...lineupData, id: `LNP${Date.now()}` };
            updatedLineups = [...lineups, savedLineup];
        }

        saveLineups(updatedLineups);
        return NextResponse.json({ message: 'Lineup artist saved successfully', lineup: savedLineup }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: 'Error saving lineup artist', error }, { status: 500 });
    }
}
