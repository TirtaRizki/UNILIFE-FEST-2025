
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, addDoc, updateDoc, collection } from 'firebase/firestore';
import type { About } from '@/lib/types';
import { getAboutData } from '@/lib/data-services';

// GET /api/about
export async function GET() {
    try {
        const abouts = await getAboutData();
        // The service returns a single object or null, but API might expect an array
        const data = abouts ? [abouts] : [];
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching abouts:", error);
        return NextResponse.json({ message: 'Error fetching about content', error: (error as Error).message }, { status: 500 });
    }
}

// POST /api/about
export async function POST(request: Request) {
    try {
        const aboutData: About = await request.json();
        let savedAbout: About;

        if (aboutData.id) { // Update
            const aboutDoc = doc(db, "abouts", aboutData.id);
            const { id, ...dataToUpdate } = aboutData;
            await updateDoc(aboutDoc, dataToUpdate);
            savedAbout = aboutData;
        } else { // Create
            // Since there should only be one about page, this logic handles creation.
            // A more robust solution might use a known document ID.
            const { id, ...dataToAdd } = aboutData;
            const docRef = await addDoc(collection(db, 'abouts'), dataToAdd);
            savedAbout = { ...aboutData, id: docRef.id };
        }

        return NextResponse.json({ message: 'About content saved successfully', about: savedAbout }, { status: 201 });

    } catch (error) {
        console.error("Error saving about content:", error);
        return NextResponse.json({ message: 'Error saving about content', error: (error as Error).message }, { status: 500 });
    }
}
