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
import { mockAbouts } from "@/lib/data";
import type { About } from "@/lib/types";
import { AboutForm } from './about-form';

export default function AboutTable() {
    const [abouts, setAbouts] = useState<About[]>(mockAbouts);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedAbout, setSelectedAbout] = useState<About | null>(null);

    const handleAdd = () => {
        setSelectedAbout(null);
        setSheetOpen(true);
    };

    const handleEdit = (about: About) => {
        setSelectedAbout(about);
        setSheetOpen(true);
    };
    
    const handleDelete = (id: string) => {
      setAbouts(abouts.filter(about => about.id !== id));
    };

    const handleSave = (aboutData: About) => {
        if (selectedAbout && aboutData.id) {
            setAbouts(abouts.map(a => a.id === aboutData.id ? aboutData : a));
        } else {
            setAbouts([...abouts, { ...aboutData, id: `ABT${Date.now()}` }]);
        }
        setSheetOpen(false);
    }
    
    return (
        <>
            <PageHeader title="Kelola About" actions={
                <Button onClick={handleAdd}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New About
                </Button>
            } />
            <Card className="content-card">
                <CardHeader>
                    <CardTitle>About Section</CardTitle>
                    <CardDescription>Manage the content of your about page.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {abouts.map((about) => (
                                    <TableRow key={about.id}>
                                        <TableCell className="font-medium">{about.title}</TableCell>
                                        <TableCell>{about.description}</TableCell>
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
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(about.id)}>Delete</DropdownMenuItem>
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
            <AboutForm 
                open={sheetOpen} 
                onOpenChange={setSheetOpen}
                about={selectedAbout}
                onSave={handleSave}
            />
        </>
    );
}
