
"use server";

import React from 'react';
import PublicHeaderClient from './public-header-client';
import { getBrandingSettings } from '@/lib/data-services';

const PublicHeader = async () => {
    const branding = await getBrandingSettings();
    // Pass the logoUrl to the client component. Use a default if it's null.
    const logoUrl = branding?.logoUrl || '/images/unilife_logo.png'; 

    return <PublicHeaderClient logoUrl={logoUrl} />;
};

export default PublicHeader;
