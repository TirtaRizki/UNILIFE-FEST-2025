"use client";

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import type { Lineup } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

const LineupCard = ({ lineup }: { lineup: Lineup }) => (
    <div className="text-center p-4 transition-transform duration-300 hover:scale-105">
        <h3 className="text-2xl font-bold font-headline text-primary">{lineup.artistName}</h3>
        <div className="flex items-center justify-center gap-2 mt-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{lineup.day}, {format(new Date(lineup.date), "d LLL")}</span>
        </div>
    </div>
);

const LineupCardSkeleton = () => (
    <div className="text-center p-4">
        <Skeleton className="h-7 w-3/4 mx-auto mb-2" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
    </div>
);

const LineupSection = () => {
    const [lineups, setLineups] = useState<Lineup[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLineups = async () => {
            try {
                const response = await fetch('/api/lineup');
                if (!response.ok) {
                    throw new Error('Failed to fetch lineups');
                }
                const data: Lineup[] = await response.json();
                setLineups(data);
            } catch (error) {
                console.error("Error fetching lineups for landing page:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLineups();
    }, []);

    if (isLoading) {
        return (
            <section id="lineup" className="py-20 md:py-32 bg-background/5 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl font-bold font-headline text-center mb-12">Guest Star Line Up</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 max-w-4xl mx-auto">
                         {[...Array(8)].map((_, index) => (
                           <LineupCardSkeleton key={index} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }
    
    if (lineups.length === 0) {
        return null;
    }

    return (
        <section id="lineup" className="py-20 md:py-32 bg-background/5 backdrop-blur-sm animate-fade-up">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl md:text-5xl font-bold font-headline text-center mb-12">Guest Star Line Up</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 max-w-4xl mx-auto">
                    {lineups.map((lineup) => (
                        <LineupCard key={lineup.id} lineup={lineup} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LineupSection;
