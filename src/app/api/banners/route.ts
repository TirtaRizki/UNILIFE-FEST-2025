
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import type { Banner } from '@/lib/types';
import { getBanners } from '@/lib/data-services';
import { revalidateTag } from 'next/cache';

const bannersCollection = collection(db, 'banners');

// GET /api/banners with caching
export async function GET() {
    try {
        const banners = await getBanners();
        return NextResponse.json(banners);
    } catch (error) {
        console.error("Error fetching banners:", error);
        return NextResponse.json({ message: 'Error fetching banners', error: (error as Error).message }, { status: 500 });
    }
}

// POST /api/banners
export async function POST(request: Request) {
    try {
        const bannerData: Banner = await request.json();
        let savedBanner: Banner;

        if (bannerData.id) { // Update
            const bannerDoc = doc(db, "banners", bannerData.id);
            const { id, ...dataToUpdate } = bannerData;
            await updateDoc(bannerDoc, dataToUpdate);
            savedBanner = bannerData;
        } else { // Create
            const { id, ...dataToAdd } = bannerData;
            const docRef = await addDoc(bannersCollection, dataToAdd);
            savedBanner = { ...bannerData, id: docRef.id };
        }
        
        revalidateTag('banners'); // Revalidate the cache for banners

        return NextResponse.json({ message: 'Banner saved successfully', banner: savedBanner }, { status: 201 });

    } catch (error) {
        console.error("Error saving banner:", error);
        return NextResponse.json({ message: 'Error saving banner', error: (error as Error).message }, { status: 500 });
    }
}
