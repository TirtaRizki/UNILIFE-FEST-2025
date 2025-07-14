
import { NextResponse } from 'next/server';
import { db } from '@/lib/data';
import type { Banner } from '@/lib/types';
import { getAuthenticatedUser } from '@/lib/auth';

// GET /api/banners
export async function GET() {
    try {
        const data = db.read();
        return NextResponse.json(data.banners);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching banners', error }, { status: 500 });
    }
}

// POST /api/banners
export async function POST(request: Request) {
    try {
        const authUser = await getAuthenticatedUser();
        if (!authUser || !['Admin', 'Panitia'].includes(authUser.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const bannerData: Banner = await request.json();
        const data = db.read();
        let savedBanner: Banner;

        if (bannerData.id) { // Update
            const index = data.banners.findIndex(b => b.id === bannerData.id);
            if (index !== -1) {
                data.banners[index] = bannerData;
                savedBanner = bannerData;
            } else {
                return NextResponse.json({ message: 'Banner not found' }, { status: 404 });
            }
        } else { // Create
            savedBanner = { ...bannerData, id: `BNR${Date.now()}` };
            data.banners.push(savedBanner);
        }
        
        db.write(data);
        return NextResponse.json({ message: 'Banner saved successfully', banner: savedBanner }, { status: 201 });

    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        return NextResponse.json({ message: 'Error saving banner', error }, { status: 500 });
    }
}
