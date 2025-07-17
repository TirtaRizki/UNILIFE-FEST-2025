
"use server";

import React from 'react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import type { Banner } from "@/lib/types";
import { getBanners } from '@/lib/data-services';

const BannerSection = async () => {
    const allBanners = await getBanners();
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
                                <div className="relative aspect-video overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
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
