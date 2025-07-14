
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
import { useToast } from '@/hooks/use-toast';

export default function TicketTable() {
    const { hasRole } = useAuth();
    const canManage = hasRole(['Admin']);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

    const fetchTickets = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${apiUrl}/api/tickets`);
            if (!response.ok) throw new Error("Failed to fetch tickets");
            const data = await response.json();
            setTickets(data);
        } catch (error) {
            toast({ title: "Error", description: "Could not fetch tickets.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
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
        try {
            const response = await fetch(`${apiUrl}/api/tickets/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error("Failed to delete ticket");
            toast({ title: "Success", description: "Ticket deleted successfully." });
            fetchTickets(); // Refresh data
        } catch (error) {
             toast({ title: "Error", description: "Could not delete ticket.", variant: "destructive" });
        }
    };

    const handleSave = async (ticketData: Ticket) => {
        try {
            const response = await fetch(`${apiUrl}/api/tickets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ticketData),
            });
            if (!response.ok) throw new Error("Failed to save ticket");
            toast({ title: "Success", description: "Ticket saved successfully." });
            setSheetOpen(false);
            setSelectedTicket(null);
            fetchTickets(); // Refresh data
        } catch (error) {
            toast({ title: "Error", description: "Could not save ticket.", variant: "destructive" });
        }
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
        return <div>Loading tickets...</div>;
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
                                {tickets.length > 0 ? tickets.map((ticket) => (
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
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">No tickets found.</TableCell>
                                    </TableRow>
                                )}
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
