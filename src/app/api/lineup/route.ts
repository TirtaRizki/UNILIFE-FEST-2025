
import { NextResponse } from 'next/server';
import { db } from '@/lib/data';
import type { Lineup } from '@/lib/types';

// GET /api/lineup
export async function GET() {
    try {
        return NextResponse.json(db.lineups);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching lineups', error }, { status: 500 });
    }
}

// POST /api/lineup
export async function POST(request: Request) {
    try {
        const lineupData: Lineup = await request.json();
        const lineups = db.lineups;
        let savedLineup: Lineup;

        if (lineupData.id) { // Update
            const index = lineups.findIndex(l => l.id === lineupData.id);
            if (index !== -1) {
                lineups[index] = lineupData;
                savedLineup = lineupData;
            } else {
                return NextResponse.json({ message: 'Lineup artist not found' }, { status: 404 });
            }
        } else { // Create
            savedLineup = { ...lineupData, id: `LNP${Date.now()}` };
            lineups.push(savedLineup);
        }

        return NextResponse.json({ message: 'Lineup artist saved successfully', lineup: savedLineup }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: 'Error saving lineup artist', error }, { status: 500 });
    }
}
