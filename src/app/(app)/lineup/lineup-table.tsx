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

export default function LineupTable() {
    const [lineups, setLineups] = useState<Lineup[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedLineup, setSelectedLineup] = useState<Lineup | null>(null);

    // TODO: Fetch data from your database
    useEffect(() => {
      // const fetchedLineups = await fetch('/api/lineups');
      // setLineups(fetchedLineups);
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
      // TODO: Add your database deletion logic here
      // await fetch(`/api/lineups/${id}`, { method: 'DELETE' });
      setLineups(lineups.filter(l => l.id !== id));
    };

    const handleSave = async (lineupData: Lineup) => {
        if (selectedLineup && lineupData.id) {
            // TODO: Add your database update logic here
            // const updatedLineup = await fetch(`/api/lineups/${lineupData.id}`, { method: 'PUT', body: JSON.stringify(lineupData) });
            setLineups(lineups.map(l => l.id === lineupData.id ? lineupData : l));
        } else {
            // TODO: Add your database creation logic here
            const newLineup = { ...lineupData, id: `LNP${Date.now()}` }; // Replace with ID from DB
            // const createdLineup = await fetch('/api/lineups', { method: 'POST', body: JSON.stringify(newLineup) });
            setLineups([...lineups, newLineup]);
        }
        setSheetOpen(false);
    }
    
    return (
        <>
            <PageHeader title="Kelola Line Up" actions={
                <Button onClick={handleAdd}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Tambah Artis
                </Button>
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
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lineups.map((lineup) => (
                                    <TableRow key={lineup.id}>
                                        <TableCell className="font-medium">{lineup.artistName}</TableCell>
                                        <TableCell>{lineup.day}</TableCell>
                                        <TableCell>{lineup.time}</TableCell>
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
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            <LineupForm 
                open={sheetOpen} 
                onOpenChange={setSheetOpen}
                lineup={selectedLineup}
                onSave={handleSave}
            />
        </>
    );
}
