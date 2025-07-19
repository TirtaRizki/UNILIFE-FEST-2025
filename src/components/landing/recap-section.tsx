
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Recap } from "@/lib/types";
import { Skeleton } from '../ui/skeleton';

const dummyRecaps: Recap[] = [
    {
        id: "dummy-recap-1",
        title: "Aftermovie UNILIFE 2024",
        description: "Lihat kembali keseruan dan momen tak terlupakan dari UNILIFE tahun lalu!",
        status: "Published",
        imageUrl: "https://placehold.co/500x500.png"
    },
    {
        id: "dummy-recap-2",
        title: "Keseruan Bazaar & Workshop",
        description: "Intip berbagai kegiatan kreatif di area bazaar dan workshop.",
        status: "Published",
        imageUrl: "https://placehold.co/500x500.png"
    },
    {
        id: "dummy-recap-3",
        title: "Antusiasme Penonton",
        description: "Energi luar biasa dari para Unifriends yang hadir!",
        status: "Published",
        imageUrl: "https://placehold.co/500x500.png"
    },
     {
        id: "dummy-recap-4",
        title: "Momen di Balik Panggung",
        description: "Eksklusif! Momen di balik panggung dan persiapan para panitia.",
        status: "Published",
        imageUrl: "https://placehold.co/500x500.png"
    }
];

const RecapCard = ({ recap, index }: { recap: Recap, index: number }) => (
    <div 
        className="group relative aspect-square overflow-hidden rounded-lg shadow-lg animate-fade-up"
        style={{animationDelay: `${index * 0.15}s`}}
    >
        <Image
            src={recap.imageUrl || "https://placehold.co/500x500.png"}
            alt={recap.title}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110"
            data-ai-hint="concert aftermovie photo"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 md:p-6">
            <h3 className="text-lg font-bold text-white">{recap.title}</h3>
            {recap.description && <p className="text-sm text-white/80 mt-1 line-clamp-2">{recap.description}</p>}
        </div>
    </div>
);

const RecapCardSkeleton = () => (
    <div className="relative aspect-square overflow-hidden rounded-lg">
        <Skeleton className="w-full h-full" />
    </div>
);

const RecapSection = () => {
    const [recaps, setRecaps] = useState<Recap[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecaps = async () => {
            try {
                const response = await fetch('/api/recap');
                if (!response.ok) {
                    throw new Error('Failed to fetch recaps');
                }
                let data: Recap[] = await response.json();
                let publishedRecaps = data.filter(recap => recap.status === "Published");
                
                if (publishedRecaps.length === 0) {
                    publishedRecaps = dummyRecaps.filter(recap => recap.status === "Published");
                }
                setRecaps(publishedRecaps);
            } catch (error) {
                console.error("Error fetching recaps for landing page:", error);
                setRecaps(dummyRecaps.filter(recap => recap.status === "Published"));
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecaps();
    }, []);
    
    if (isLoading) {
        return (
             <section id="recap" className="py-20 md:py-32 overflow-hidden">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl font-bold font-headline text-center mb-12">Recap Aftermovie</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, index) => (
                           <RecapCardSkeleton key={index} />
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    if (recaps.length === 0) {
        return null;
    }

    return (
        <section id="recap" className="py-20 md:py-32 overflow-hidden animate-fade-up">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl md:text-5xl font-bold font-headline text-center mb-12">Recap Aftermovie</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {recaps.map((recap, index) => (
                        <RecapCard key={recap.id} recap={recap} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RecapSection;
