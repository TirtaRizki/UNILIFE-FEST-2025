
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
import { useToast } from '@/hooks/use-toast';

export default function AboutTable() {
    const { hasRole } = useAuth();
    const canManage = hasRole(['Admin']);
    const [abouts, setAbouts] = useState<About[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedAbout, setSelectedAbout] = useState<About | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

    const fetchAbouts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${apiUrl}/api/about`);
            if (!response.ok) throw new Error("Failed to fetch about content");
            const data = await response.json();
            setAbouts(data);
        } catch (error) {
            toast({ title: "Error", description: "Could not fetch about content.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAbouts();
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
        try {
            const response = await fetch(`${apiUrl}/api/about/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error("Failed to delete about content");
            toast({ title: "Success", description: "About content deleted successfully." });
            fetchAbouts();
        } catch (error) {
            toast({ title: "Error", description: "Could not delete about content.", variant: "destructive" });
        }
    };

    const handleSave = async (aboutData: About) => {
        try {
            const response = await fetch(`${apiUrl}/api/about`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(aboutData),
            });
            if (!response.ok) throw new Error("Failed to save about content");
            toast({ title: "Success", description: "About content saved successfully." });
            setSheetOpen(false);
            setSelectedAbout(null);
            fetchAbouts();
        } catch (error) {
            toast({ title: "Error", description: "Could not save about content.", variant: "destructive" });
        }
    }
    
    if (isLoading) {
        return <div>Loading about content...</div>;
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
                                {abouts.length > 0 ? abouts.map((about) => (
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
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center">No about content found.</TableCell>
                                    </TableRow>
                                )}
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
