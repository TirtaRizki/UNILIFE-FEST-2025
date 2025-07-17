
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import type { Banner } from '@/lib/types';
import { unstable_cache } from 'next/cache';

const bannersCollection = collection(db, 'banners');

// GET /api/banners with caching
export async function GET() {
    try {
        const getCachedBanners = unstable_cache(
            async () => {
                const snapshot = await getDocs(bannersCollection);
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Banner[];
            },
            ['banners'],
            { revalidate: 300 } // Revalidate every 5 minutes
        );
        const banners = await getCachedBanners();
        return NextResponse.json(banners);
    } catch (error) {
        console.error("Error fetching banners:", error);
        return NextResponse.json({ message: 'Error fetching banners', error }, { status: 500 });
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
        
        return NextResponse.json({ message: 'Banner saved successfully', banner: savedBanner }, { status: 201 });

    } catch (error) {
        console.error("Error saving banner:", error);
        return NextResponse.json({ message: 'Error saving banner', error }, { status: 500 });
    }
}
