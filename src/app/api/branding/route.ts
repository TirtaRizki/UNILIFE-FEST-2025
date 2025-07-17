
import { NextResponse } from 'next/server';
import { getAdminApp } from '@/lib/firebase-admin';
import { getBrandingSettings } from '@/lib/data-services';
import type { BrandingSettings } from '@/lib/types';
import { revalidateTag } from 'next/cache';

// GET /api/branding
export async function GET() {
    try {
        const settings = await getBrandingSettings();
        return NextResponse.json(settings || {});
    } catch (error) {
        console.error("Error fetching branding settings:", error);
        return NextResponse.json({ message: 'Error fetching branding settings' }, { status: 500 });
    }
}

// POST /api/branding
export async function POST(request: Request) {
    try {
        // Initialize Admin SDK right when the API is called to ensure it's ready.
        const adminApp = getAdminApp();
        const adminDb = adminApp.firestore();

        const settings: BrandingSettings = await request.json();
        
        if (!settings.logoUrl) {
            return NextResponse.json({ message: 'Logo URL is required' }, { status: 400 });
        }

        // Directly use the initialized adminDb instance to save settings.
        await adminDb.collection('branding').doc('singleton').set(settings, { merge: true });
        
        // Revalidate the cache tag so the new logo appears everywhere.
        revalidateTag('branding_settings_tag');
        
        return NextResponse.json({ message: 'Branding settings saved successfully' }, { status: 200 });
    } catch (error) {
        console.error("Error saving branding settings:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during saving.";
        return NextResponse.json({ message: 'Error saving branding settings', error: errorMessage }, { status: 500 });
    }
}
