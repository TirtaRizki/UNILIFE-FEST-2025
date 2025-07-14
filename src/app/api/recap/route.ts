
import { NextResponse } from 'next/server';
import { db } from '@/lib/data';
import type { Recap } from '@/lib/types';

// GET /api/recap
export async function GET() {
    try {
        const data = db.read();
        return NextResponse.json(data.recaps);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching recaps', error }, { status: 500 });
    }
}

// POST /api/recap
export async function POST(request: Request) {
    try {
        const recapData: Recap = await request.json();
        const data = db.read();
        let savedRecap: Recap;

        if (recapData.id) { // Update
            const index = data.recaps.findIndex(r => r.id === recapData.id);
            if (index !== -1) {
                data.recaps[index] = recapData;
                savedRecap = recapData;
            } else {
                return NextResponse.json({ message: 'Recap not found' }, { status: 404 });
            }
        } else { // Create
            savedRecap = { ...recapData, id: `RCP${Date.now()}` };
            data.recaps.push(savedRecap);
        }
        
        db.write(data);
        return NextResponse.json({ message: 'Recap saved successfully', recap: savedRecap }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: 'Error saving recap', error }, { status: 500 });
    }
}
