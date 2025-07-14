
import { NextResponse } from 'next/server';
import type { Banner } from '@/lib/types';

// In-memory store (simulates a database)
if (!global.banners) {
    global.banners = [];
}

const getBanners = (): Banner[] => {
    return global.banners;
};

const saveBanners = (banners: Banner[]) => {
    global.banners = banners;
};

// GET /api/banners
export async function GET() {
    try {
        const banners = getBanners();
        return NextResponse.json(banners);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching banners', error }, { status: 500 });
    }
}

// POST /api/banners
export async function POST(request: Request) {
    try {
        const bannerData: Banner = await request.json();
        const banners = getBanners();
        
        let savedBanner: Banner;
        let updatedBanners;

        if (bannerData.id) { // Update
            updatedBanners = banners.map(b => (b.id === bannerData.id ? bannerData : b));
            savedBanner = bannerData;
        } else { // Create
            savedBanner = { ...bannerData, id: `BNR${Date.now()}` };
            updatedBanners = [...banners, savedBanner];
        }

        saveBanners(updatedBanners);
        return NextResponse.json({ message: 'Banner saved successfully', banner: savedBanner }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: 'Error saving banner', error }, { status: 500 });
    }
}
