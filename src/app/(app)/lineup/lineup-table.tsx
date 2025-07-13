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
import { MoreHorizontal, PlusCircle } from "lucide-react";
import PageHeader from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockLineups } from "@/lib/data";
import type { Lineup } from "@/lib/types";
import { LineupForm } from './lineup-form';

export default function LineupTable() {
    const [lineups, setLineups] = useState<Lineup[]>(mockLineups);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedLineup, setSelectedLineup] = useState<Lineup | null>(null);

    const handleAdd = () => {
        setSelectedLineup(null);
        setSheetOpen(true);
    };

    const handleEdit = (lineup: Lineup) => {
        setSelectedLineup(lineup);
        setSheetOpen(true);
    };
    
    const handleDelete = (id: string) => {
      setLineups(lineups.filter(l => l.id !== id));
    };

    const handleSave = (lineupData: Lineup) => {
        if (selectedLineup && lineupData.id) {
            setLineups(lineups.map(l => l.id === lineupData.id ? lineupData : l));
        } else {
            setLineups([...lineups, { ...lineupData, id: `LNP${Date.now()}` }]);
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
