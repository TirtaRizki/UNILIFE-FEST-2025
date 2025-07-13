
"use client";
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import PageHeader from "@/components/page-header";
import type { Event } from "@/lib/types";
import { EventForm } from './event-form';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';

const EventCard = ({ event, onEdit, onDelete }: { event: Event, onEdit: (event: Event) => void, onDelete: (id: string) => void }) => {
    return (
        <Card className="overflow-hidden content-card group">
            <CardContent className="p-0">
                <div className="relative">
                    <Image
                        src={event.imageUrl || "https://placehold.co/300x400.png"}
                        alt={event.name}
                        width={300}
                        height={400}
                        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint="event poster"
                    />
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
                </div>
            </CardContent>
        </Card>
    );
};


export default function EventGrid() {
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
                <Button onClick={handleAdd}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Tambah Event
                </Button>
            } />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {events.map((event) => (
                    <EventCard key={event.id} event={event} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
            </div>
            
            <EventForm 
                open={sheetOpen} 
                onOpenChange={setSheetOpen}
                event={selectedEvent}
                onSave={handleSave}
            />
        </>
    );
}
