
import { NextResponse } from 'next/server';
import type { About } from '@/lib/types';

// In-memory store (simulates a database)
if (!global.abouts) {
    global.abouts = [];
}

const getAbouts = (): About[] => {
    return global.abouts;
};

const saveAbouts = (abouts: About[]) => {
    global.abouts = abouts;
};

// GET /api/about
export async function GET() {
    try {
        const abouts = getAbouts();
        return NextResponse.json(abouts);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching about content', error }, { status: 500 });
    }
}

// POST /api/about
export async function POST(request: Request) {
    try {
        const aboutData: About = await request.json();
        const abouts = getAbouts();
        
        let savedAbout: About;
        let updatedAbouts;

        if (aboutData.id) { // Update
            updatedAbouts = abouts.map(a => (a.id === aboutData.id ? aboutData : a));
            savedAbout = aboutData;
        } else { // Create
            savedAbout = { ...aboutData, id: `ABT${Date.now()}` };
            updatedAbouts = [...abouts, savedAbout];
        }

        saveAbouts(updatedAbouts);
        return NextResponse.json({ message: 'About content saved successfully', about: savedAbout }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: 'Error saving about content', error }, { status: 500 });
    }
}
