
"use server";

import React from 'react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import type { Banner } from "@/lib/types";

// This function now fetches from the internal API route
const fetchBanners = async (): Promise<Banner[]> => {
    try {
        // Using an absolute URL is a good practice for server-side fetching
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/banners`, {
            next: { revalidate: 300 } // Revalidate every 5 minutes
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch banners: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch banners:", error);
        return [];
    }
};

const BannerSection = async () => {
    const allBanners = await fetchBanners();
    const activeBanners = allBanners.filter(banner => banner.status === "Active");

    if (activeBanners.length === 0) {
        return null; // Don't render the section if there are no active banners
    }

    return (
        <section id="banners" className="container mx-auto px-4 py-12 animate-fade-up">
            <Carousel opts={{ loop: true, align: "start" }}>
                <CarouselContent>
                    {activeBanners.map((banner) => (
                        <CarouselItem key={banner.id} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-1">
                                <div className="relative aspect-video overflow-hidden rounded-lg">
                                    <Image
                                        src={banner.imageUrl || "https://placehold.co/1600x900.png"}
                                        alt={banner.title}
                                        fill
                                        className="object-cover"
                                        data-ai-hint="advertisement banner"
                                    />
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </section>
    );
};

export default BannerSection;
