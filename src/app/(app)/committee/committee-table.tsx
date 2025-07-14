
"use client";
import React, { useState, useEffect, useMemo } from 'react';
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
import type { Committee, User } from "@/lib/types";
import { CommitteeForm } from './committee-form';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';

// Helper functions to simulate database interaction with localStorage
const getCommitteesFromStorage = (): Committee[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('committees');
    return stored ? JSON.parse(stored) : [];
};

const saveCommitteesToStorage = (committees: Omit<Committee, 'user'>[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('committees', JSON.stringify(committees));
    window.dispatchEvent(new Event('storage'));
};

const getUsersFromStorage = (): User[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('users');
    return stored ? JSON.parse(stored) : [];
};

export default function CommitteeTable() {
    const { hasRole } = useAuth();
    const canManage = hasRole(['Admin', 'Panitia']);
    
    const [committees, setCommittees] = useState<Committee[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching data from a database
        const committeeData = getCommitteesFromStorage();
        const userData = getUsersFromStorage();
        setCommittees(committeeData);
        setUsers(userData);
        setIsLoading(false);

        const handleStorageChange = () => {
            setCommittees(getCommitteesFromStorage());
            setUsers(getUsersFromStorage());
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const committeesWithUsers = useMemo(() => {
        const userMap = new Map(users.map(u => [u.id, u]));
        return committees
            .map(committee => ({
                ...committee,
                user: userMap.get(committee.userId),
            }))
            .filter((c): c is Committee & { user: User } => !!c.user);
    }, [committees, users]);

    const handleAdd = () => {
        setSelectedCommittee(null);
        setSheetOpen(true);
    };

    const handleEdit = (committee: Committee) => {
        setSelectedCommittee(committee);
        setSheetOpen(true);
    };
    
    const handleDelete = async (id: string) => {
        // Simulate an API call to delete
        const currentCommittees = getCommitteesFromStorage();
        const updatedCommittees = currentCommittees.filter(c => c.id !== id);
        saveCommitteesToStorage(updatedCommittees);
        setCommittees(updatedCommittees);
    };

    const handleSave = async (committeeData: Omit<Committee, 'user'>) => {
        // Simulate an API call to save
        const currentCommittees = getCommitteesFromStorage();
        let updatedCommittees;

        if (selectedCommittee && committeeData.id) {
            updatedCommittees = currentCommittees.map(c => c.id === committeeData.id ? { ...c, ...committeeData } : c);
        } else {
            const newCommittee = { ...committeeData, id: `CMT${Date.now()}` };
            updatedCommittees = [...currentCommittees, newCommittee];
        }
        saveCommitteesToStorage(updatedCommittees);
        setCommittees(updatedCommittees);
        setSheetOpen(false);
        setSelectedCommittee(null);
    }
    
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <PageHeader title="Panitia" actions={
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
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Posisi</TableHead>
                                    <TableHead>Role</TableHead>
                                    {canManage && (
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {committeesWithUsers.map((committee) => (
                                    <TableRow key={committee.id}>
                                        <TableCell className="font-medium">{committee.user.name}</TableCell>
                                        <TableCell>{committee.position}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{committee.user.role}</Badge>
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
                    allUsers={users}
                    existingCommitteeUserIds={committees.map(c => c.userId)}
                />
            )}
        </>
    );
}
