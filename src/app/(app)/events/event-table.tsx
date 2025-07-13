
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
                <div className="relative">
                    <Image
                        src={event.imageUrl || "https://placehold.co/400x300.png"}
                        alt={event.name}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
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


export default function EventGrid() {
    const { hasRole } = useAuth();
    const canManage = hasRole(['Admin', 'Panitia']);
    const [events, setEvents] = useState<Event[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    useEffect(() => {
        const storedEvents = localStorage.getItem('events');
        if (storedEvents) {
            setEvents(JSON.parse(storedEvents));
        }
    }, []);

    const updateEvents = (updatedEvents: Event[]) => {
        setEvents(updatedEvents);
        localStorage.setItem('events', JSON.stringify(updatedEvents));
        window.dispatchEvent(new Event('storage'));
    };

    const handleAdd = () => {
        setSelectedEvent(null);
        setSheetOpen(true);
    };

    const handleEdit = (event: Event) => {
        setSelectedEvent(event);
        setSheetOpen(true);
    };
    
    const handleDelete = async (id: string) => {
        // This is where you'll add your database deletion logic
        const updatedEvents = events.filter(event => event.id !== id);
        updateEvents(updatedEvents);
    };

    const handleSave = async (eventData: Event) => {
        let updatedEvents;
        if (selectedEvent && eventData.id) {
            // This is where you'll add your database update logic
            updatedEvents = events.map(e => e.id === eventData.id ? eventData : e);
        } else {
            // This is where you'll add your database creation logic
            const newEvent = { ...eventData, id: `EVT${Date.now()}` }; // Replace with ID from DB
            updatedEvents = [...events, newEvent];
        }
        updateEvents(updatedEvents);
        setSheetOpen(false);
    }
    
    return (
        <>
            <PageHeader title="Kelola Post Event" actions={
                canManage && (
                    <Button onClick={handleAdd}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Event
                    </Button>
                )
            } />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {events.map((event) => (
                    <EventCard key={event.id} event={event} onEdit={handleEdit} onDelete={handleDelete} canManage={canManage} />
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
