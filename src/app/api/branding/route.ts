
import { NextResponse } from 'next/server';
import { getBrandingSettings, saveBrandingSettings } from '@/lib/data-services';
import type { BrandingSettings } from '@/lib/types';
import { revalidateTag } from 'next/cache';
import { getAdminApp } from '@/lib/firebase-admin';

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
        // Ensure Admin SDK is initialized
        getAdminApp();

        const settings: BrandingSettings = await request.json();
        // Add some validation here if needed
        if (!settings.logoUrl) {
            return NextResponse.json({ message: 'Logo URL is required' }, { status: 400 });
        }
        await saveBrandingSettings(settings);
        
        // Revalidate the cache for the branding settings
        revalidateTag('branding_settings_tag');
        
        return NextResponse.json({ message: 'Branding settings saved successfully' }, { status: 200 });
    } catch (error) {
        console.error("Error saving branding settings:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during saving.";
        return NextResponse.json({ message: 'Error saving branding settings', error: errorMessage }, { status: 500 });
    }
}
