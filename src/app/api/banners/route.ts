
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import type { Banner } from '@/lib/types';
import { getAuthenticatedUser } from '@/lib/auth';

const bannersCollection = collection(db, 'banners');

// GET /api/banners
export async function GET() {
    try {
        const snapshot = await getDocs(bannersCollection);
        const banners = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Banner[];
        return NextResponse.json(banners);
    } catch (error) {
        console.error("Error fetching banners:", error);
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
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        console.error("Error saving banner:", error);
        return NextResponse.json({ message: 'Error saving banner', error }, { status: 500 });
    }
}
