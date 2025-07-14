
import { NextResponse } from 'next/server';
import { db } from '@/lib/data';
import type { Banner } from '@/lib/types';

// GET /api/banners
export async function GET() {
    try {
        return NextResponse.json(db.banners);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching banners', error }, { status: 500 });
    }
}

// POST /api/banners
export async function POST(request: Request) {
    try {
        const bannerData: Banner = await request.json();
        const banners = db.banners;
        let savedBanner: Banner;

        if (bannerData.id) { // Update
            const index = banners.findIndex(b => b.id === bannerData.id);
            if (index !== -1) {
                banners[index] = bannerData;
                savedBanner = bannerData;
            } else {
                return NextResponse.json({ message: 'Banner not found' }, { status: 404 });
            }
        } else { // Create
            savedBanner = { ...bannerData, id: `BNR${Date.now()}` };
            banners.push(savedBanner);
        }

        return NextResponse.json({ message: 'Banner saved successfully', banner: savedBanner }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: 'Error saving banner', error }, { status: 500 });
    }
}
