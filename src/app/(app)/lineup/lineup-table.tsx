
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

// Helper functions to simulate database interaction with localStorage
const getLineupsFromStorage = (): Lineup[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('lineups');
    return stored ? JSON.parse(stored) : [];
};

const saveLineupsToStorage = (lineups: Lineup[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('lineups', JSON.stringify(lineups));
    window.dispatchEvent(new Event('storage'));
};

export default function LineupTable() {
    const { hasRole } = useAuth();
    const canManage = hasRole(['Admin', 'Panitia']);
    const [lineups, setLineups] = useState<Lineup[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedLineup, setSelectedLineup] = useState<Lineup | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching data from a database
        const data = getLineupsFromStorage();
        setLineups(data);
        setIsLoading(false);

        const handleStorageChange = () => {
            setLineups(getLineupsFromStorage());
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
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
        // Simulate an API call to delete
        const currentLineups = getLineupsFromStorage();
        const updatedLineups = currentLineups.filter(l => l.id !== id);
        saveLineupsToStorage(updatedLineups);
        setLineups(updatedLineups);
    };

    const handleSave = async (lineupData: Lineup) => {
        // Simulate an API call to save
        const currentLineups = getLineupsFromStorage();
        let updatedLineups;

        if (selectedLineup && lineupData.id) {
            updatedLineups = currentLineups.map(l => l.id === lineupData.id ? lineupData : l);
        } else {
            const newLineup = { ...lineupData, id: `LNP${Date.now()}` };
            updatedLineups = [...currentLineups, newLineup];
        }
        
        saveLineupsToStorage(updatedLineups);
        setLineups(updatedLineups);
        setSheetOpen(false);
        setSelectedLineup(null);
    }
    
    if (isLoading) {
        return <div>Loading...</div>;
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
                                {lineups.map((lineup) => (
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
                                ))}
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
