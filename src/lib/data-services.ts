
/**
 * @fileoverview This file contains data fetching services for the application.
 * It centralizes all Firestore queries, using the Firebase Admin SDK for server-side rendering.
 */
import { getAdminApp } from '@/lib/firebase-admin';
import type { About, Banner, Event, Lineup, Recap, BrandingSettings, User } from '@/lib/types';
import { unstable_cache } from 'next/cache';

// Helper function to get an initialized admin DB instance
const adminDb = () => getAdminApp().firestore();


// Re-usable function to fetch a collection and map the documents
async function getCollection<T>(collectionName: string, orderByField?: string, orderDirection: 'asc' | 'desc' = 'asc'): Promise<T[]> {
    try {
        let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = adminDb().collection(collectionName);
        if (orderByField) {
            query = query.orderBy(orderByField, orderDirection);
        }
        const snapshot = await query.get();
        if (snapshot.empty) {
            return [];
        }
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    } catch (error) {
        console.error(`Error fetching collection ${collectionName}:`, error);
        return []; // Return empty array on error to prevent breaking the page
    }
}

// Re-usable function to fetch a single document
async function getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
    try {
        const docRef = adminDb().collection(collectionName).doc(docId);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            return { id: docSnap.id, ...docSnap.data() } as T;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching document ${docId} from ${collectionName}:`, error);
        return null;
    }
}


// --- Branding Settings Service ---
const BRANDING_DOC_ID = 'singleton';

export const getBrandingSettings = unstable_cache(
    async (): Promise<BrandingSettings | null> => getDocument<BrandingSettings>('branding', BRANDING_DOC_ID),
    ['branding_settings'],
    { 
        revalidate: 3600,
        tags: ['branding_settings_tag'],
    } 
);

// --- About Service ---
export const getAboutData = unstable_cache(
    async (): Promise<About | null> => {
        const abouts = await getCollection<About>('abouts');
        return abouts.length > 0 ? abouts[0] : null; // Return the first (and only) about document
    },
    ['about_data'],
    { 
        revalidate: 300,
        tags: ['about_data'],
    }
);

// --- Banner Service ---
export const getBanners = unstable_cache(
    async (): Promise<Banner[]> => getCollection<Banner>('banners'),
    ['banners'],
    { 
        revalidate: 300,
        tags: ['banners'],
    }
);

// --- Event Service ---
export const getEvents = unstable_cache(
    async (): Promise<Event[]> => getCollection<Event>('events', 'date', 'asc'),
    ['events'],
    { 
        revalidate: 300,
        tags: ['events'],
    }
);

// --- Lineup Service ---
export const getLineups = unstable_cache(
    async (): Promise<Lineup[]> => getCollection<Lineup>('lineups', 'date', 'asc'),
    ['lineups'],
    { 
        revalidate: 300,
        tags: ['lineups'],
    }
);

// --- Recap Service ---
export const getRecaps = unstable_cache(
    async (): Promise<Recap[]> => getCollection<Recap>('recaps'),
    ['recaps'],
    { 
        revalidate: 300,
        tags: ['recaps'],
    }
);

// --- Visitor Service ---
export const getVisitorCount = unstable_cache(
    async (): Promise<number> => {
        try {
            const docRef = adminDb().collection("siteStats").doc("visitors");
            const docSnap = await docRef.get();
            if (docSnap.exists) {
                return docSnap.data()?.count || 0;
            }
            // If the document doesn't exist, create it.
            await docRef.set({ count: 0 });
            return 0;
        } catch (error) {
            console.error("Error fetching visitor count:", error);
            return 0;
        }
    },
    ['visitor_count'],
    {
        revalidate: 60, // Revalidate every minute
        tags: ['visitor_count'],
    }
);