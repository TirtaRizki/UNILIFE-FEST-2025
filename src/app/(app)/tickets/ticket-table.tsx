"use client";
import React, { useState, useEffect } from 'react';
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
import type { Ticket } from "@/lib/types";
import { TicketForm } from './ticket-form';

export default function TicketTable() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    // TODO: Fetch data from your database
    useEffect(() => {
        // const fetchedTickets = await fetch('/api/tickets');
        // setTickets(fetchedTickets);
    }, []);

    const handleAdd = () => {
        setSelectedTicket(null);
        setSheetOpen(true);
    };

    const handleEdit = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setSheetOpen(true);
    };
    
    const handleDelete = async (id: string) => {
      // TODO: Add your database deletion logic here
      // await fetch(`/api/tickets/${id}`, { method: 'DELETE' });
      setTickets(tickets.filter(t => t.id !== id));
    };

    const handleSave = async (ticketData: Ticket) => {
        if (selectedTicket && ticketData.id) {
            // TODO: Add your database update logic here
            // const updatedTicket = await fetch(`/api/tickets/${ticketData.id}`, { method: 'PUT', body: JSON.stringify(ticketData) });
            setTickets(tickets.map(t => t.id === ticketData.id ? ticketData : t));
        } else {
            // TODO: Add your database creation logic here
            const newTicket = { ...ticketData, id: `TKT${Date.now()}` }; // Replace with ID from DB
            // const createdTicket = await fetch('/api/tickets', { method: 'POST', body: JSON.stringify(newTicket) });
            setTickets([...tickets, newTicket]);
        }
        setSheetOpen(false);
    }
    
    const getBadgeVariant = (status: Ticket['status']) => {
        switch (status) {
            case 'Available':
                return 'default';
            case 'Sold Out':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    return (
        <>
            <PageHeader title="Kelola Tiket" actions={
                <Button onClick={handleAdd}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Tambah Tiket
                </Button>
            } />
            <Card className="content-card">
                <CardHeader>
                    <CardTitle>Manajemen Tiket</CardTitle>
                    <CardDescription>Kelola semua tiket event: lihat penjualan, status, dan terbitkan tiket baru.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tickets.map((ticket) => (
                                    <TableRow key={ticket.id}>
                                        <TableCell className="font-medium">{ticket.type}</TableCell>
                                        <TableCell>${ticket.price.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Badge variant={getBadgeVariant(ticket.status)}>{ticket.status}</Badge>
                                        </TableCell>
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
                                                    <DropdownMenuItem onClick={() => handleEdit(ticket)}>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(ticket.id)}>Delete</DropdownMenuItem>
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
            <TicketForm 
                open={sheetOpen} 
                onOpenChange={setSheetOpen}
                ticket={selectedTicket}
                onSave={handleSave}
            />
        </>
    );
}
