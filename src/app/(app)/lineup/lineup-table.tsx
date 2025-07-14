
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
import { MoreHorizontal, PlusCircle } from "lucide-react";
import PageHeader from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Lineup } from "@/lib/types";
import { LineupForm } from './lineup-form';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export default function LineupTable() {
    const { hasRole } = useAuth();
    const canManage = hasRole(['Admin', 'Panitia']);
    const [lineups, setLineups] = useState<Lineup[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedLineup, setSelectedLineup] = useState<Lineup | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchLineups = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/lineup`);
            if (!response.ok) throw new Error("Failed to fetch lineups");
            const data = await response.json();
            setLineups(data);
        } catch (error) {
            toast({ title: "Error", description: "Could not fetch lineups.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLineups();
    }, []);

    const handleAdd = () => {
        setSelectedLineup(null);
        setSheetOpen(true);
    };

    const handleEdit = (lineup: Lineup) => {
        setSelectedLineup(lineup);
        setSheetOpen(true);
    };
    
    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/lineup/${id}`, { method: 'DELETE' });
             if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete lineup artist");
            }
            toast({ title: "Success", description: "Lineup artist deleted successfully." });
            fetchLineups();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast({ title: "Error", description: errorMessage, variant: "destructive" });
        }
    };

    const handleSave = async (lineupData: Lineup) => {
        try {
            const response = await fetch(`/api/lineup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lineupData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to save lineup artist");
            }
            toast({ title: "Success", description: "Lineup artist saved successfully." });
            setSheetOpen(false);
            setSelectedLineup(null);
            fetchLineups();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast({ title: "Error", description: errorMessage, variant: "destructive" });
        }
    }
    
    if (isLoading) {
        return <div>Loading lineups...</div>;
    }

    return (
        <>
            <PageHeader title="Line Up" actions={
                canManage && (
                    <Button onClick={handleAdd}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Artis
                    </Button>
                )
            } />
            <Card className="content-card">
                <CardHeader>
                    <CardTitle>Daftar Lineup</CardTitle>
                    <CardDescription>Kelola daftar artis dan penampil.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Artist Name</TableHead>
                                    <TableHead>Day</TableHead>
                                    <TableHead>Time</TableHead>
                                    {canManage && (
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lineups.length > 0 ? lineups.map((lineup) => (
                                    <TableRow key={lineup.id}>
                                        <TableCell className="font-medium">{lineup.artistName}</TableCell>
                                        <TableCell>{lineup.day}</TableCell>
                                        <TableCell>{lineup.time}</TableCell>
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
                                                        <DropdownMenuItem onClick={() => handleEdit(lineup)}>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(lineup.id)}>Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                )) : (
                                     <TableRow>
                                        <TableCell colSpan={canManage ? 4 : 3} className="text-center">No lineup artists found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            {canManage && (
                <LineupForm 
                    open={sheetOpen} 
                    onOpenChange={setSheetOpen}
                    lineup={selectedLineup}
                    onSave={handleSave}
                />
            )}
        </>
    );
}
