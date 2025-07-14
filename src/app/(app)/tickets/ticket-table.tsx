
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
import { useAuth } from '@/hooks/use-auth';

// Helper functions to simulate database interaction with localStorage
const getTicketsFromStorage = (): Ticket[] => {
    if (typeof window === 'undefined') return [];
    const storedTickets = localStorage.getItem('tickets');
    return storedTickets ? JSON.parse(storedTickets) : [];
};

const saveTicketsToStorage = (tickets: Ticket[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('tickets', JSON.stringify(tickets));
    window.dispatchEvent(new Event('storage'));
};

export default function TicketTable() {
    const { hasRole } = useAuth();
    const canManage = hasRole(['Admin']);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching data from a database
        const data = getTicketsFromStorage();
        setTickets(data);
        setIsLoading(false);

        const handleStorageChange = () => {
            setTickets(getTicketsFromStorage());
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
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
        // Simulate an API call to delete
        const currentTickets = getTicketsFromStorage();
        const updatedTickets = currentTickets.filter(t => t.id !== id);
        saveTicketsToStorage(updatedTickets);
        setTickets(updatedTickets);
    };

    const handleSave = async (ticketData: Ticket) => {
        // Simulate an API call to save
        const currentTickets = getTicketsFromStorage();
        let updatedTickets;

        if (selectedTicket && ticketData.id) {
            updatedTickets = currentTickets.map(t => t.id === ticketData.id ? ticketData : t);
        } else {
            const newTicket = { ...ticketData, id: `TKT${Date.now()}` };
            updatedTickets = [...currentTickets, newTicket];
        }
        
        saveTicketsToStorage(updatedTickets);
        setTickets(updatedTickets);
        setSheetOpen(false);
        setSelectedTicket(null);
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
    
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <PageHeader title="Tiket" actions={
                canManage && (
                    <Button onClick={handleAdd}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Tiket
                    </Button>
                )
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
                                    {canManage && (
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tickets.map((ticket) => (
                                    <TableRow key={ticket.id}>
                                        <TableCell className="font-medium">{ticket.type}</TableCell>
                                        <TableCell>
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(ticket.price)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getBadgeVariant(ticket.status)}>{ticket.status}</Badge>
                                        </TableCell>
                                        {canManage && (
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
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            {canManage && (
                <TicketForm 
                    open={sheetOpen} 
                    onOpenChange={setSheetOpen}
                    ticket={selectedTicket}
                    onSave={handleSave}
                />
            )}
        </>
    );
}
