
/**
 * @fileoverview This file contains data fetching services for the application.
 * It centralizes all Firestore queries and uses Next.js caching for performance.
 */
import { unstable_cache } from 'next/cache';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, doc, getDoc, setDoc } from 'firebase/firestore';
import type { About, Banner, Event, Lineup, Recap, BrandingSettings } from '@/lib/types';

// --- Branding Settings Service ---
const BRANDING_DOC_ID = 'singleton';
const brandingDocRef = doc(db, "branding", BRANDING_DOC_ID);

export const getBrandingSettings = unstable_cache(
    async (): Promise<BrandingSettings | null> => {
        try {
            const docSnap = await getDoc(brandingDocRef);
            if (docSnap.exists()) {
                return docSnap.data() as BrandingSettings;
            }
            return null;
        } catch (error) {
            console.error("Error fetching branding settings:", error);
            return null;
        }
    },
    ['branding_settings'],
    { 
        revalidate: 3600, // Revalidate every hour
        tags: ['branding_settings_tag'], // Add a tag for on-demand revalidation
    } 
);

export const saveBrandingSettings = async (settings: BrandingSettings) => {
    try {
        await setDoc(brandingDocRef, settings, { merge: true });
    } catch (error) {
        console.error("Error saving branding settings:", error);
        throw error;
    }
};


// --- About Service ---
export const getAboutData = unstable_cache(
    async (): Promise<About | null> => {
        try {
            const aboutsCollection = collection(db, 'abouts');
            const snapshot = await getDocs(aboutsCollection);
            const abouts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as About[];
            return abouts.length > 0 ? abouts[0] : null;
        } catch (error) {
            console.error("Error fetching about data:", error);
            // In a production environment, you might want to log this to a service like Sentry
            return null;
        }
    },
    ['about_data'], // Cache key
    { revalidate: 300 } // Revalidate every 5 minutes
);


// --- Banner Service ---
export const getBanners = unstable_cache(
    async (): Promise<Banner[]> => {
        try {
            const bannersCollection = collection(db, 'banners');
            const snapshot = await getDocs(bannersCollection);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Banner[];
        } catch (error) {
            console.error("Error fetching banners:", error);
            return [];
        }
    },
    ['banners'],
    { revalidate: 300 }
);

// --- Event Service ---
export const getEvents = unstable_cache(
    async (): Promise<Event[]> => {
        try {
            const eventsCollection = collection(db, 'events');
            const snapshot = await getDocs(eventsCollection);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Event[];
        } catch (error) {
            console.error("Error fetching events:", error);
            return [];
        }
    },
    ['events'],
    { revalidate: 300 }
);


// --- Lineup Service ---
export const getLineups = unstable_cache(
    async (): Promise<Lineup[]> => {
        try {
            const lineupsCollection = collection(db, 'lineups');
            const q = query(lineupsCollection, orderBy("date", "asc"));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Lineup[];
        } catch (error) {
            console.error("Error fetching lineups:", error);
            return [];
        }
    },
    ['lineups'],
    { revalidate: 300 }
);

// --- Recap Service ---
export const getRecaps = unstable_cache(
    async (): Promise<Recap[]> => {
        try {
            const recapsCollection = collection(db, 'recaps');
            const snapshot = await getDocs(recapsCollection);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Recap[];
        } catch (error) {
            console.error("Error fetching recaps:", error);
            return [];
        }
    },
    ['recaps'],
    { revalidate: 300 }
);
