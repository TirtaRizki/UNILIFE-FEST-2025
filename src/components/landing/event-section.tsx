"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Calendar, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../ui/card';
import type { Event } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
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

const EventSection = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch('/api/events');
                if (!res.ok) throw new Error('Failed to fetch events');
                const data: Event[] = await res.json();
                setEvents(data.filter(e => e.status === 'Upcoming'));
            } catch (error) {
                console.error("Failed to fetch events:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (isLoading) {
        return (
            <section id="events" className="py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl font-bold font-headline text-center mb-12">Events</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(3)].map((_, i) => (
                           <Card key={i} className="bg-card/5 border-border/20 rounded-xl overflow-hidden">
                               <Skeleton className="w-full aspect-[4/3]" />
                               <CardContent className="p-6">
                                   <Skeleton className="h-6 w-3/4 mb-4" />
                                   <Skeleton className="h-4 w-full mb-2" />
                                   <Skeleton className="h-4 w-5/6" />
                               </CardContent>
                               <CardFooter className="p-6 pt-0">
                                   <Skeleton className="h-10 w-full" />
                               </CardFooter>
                           </Card>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    if (events.length === 0) {
        return null;
    }

    return (
        <section id="events" className="py-20 md:py-32 overflow-hidden">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl md:text-5xl font-bold font-headline text-center mb-12 animate-fade-up">Upcoming Events</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event, index) => (
                        <EventCard key={event.id} event={event} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EventSection;
