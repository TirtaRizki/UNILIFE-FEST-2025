
"use server";

import React from 'react';
import Image from 'next/image';
import type { Recap } from "@/lib/types";
import { getRecaps } from '@/lib/data-services';


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


const RecapSection = async () => {
    const allRecaps = await getRecaps();
    const publishedRecaps = allRecaps.filter(recap => recap.status === "Published");
    
    if (publishedRecaps.length === 0) {
        return null;
    }

    return (
        <section id="recap" className="py-20 md:py-32 overflow-hidden animate-fade-up">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl md:text-5xl font-bold font-headline text-center mb-12">Recap Aftermovie</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {publishedRecaps.map((recap, index) => (
                        <RecapCard key={recap.id} recap={recap} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RecapSection;
