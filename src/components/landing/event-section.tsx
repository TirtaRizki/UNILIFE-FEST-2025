
"use server";

import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Calendar, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../ui/card';
import type { Event } from '@/lib/types';
import Link from 'next/link';

const EventCard = ({ event, index }: { event: Event, index: number }) => (
    <Card 
        className="bg-card/5 border-border/20 rounded-xl overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full animate-fade-up"
        style={{animationDelay: `${index * 0.15}s`}}
    >
        <CardHeader className="p-0">
            <div className="relative w-full aspect-[4/3]">
                <Image
                    src={event.imageUrl || "https://placehold.co/400x300.png"}
                    alt={event.name}
                    fill
                    className="object-cover"
                    data-ai-hint="event concert festival"
                />
            </div>
        </CardHeader>
        <CardContent className="p-6 flex-grow">
            <h3 className="text-xl font-bold font-headline mb-2 text-primary-foreground">{event.name}</h3>
            <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{event.description}</p>
        </CardContent>
        <CardFooter className="p-6 pt-0 flex flex-col items-start gap-4">
            <div className="flex flex-col gap-2 w-full text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{format(new Date(event.date), "PPP")}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{event.location}</span>
                </div>
            </div>
             <Button asChild size="sm" className="w-full bg-primary/10 text-primary hover:bg-primary/20 font-semibold">
                <Link href="https://mytiketin.com/event/79" target="_blank" rel="noopener noreferrer">
                    View Details
                </Link>
            </Button>
        </CardFooter>
    </Card>
);

const fetchEvents = async (): Promise<Event[]> => {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/events`, {
            next: { revalidate: 300 } // Revalidate every 5 minutes
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch events: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch events:", error);
        return [];
    }
};

const EventSection = async () => {
    const allEvents = await fetchEvents();
    const upcomingEvents = allEvents.filter(event => event.status === "Upcoming");

    if (upcomingEvents.length === 0) {
        return null;
    }

    return (
        <section id="events" className="py-20 md:py-32 overflow-hidden animate-fade-up">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl md:text-5xl font-bold font-headline text-center mb-12">Upcoming Events</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {upcomingEvents.map((event, index) => (
                        <EventCard key={event.id} event={event} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EventSection;
