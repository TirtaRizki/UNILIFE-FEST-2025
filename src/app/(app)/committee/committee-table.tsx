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
import { mockCommittees } from "@/lib/data";
import type { Committee } from "@/lib/types";
import { CommitteeForm } from './committee-form';

export default function CommitteeTable() {
    const [committees, setCommittees] = useState<Committee[]>(mockCommittees);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(null);

    const handleAdd = () => {
        setSelectedCommittee(null);
        setSheetOpen(true);
    };

    const handleEdit = (committee: Committee) => {
        setSelectedCommittee(committee);
        setSheetOpen(true);
    };
    
    const handleDelete = (id: string) => {
      setCommittees(committees.filter(c => c.id !== id));
    };

    const handleSave = (committeeData: Committee) => {
        if (selectedCommittee && committeeData.id) {
            setCommittees(committees.map(c => c.id === committeeData.id ? committeeData : c));
        } else {
            setCommittees([...committees, { ...committeeData, id: `CMT${Date.now()}` }]);
        }
        setSheetOpen(false);
    }
    
    return (
        <>
            <PageHeader title="Kelola Panitia" actions={
                <Button onClick={handleAdd}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Tambah Panitia
                </Button>
            } />
            <Card className="content-card">
                <CardHeader>
                    <CardTitle>Daftar Panitia</CardTitle>
                    <CardDescription>Kelola anggota panitia penyelenggara.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Position</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {committees.map((committee) => (
                                    <TableRow key={committee.id}>
                                        <TableCell className="font-medium">{committee.name}</TableCell>
                                        <TableCell>{committee.position}</TableCell>
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
                                                    <DropdownMenuItem onClick={() => handleEdit(committee)}>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(committee.id)}>Delete</DropdownMenuItem>
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
            <CommitteeForm 
                open={sheetOpen} 
                onOpenChange={setSheetOpen}
                committee={selectedCommittee}
                onSave={handleSave}
            />
        </>
    );
}
