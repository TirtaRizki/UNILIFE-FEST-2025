
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
import type { About } from "@/lib/types";
import { AboutForm } from './about-form';
import { useAuth } from '@/hooks/use-auth';

// Helper functions to simulate database interaction with localStorage
const getAboutsFromStorage = (): About[] => {
    if (typeof window === 'undefined') return [];
    const storedAbouts = localStorage.getItem('abouts');
    return storedAbouts ? JSON.parse(storedAbouts) : [];
};

const saveAboutsToStorage = (abouts: About[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('abouts', JSON.stringify(abouts));
    window.dispatchEvent(new Event('storage')); // Notify other tabs
};


export default function AboutTable() {
    const { hasRole } = useAuth();
    const canManage = hasRole(['Admin']);
    const [abouts, setAbouts] = useState<About[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedAbout, setSelectedAbout] = useState<About | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching data from a database
        const data = getAboutsFromStorage();
        setAbouts(data);
        setIsLoading(false);

        const handleStorageChange = () => {
            setAbouts(getAboutsFromStorage());
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleAdd = () => {
        setSelectedAbout(null);
        setSheetOpen(true);
    };

    const handleEdit = (about: About) => {
        setSelectedAbout(about);
        setSheetOpen(true);
    };
    
    const handleDelete = async (id: string) => {
        // Simulate an API call to delete
        const currentAbouts = getAboutsFromStorage();
        const updatedAbouts = currentAbouts.filter(about => about.id !== id);
        saveAboutsToStorage(updatedAbouts);
        setAbouts(updatedAbouts);
    };

    const handleSave = async (aboutData: About) => {
        // Simulate an API call to save
        const currentAbouts = getAboutsFromStorage();
        let updatedAbouts;

        if (selectedAbout && aboutData.id) {
            updatedAbouts = currentAbouts.map(a => a.id === aboutData.id ? aboutData : a);
        } else {
            const newAbout = { ...aboutData, id: `ABT${Date.now()}` };
            updatedAbouts = [...currentAbouts, newAbout];
        }
        
        saveAboutsToStorage(updatedAbouts);
        setAbouts(updatedAbouts);
        setSheetOpen(false);
        setSelectedAbout(null);
    }
    
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <PageHeader title="About" actions={
                canManage && (
                    <Button onClick={handleAdd}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah About
                    </Button>
                )
            } />
            <Card className="content-card">
                <CardHeader>
                    <CardTitle>Konten About</CardTitle>
                    <CardDescription>Kelola konten halaman 'About' Anda.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Description</TableHead>
                                    {canManage && (
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {abouts.map((about) => (
                                    <TableRow key={about.id}>
                                        <TableCell className="font-medium">{about.title}</TableCell>
                                        <TableCell>{about.description}</TableCell>
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
                                                        <DropdownMenuItem onClick={() => handleEdit(about)}>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(about.id)}>Delete</DropdownMenuItem>
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
                <AboutForm 
                    open={sheetOpen} 
                    onOpenChange={setSheetOpen}
                    about={selectedAbout}
                    onSave={handleSave}
                />
            )}
        </>
    );
}
