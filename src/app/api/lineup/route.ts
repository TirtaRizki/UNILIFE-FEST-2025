
import { NextResponse } from 'next/server';
import { db } from '@/lib/data';
import type { Lineup } from '@/lib/types';
import { getAuthenticatedUser } from '@/lib/auth';

// GET /api/lineup
export async function GET() {
    try {
        const data = db.read();
        return NextResponse.json(data.lineups);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching lineups', error }, { status: 500 });
    }
}

// POST /api/lineup
export async function POST(request: Request) {
    try {
        const authUser = await getAuthenticatedUser();
        if (!authUser || !['Admin', 'Panitia'].includes(authUser.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const lineupData: Lineup = await request.json();
        const data = db.read();
        let savedLineup: Lineup;

        if (lineupData.id) { // Update
            const index = data.lineups.findIndex(l => l.id === lineupData.id);
            if (index !== -1) {
                data.lineups[index] = lineupData;
                savedLineup = lineupData;
            } else {
                return NextResponse.json({ message: 'Lineup artist not found' }, { status: 404 });
            }
        } else { // Create
            savedLineup = { ...lineupData, id: `LNP${Date.now()}` };
            data.lineups.push(savedLineup);
        }
        
        db.write(data);
        return NextResponse.json({ message: 'Lineup artist saved successfully', lineup: savedLineup }, { status: 201 });

    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        return NextResponse.json({ message: 'Error saving lineup artist', error }, { status: 500 });
    }
}
