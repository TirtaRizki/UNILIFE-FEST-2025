
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
import { MoreHorizontal, PlusCircle, Calendar, Music } from "lucide-react";
import PageHeader from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import type { Lineup } from "@/lib/types";
import { LineupForm } from './lineup-form';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const LineupCard = ({ lineup, onEdit, onDelete, canManage }: { lineup: Lineup, onEdit: (lineup: Lineup) => void, onDelete: (id: string) => void, canManage: boolean }) => {
    return (
        <Card className="overflow-hidden content-card group flex flex-col h-full shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="p-4 bg-gradient-to-tr from-primary/10 via-background to-background">
                 <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold font-headline text-primary">{lineup.artistName}</CardTitle>
                    {canManage && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost" className="rounded-full h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => onEdit(lineup)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(lineup.id)}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                 </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow flex flex-col justify-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4"/>
                    <span className="font-semibold">{lineup.day}</span>
                </div>
                 <div className="flex items-center gap-2 text-foreground mt-1">
                    <span className="ml-6 text-sm">{format(new Date(lineup.date), "PPP")}</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default function LineupGrid() {
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
            // Sort by date
            data.sort((a: Lineup, b: Lineup) => new Date(a.date).getTime() - new Date(b.date).getTime());
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {lineups.length > 0 ? lineups.map((lineup) => (
                    <LineupCard 
                        key={lineup.id} 
                        lineup={lineup} 
                        onEdit={handleEdit} 
                        onDelete={handleDelete} 
                        canManage={canManage}
                    />
                )) : (
                     <div className="col-span-full">
                        <Card className="content-card flex items-center justify-center p-12">
                            <div className="text-center">
                                <Music className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-medium text-foreground">Lineup Kosong</h3>
                                <p className="mt-1 text-sm text-muted-foreground">Belum ada artis yang ditambahkan.</p>
                                {canManage && (
                                    <div className="mt-6">
                                        <Button onClick={handleAdd}>
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            Tambah Artis
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                )}
            </div>
            
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
