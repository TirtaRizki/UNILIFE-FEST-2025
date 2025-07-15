"use server";

import React from 'react';
import { format } from 'date-fns';
import { Calendar, Music } from 'lucide-react';
import type { Lineup } from '@/lib/types';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const LineupCard = ({ lineup }: { lineup: Lineup }) => (
    <div className="text-center p-4">
        <h3 className="text-2xl font-bold font-headline text-primary">{lineup.artistName}</h3>
        <div className="flex items-center justify-center gap-2 mt-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{lineup.day}, {format(new Date(lineup.date), "d LLL")}</span>
        </div>
    </div>
);

const fetchLineups = async (): Promise<Lineup[]> => {
    try {
        const lineupsCollection = collection(db, 'lineups');
        const q = query(lineupsCollection, orderBy("date", "asc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lineup));
    } catch (error) {
        console.error("Failed to fetch lineups:", error);
        return [];
    }
};

const LineupSection = async () => {
    const lineups = await fetchLineups();

    if (lineups.length === 0) {
        return null;
    }

    return (
        <section id="lineup" className="py-20 md:py-32 bg-background/5 backdrop-blur-sm">
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
