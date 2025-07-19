
"use client";

import React, { useState, useEffect } from 'react';
import PublicHeaderClient from './public-header-client';
import { Skeleton } from '../ui/skeleton';


const PublicHeader = () => {
    const [logoUrl, setLogoUrl] = useState('/images/unilife_logo.png');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const response = await fetch('/api/branding');
                if (response.ok) {
                    const settings = await response.json();
                    if (settings?.logoUrl) {
                        setLogoUrl(settings.logoUrl);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch branding settings for header", error);
                // Keep the fallback logo
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogo();
    }, []);

    // While loading, you could show a placeholder or nothing
    if (isLoading) {
       return (
            <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
                 <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        <Skeleton className="h-8 w-32" />
                    </div>
                 </div>
            </header>
       )
    }

    return <PublicHeaderClient logoUrl={logoUrl} />;
};

export default PublicHeader;
