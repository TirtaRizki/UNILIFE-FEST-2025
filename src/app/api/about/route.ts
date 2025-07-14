
import { NextResponse } from 'next/server';
import { db } from '@/lib/data';
import type { About } from '@/lib/types';

// GET /api/about
export async function GET() {
    try {
        return NextResponse.json(db.abouts);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching about content', error }, { status: 500 });
    }
}

// POST /api/about
export async function POST(request: Request) {
    try {
        const aboutData: About = await request.json();
        const abouts = db.abouts;
        let savedAbout: About;

        if (aboutData.id) { // Update
            const index = abouts.findIndex(a => a.id === aboutData.id);
            if (index !== -1) {
                abouts[index] = aboutData;
                savedAbout = aboutData;
            } else {
                return NextResponse.json({ message: 'About content not found' }, { status: 404 });
            }
        } else { // Create
            savedAbout = { ...aboutData, id: `ABT${Date.now()}` };
            abouts.push(savedAbout);
        }

        return NextResponse.json({ message: 'About content saved successfully', about: savedAbout }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: 'Error saving about content', error }, { status: 500 });
    }
}
