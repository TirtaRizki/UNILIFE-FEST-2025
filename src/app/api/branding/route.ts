
import { NextResponse } from 'next/server';
import { getBrandingSettings, saveBrandingSettings } from '@/lib/data-services';
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
        return NextResponse.json({ message: 'Error saving branding settings' }, { status: 500 });
    }
}
