
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, addDoc, updateDoc } from 'firebase/firestore';
import type { About } from '@/lib/types';
import { getAuthenticatedUser } from '@/lib/auth';

const aboutsCollection = collection(db, 'abouts');

// GET /api/about
export async function GET() {
    try {
        const snapshot = await getDocs(aboutsCollection);
        const abouts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as About[];
        return NextResponse.json(abouts);
    } catch (error) {
        console.error("Error fetching abouts:", error);
        return NextResponse.json({ message: 'Error fetching about content', error }, { status: 500 });
    }
}

// POST /api/about
export async function POST(request: Request) {
    try {
        const authUser = await getAuthenticatedUser();
        if (!authUser || !['Admin', 'Panitia'].includes(authUser.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const aboutData: About = await request.json();
        let savedAbout: About;

        if (aboutData.id) { // Update
            const aboutDoc = doc(db, "abouts", aboutData.id);
            const { id, ...dataToUpdate } = aboutData;
            await updateDoc(aboutDoc, dataToUpdate);
            savedAbout = aboutData;
        } else { // Create
            const { id, ...dataToAdd } = aboutData;
            const docRef = await addDoc(aboutsCollection, dataToAdd);
            savedAbout = { ...aboutData, id: docRef.id };
        }

        return NextResponse.json({ message: 'About content saved successfully', about: savedAbout }, { status: 201 });

    } catch (error) {
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        console.error("Error saving about content:", error);
        return NextResponse.json({ message: 'Error saving about content', error }, { status: 500 });
    }
}
