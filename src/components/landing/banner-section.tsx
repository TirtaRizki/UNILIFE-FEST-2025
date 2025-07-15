
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import type { Banner } from "@/lib/types";
import { Skeleton } from '../ui/skeleton';

const BannerSection = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await fetch('/api/banners');
                if (!res.ok) {
                    console.error("API Error: Failed to fetch banners with status", res.status);
                    // Don't throw an error, just gracefully handle it by setting an empty array.
                    setBanners([]); 
                    return;
                }
                const data: Banner[] = await res.json();
                setBanners(data.filter(b => b.status === 'Active'));
            } catch (error) {
                console.error("Failed to fetch banners:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBanners();
    }, []);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <Skeleton className="h-[250px] w-full rounded-lg" />
            </div>
        );
    }
    
    if (banners.length === 0) {
        return null; // Don't render the section if there are no active banners
    }

    return (
        <section id="banners" className="container mx-auto px-4 py-12">
            <Carousel opts={{ loop: true, align: "start" }}>
                <CarouselContent>
                    {banners.map((banner) => (
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

