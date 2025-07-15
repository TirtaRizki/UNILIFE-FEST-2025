"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import type { Recap } from "@/lib/types";
import { Skeleton } from '../ui/skeleton';

const RecapCard = ({ recap }: { recap: Recap }) => (
    <div className="group relative aspect-square overflow-hidden rounded-lg shadow-lg">
        <Image
            src={recap.imageUrl || "https://placehold.co/500x500.png"}
            alt={recap.title}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110"
            data-ai-hint="concert aftermovie photo"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 md:p-6">
            <h3 className="text-lg font-bold text-white">{recap.title}</h3>
            {recap.description && <p className="text-sm text-white/80 mt-1 line-clamp-2">{recap.description}</p>}
        </div>
    </div>
);


const RecapSection = () => {
    const [recaps, setRecaps] = useState<Recap[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecaps = async () => {
            try {
                const res = await fetch('/api/recap');
                if (!res.ok) throw new Error('Failed to fetch recaps');
                const data: Recap[] = await res.json();
                setRecaps(data.filter(r => r.status === 'Published'));
            } catch (error) {
                console.error("Failed to fetch recaps:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRecaps();
    }, []);

    if (isLoading) {
        return (
            <section id="recap" className="py-20 md:py-32">
                <div className="container mx-auto px-4">
                     <h2 className="text-4xl md:text-5xl font-bold font-headline text-center mb-12">Recap Aftermovie</h2>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)}
                     </div>
                </div>
            </section>
        );
    }
    
    if (recaps.length === 0) {
        return null;
    }

    return (
        <section id="recap" className="py-20 md:py-32">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl md:text-5xl font-bold font-headline text-center mb-12">Recap Aftermovie</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {recaps.map((recap) => (
                        <RecapCard key={recap.id} recap={recap} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RecapSection;
