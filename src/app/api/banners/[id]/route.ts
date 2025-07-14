
import { NextResponse } from 'next/server';
import type { Banner } from '@/lib/types';

const getBanners = (): Banner[] => {
    if (!global.banners) {
        global.banners = [];
    }
    return global.banners;
};

const saveBanners = (banners: Banner[]) => {
    global.banners = banners;
};

// DELETE /api/banners/{id}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        let banners = getBanners();
        const initialLength = banners.length;
        
        banners = banners.filter(b => b.id !== id);

        if (banners.length === initialLength) {
             return NextResponse.json({ message: 'Banner not found' }, { status: 404 });
        }

        saveBanners(banners);
        return NextResponse.json({ message: 'Banner deleted successfully' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error deleting banner', error }, { status: 500 });
    }
}
