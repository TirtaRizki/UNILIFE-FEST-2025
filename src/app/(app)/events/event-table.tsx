"use client";
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import PageHeader from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockEvents } from "@/lib/data";
import type { Event } from "@/lib/types";
import { EventForm } from './event-form';

export default function EventTable() {
    const [events, setEvents] = useState<Event[]>(mockEvents);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    const handleAdd = () => {
        setSelectedEvent(null);
        setSheetOpen(true);
    };

    const handleEdit = (event: Event) => {
        setSelectedEvent(event);
        setSheetOpen(true);
    };
    
    const handleDelete = (id: string) => {
      // In a real app, you would show a confirmation dialog before deleting.
      setEvents(events.filter(event => event.id !== id));
    };

    const handleSave = (eventData: Event) => {
        if (selectedEvent && eventData.id) {
            setEvents(events.map(e => e.id === eventData.id ? eventData : e));
        } else {
            setEvents([...events, { ...eventData, id: `EVT${Date.now()}` }]);
        }
        setSheetOpen(false);
    }
    
    const getBadgeVariant = (status: Event['status']) => {
        switch (status) {
            case 'Upcoming':
                return 'default';
            case 'Completed':
                return 'secondary';
            case 'Cancelled':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    return (
        <>
            <PageHeader title="Kelola Event" actions={
                <Button onClick={handleAdd}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Event
                </Button>
            } />
            <Card>
                <CardHeader>
                    <CardTitle>Events</CardTitle>
                    <CardDescription>Manage your events and view their details.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {events.map((event) => (
                                    <TableRow key={event.id}>
                                        <TableCell className="font-medium">{event.name}</TableCell>
                                        <TableCell>
                                            <Badge variant={getBadgeVariant(event.status)}>{event.status}</Badge>
                                        </TableCell>
                                        <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                                        <TableCell>{event.location}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleEdit(event)}>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(event.id)}>Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            <EventForm 
                open={sheetOpen} 
                onOpenChange={setSheetOpen}
                event={selectedEvent}
                onSave={handleSave}
            />
        </>
    );
}
