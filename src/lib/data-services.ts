
/**
 * @fileoverview This file contains data fetching services for the application.
 * It centralizes all Firestore queries and uses Next.js caching for performance.
 */
import { unstable_cache } from 'next/cache';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, doc, getDoc, setDoc } from 'firebase/firestore';
import type { About, Banner, Event, Lineup, Recap, BrandingSettings } from '@/lib/types';

// Helper function to get the base URL for API calls
// In production, this should be set to the public domain.
const getBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_APP_URL) {
        return process.env.NEXT_PUBLIC_APP_URL;
    }
    // Fallback for local development
    return 'http://localhost:9002';
};


// --- Branding Settings Service ---
const BRANDING_DOC_ID = 'singleton';
const brandingDocRef = doc(db, "branding", BRANDING_DOC_ID);

export const getBrandingSettings = unstable_cache(
    async (): Promise<BrandingSettings | null> => {
        try {
            const apiUrl = `${getBaseUrl()}/api/branding`;
            const response = await fetch(apiUrl, { next: { tags: ['branding_settings_tag'] } });
            if (!response.ok) {
                 console.error(`Failed to fetch branding settings: ${response.status}`);
                 return null;
            }
            return response.json();
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
             const apiUrl = `${getBaseUrl()}/api/about`;
             const response = await fetch(apiUrl, { next: { tags: ['about_data'] }});
             if (!response.ok) {
                console.error(`Failed to fetch about data: ${response.status}`);
                return null;
             }
             const data = await response.json();
             // The API returns an array, but we only need the first item for the landing page
             return data.length > 0 ? data[0] : null;
        } catch (error) {
            console.error("Error fetching about data:", error);
            return null;
        }
    },
    ['about_data'], // Cache key
    { 
        revalidate: 300, // Revalidate every 5 minutes
        tags: ['about_data'],
    }
);


// --- Banner Service ---
export const getBanners = unstable_cache(
    async (): Promise<Banner[]> => {
        try {
            const apiUrl = `${getBaseUrl()}/api/banners`;
            const response = await fetch(apiUrl, { next: { tags: ['banners'] }});
             if (!response.ok) {
                console.error(`Failed to fetch banners: ${response.status}`);
                return [];
             }
            return response.json();
        } catch (error) {
            console.error("Error fetching banners:", error);
            return [];
        }
    },
    ['banners'],
    { 
        revalidate: 300,
        tags: ['banners'],
    }
);

// --- Event Service ---
export const getEvents = unstable_cache(
    async (): Promise<Event[]> => {
        try {
            const apiUrl = `${getBaseUrl()}/api/events`;
            const response = await fetch(apiUrl, { next: { tags: ['events'] }});
            if (!response.ok) {
                console.error(`Failed to fetch events: ${response.status}`);
                return [];
            }
            return response.json();
        } catch (error) {
            console.error("Error fetching events:", error);
            return [];
        }
    },
    ['events'],
    { 
        revalidate: 300,
        tags: ['events'],
    }
);


// --- Lineup Service ---
export const getLineups = unstable_cache(
    async (): Promise<Lineup[]> => {
        try {
            const apiUrl = `${getBaseUrl()}/api/lineup`;
            const response = await fetch(apiUrl, { next: { tags: ['lineups'] }});
             if (!response.ok) {
                console.error(`Failed to fetch lineups: ${response.status}`);
                return [];
            }
            const data = await response.json();
            // Perform sorting here after fetching
            data.sort((a: Lineup, b: Lineup) => new Date(a.date).getTime() - new Date(b.date).getTime());
            return data;
        } catch (error) {
            console.error("Error fetching lineups:", error);
            return [];
        }
    },
    ['lineups'],
    { 
        revalidate: 300,
        tags: ['lineups'],
    }
);

// --- Recap Service ---
export const getRecaps = unstable_cache(
    async (): Promise<Recap[]> => {
        try {
            const apiUrl = `${getBaseUrl()}/api/recap`;
            const response = await fetch(apiUrl, { next: { tags: ['recaps'] }});
            if (!response.ok) {
                console.error(`Failed to fetch recaps: ${response.status}`);
                return [];
            }
            return response.json();
        } catch (error) {
            console.error("Error fetching recaps:", error);
            return [];
        }
    },
    ['recaps'],
    { 
        revalidate: 300,
        tags: ['recaps'],
    }
);
