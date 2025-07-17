
"use server";

import React from 'react';
import PublicHeaderClient from './public-header-client';
import { getBrandingSettings } from '@/lib/data-services';

const PublicHeader = async () => {
    const branding = await getBrandingSettings();
    const logoUrl = branding?.logoUrl || '/images/unilife_logo.png';

    return <PublicHeaderClient logoUrl={logoUrl} />;
};

export default PublicHeader;
