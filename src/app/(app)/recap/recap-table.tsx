
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
import { useAuth } from '@/hooks/use-auth';

export default function RecapTable() {
    const { hasRole } = useAuth();
    const canManage = hasRole(['Admin']);
    const [recaps, setRecaps] = useState<Recap[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedRecap, setSelectedRecap] = useState<Recap | null>(null);

    useEffect(() => {
        const storedRecaps = localStorage.getItem('recaps');
        if (storedRecaps) {
            setRecaps(JSON.parse(storedRecaps));
        }
    }, []);

    const updateRecaps = (updatedRecaps: Recap[]) => {
        setRecaps(updatedRecaps);
        localStorage.setItem('recaps', JSON.stringify(updatedRecaps));
        window.dispatchEvent(new Event('storage'));
    };

    const handleAdd = () => {
        setSelectedRecap(null);
        setSheetOpen(true);
    };

    const handleEdit = (recap: Recap) => {
        setSelectedRecap(recap);
        setSheetOpen(true);
    };
    
    const handleDelete = async (id: string) => {
      const updatedRecaps = recaps.filter(r => r.id !== id);
      updateRecaps(updatedRecaps);
    };

    const handleSave = async (recapData: Recap) => {
        let updatedRecaps;
        if (selectedRecap && recapData.id) {
            updatedRecaps = recaps.map(r => r.id === recapData.id ? recapData : r);
        } else {
            const newRecap = { ...recapData, id: `RCP${Date.now()}` };
            updatedRecaps = [...recaps, newRecap];
        }
        updateRecaps(updatedRecaps);
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
                canManage && (
                    <Button onClick={handleAdd}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Recap
                    </Button>
                )
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
                                    {canManage && (
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recaps.map((recap) => (
                                    <TableRow key={recap.id}>
                                        <TableCell className="font-medium">{recap.title}</TableCell>
                                        <TableCell>
                                            <Badge variant={getBadgeVariant(recap.status)}>{recap.status}</Badge>
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
                                                        <DropdownMenuItem onClick={() => handleEdit(recap)}>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(recap.id)}>Delete</DropdownMenuItem>
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
                <RecapForm 
                    open={sheetOpen} 
                    onOpenChange={setSheetOpen}
                    recap={selectedRecap}
                    onSave={handleSave}
                />
            )}
        </>
    );
}
