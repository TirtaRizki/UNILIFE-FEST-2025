
"use client";
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, Calendar, MapPin } from "lucide-react";
import PageHeader from "@/components/page-header";
import type { Event } from "@/lib/types";
import { EventForm } from './event-form';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';

const EventCard = ({ event, onEdit, onDelete, canManage }: { event: Event, onEdit: (event: Event) => void, onDelete: (id: string) => void, canManage: boolean }) => {
    return (
        <Card className="overflow-hidden content-card group flex flex-col">
            <CardHeader className="p-0">
                <div className="relative w-full aspect-[4/3]">
                    <Image
                        src={event.imageUrl || "https://placehold.co/400x300.png"}
                        alt={event.name}
                        layout="fill"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint="event concert festival"
                    />
                    {canManage && (
                        <div className="absolute top-2 right-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="icon" variant="secondary" className="rounded-full h-8 w-8 bg-white/80 backdrop-blur-sm">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Actions</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => onEdit(event)}>Edit</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(event.id)}>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                <CardTitle className="text-lg font-bold mb-2">{event.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground line-clamp-3">
                    {event.description}
                </CardDescription>
            </CardContent>
            <CardFooter className="p-4 pt-0 text-sm text-muted-foreground bg-white/50 border-t border-black/5">
                <div className="flex flex-col gap-2 w-full">
                     <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(event.date), "PPP")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

// Helper functions to simulate database interaction with localStorage
const getEventsFromStorage = (): Event[] => {
    if (typeof window === 'undefined') return [];
    const storedEvents = localStorage.getItem('events');
    const events = storedEvents ? JSON.parse(storedEvents) : [];
    // Rehydrate images from sessionStorage
    return events.map((event: Event) => {
        if (event.id) {
            const sessionImage = sessionStorage.getItem(`event_image_${event.id}`);
            if (sessionImage) {
                return { ...event, imageUrl: sessionImage };
            }
        }
        return event;
    });
};

const saveEventsToStorage = (events: Event[]) => {
    if (typeof window === 'undefined') return;
    const eventsForStorage = events.map(event => {
        const { imageUrl, ...rest } = event;
        // Only store image in sessionStorage if it's a data URL
        if (imageUrl && !imageUrl.startsWith('http')) {
            if (rest.id) sessionStorage.setItem(`event_image_${rest.id}`, imageUrl);
            return { ...rest, imageUrl: `placeholder_for_${rest.id}` }; // Don't store large data in localStorage
        }
        return event; // Store http URLs directly
    });
    localStorage.setItem('events', JSON.stringify(eventsForStorage));
    window.dispatchEvent(new Event('storage'));
};

export default function EventGrid() {
    const { hasRole } = useAuth();
    const canManage = hasRole(['Admin', 'Panitia']);
    const [events, setEvents] = useState<Event[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const data = getEventsFromStorage();
        setEvents(data);
        setIsLoading(false);

        const handleStorageChange = () => {
            setEvents(getEventsFromStorage());
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleAdd = () => {
        setSelectedEvent(null);
        setSheetOpen(true);
    };

    const handleEdit = (event: Event) => {
        setSelectedEvent(event);
        setSheetOpen(true);
    };
    
    const handleDelete = async (id: string) => {
        const currentEvents = getEventsFromStorage();
        const updatedEvents = currentEvents.filter(event => event.id !== id);
        saveEventsToStorage(updatedEvents);
        setEvents(updatedEvents);
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem(`event_image_${id}`);
        }
    };

    const handleSave = async (eventData: Event) => {
        const currentEvents = getEventsFromStorage();
        let updatedEvents;

        if (selectedEvent && eventData.id) {
            updatedEvents = currentEvents.map(e => e.id === eventData.id ? eventData : e);
        } else {
            const newEvent = { ...eventData, id: `EVT${Date.now()}` };
            updatedEvents = [...currentEvents, newEvent];
        }
        
        saveEventsToStorage(updatedEvents);
        setEvents(getEventsFromStorage()); // Re-fetch to get hydrated images
        setSheetOpen(false);
        setSelectedEvent(null);
    }
    
    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <>
            <PageHeader title="Event" actions={
                canManage && (
                    <Button onClick={handleAdd}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Event
                    </Button>
                )
            } />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {events.map((event) => (
                    <EventCard 
                        key={event.id} 
                        event={event} 
                        onEdit={handleEdit} 
                        onDelete={handleDelete} 
                        canManage={canManage} 
                    />
                ))}
            </div>
            
            {canManage && (
                <EventForm 
                    open={sheetOpen} 
                    onOpenChange={setSheetOpen}
                    event={selectedEvent}
                    onSave={handleSave}
                />
            )}
        </>
    );
}

