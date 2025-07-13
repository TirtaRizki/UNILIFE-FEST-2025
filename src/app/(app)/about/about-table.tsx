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

export default function AboutTable() {
    const { hasRole } = useAuth();
    const canManage = hasRole(['Admin']);
    const [abouts, setAbouts] = useState<About[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedAbout, setSelectedAbout] = useState<About | null>(null);

    // TODO: Fetch data from your database
    useEffect(() => {
      // const fetchedAbouts = await fetch('/api/abouts');
      // setAbouts(fetchedAbouts);
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
      // TODO: Add your database deletion logic here
      // await fetch(`/api/abouts/${id}`, { method: 'DELETE' });
      setAbouts(abouts.filter(about => about.id !== id));
    };

    const handleSave = async (aboutData: About) => {
        if (selectedAbout && aboutData.id) {
            // TODO: Add your database update logic here
            // const updatedAbout = await fetch(`/api/abouts/${aboutData.id}`, { method: 'PUT', body: JSON.stringify(aboutData) });
            setAbouts(abouts.map(a => a.id === aboutData.id ? aboutData : a));
        } else {
            // TODO: Add your database creation logic here
            const newAbout = { ...aboutData, id: `ABT${Date.now()}` }; // Replace with ID from DB
            // const createdAbout = await fetch('/api/abouts', { method: 'POST', body: JSON.stringify(newAbout) });
            setAbouts([...abouts, newAbout]);
        }
        setSheetOpen(false);
    }
    
    return (
        <>
            <PageHeader title="Kelola About" actions={
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