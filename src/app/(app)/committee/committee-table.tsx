
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
import type { Committee } from "@/lib/types";
import { CommitteeForm } from './committee-form';
import { useAuth } from '@/hooks/use-auth';

export default function CommitteeTable() {
    const { hasRole } = useAuth();
    const canManage = hasRole(['Admin', 'Panitia']);
    const [committees, setCommittees] = useState<Committee[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(null);

    useEffect(() => {
        const storedCommittees = localStorage.getItem('committees');
        if (storedCommittees) {
            setCommittees(JSON.parse(storedCommittees));
        }
        
        const handleStorageChange = () => {
            const storedCommittees = localStorage.getItem('committees');
            if (storedCommittees) {
                setCommittees(JSON.parse(storedCommittees));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const updateCommittees = (updatedCommittees: Committee[]) => {
        setCommittees(updatedCommittees);
        localStorage.setItem('committees', JSON.stringify(updatedCommittees));
        window.dispatchEvent(new Event('storage'));
    };

    const handleAdd = () => {
        setSelectedCommittee(null);
        setSheetOpen(true);
    };

    const handleEdit = (committee: Committee) => {
        setSelectedCommittee(committee);
        setSheetOpen(true);
    };
    
    const handleDelete = async (id: string) => {
        // This is where you'll add your database deletion logic
        const updatedCommittees = committees.filter(c => c.id !== id);
        updateCommittees(updatedCommittees);
    };

    const handleSave = async (committeeData: Committee) => {
        let updatedCommittees;
        if (selectedCommittee && committeeData.id) {
            // This is where you'll add your database update logic
            updatedCommittees = committees.map(c => c.id === committeeData.id ? committeeData : c);
        } else {
            // This is where you'll add your database creation logic
            const newCommittee = { ...committeeData, id: `CMT${Date.now()}` }; // Replace with ID from DB
            updatedCommittees = [...committees, newCommittee];
        }
        updateCommittees(updatedCommittees);
        setSheetOpen(false);
    }
    
    return (
        <>
            <PageHeader title="Kelola Panitia" actions={
                canManage && (
                    <Button onClick={handleAdd}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Panitia
                    </Button>
                )
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
                                    {canManage && (
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {committees.map((committee) => (
                                    <TableRow key={committee.id}>
                                        <TableCell className="font-medium">{committee.name}</TableCell>
                                        <TableCell>{committee.position}</TableCell>
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
                                                        <DropdownMenuItem onClick={() => handleEdit(committee)}>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(committee.id)}>Delete</DropdownMenuItem>
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
                <CommitteeForm 
                    open={sheetOpen} 
                    onOpenChange={setSheetOpen}
                    committee={selectedCommittee}
                    onSave={handleSave}
                />
            )}
        </>
    );
}