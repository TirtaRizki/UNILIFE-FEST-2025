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
import type { Recap } from "@/lib/types";
import { RecapForm } from './recap-form';

export default function RecapTable() {
    const [recaps, setRecaps] = useState<Recap[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedRecap, setSelectedRecap] = useState<Recap | null>(null);

    // TODO: Fetch data from your database
    useEffect(() => {
        // const fetchedRecaps = await fetch('/api/recaps');
        // setRecaps(fetchedRecaps);
    }, []);

    const handleAdd = () => {
        setSelectedRecap(null);
        setSheetOpen(true);
    };

    const handleEdit = (recap: Recap) => {
        setSelectedRecap(recap);
        setSheetOpen(true);
    };
    
    const handleDelete = async (id: string) => {
      // TODO: Add your database deletion logic here
      // await fetch(`/api/recaps/${id}`, { method: 'DELETE' });
      setRecaps(recaps.filter(r => r.id !== id));
    };

    const handleSave = async (recapData: Recap) => {
        if (selectedRecap && recapData.id) {
            // TODO: Add your database update logic here
            // const updatedRecap = await fetch(`/api/recaps/${recapData.id}`, { method: 'PUT', body: JSON.stringify(recapData) });
            setRecaps(recaps.map(r => r.id === recapData.id ? recapData : r));
        } else {
            // TODO: Add your database creation logic here
            const newRecap = { ...recapData, id: `RCP${Date.now()}` }; // Replace with ID from DB
            // const createdRecap = await fetch('/api/recaps', { method: 'POST', body: JSON.stringify(newRecap) });
            setRecaps([...recaps, newRecap]);
        }
        setSheetOpen(false);
    }
    
    const getBadgeVariant = (status: Recap['status']) => {
        switch (status) {
            case 'Published':
                return 'default';
            case 'Draft':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    return (
        <>
            <PageHeader title="Kelola Recap" actions={
                <Button onClick={handleAdd}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Tambah Recap
                </Button>
            } />
            <Card className="content-card">
                <CardHeader>
                    <CardTitle>Rekap Event</CardTitle>
                    <CardDescription>Kelola rangkuman dan ulasan event.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recaps.map((recap) => (
                                    <TableRow key={recap.id}>
                                        <TableCell className="font-medium">{recap.title}</TableCell>
                                        <TableCell>
                                            <Badge variant={getBadgeVariant(recap.status)}>{recap.status}</Badge>
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
                                                    <DropdownMenuItem onClick={() => handleEdit(recap)}>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(recap.id)}>Delete</DropdownMenuItem>
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
            <RecapForm 
                open={sheetOpen} 
                onOpenChange={setSheetOpen}
                recap={selectedRecap}
                onSave={handleSave}
            />
        </>
    );
}
