
"use client";
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import PageHeader from "@/components/page-header";
import type { Recap } from "@/lib/types";
import { RecapForm } from './recap-form';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';

// Helper functions to simulate database interaction with localStorage
const getRecapsFromStorage = (): Recap[] => {
    if (typeof window === 'undefined') return [];
    const storedRecaps = localStorage.getItem('recaps');
    return storedRecaps ? JSON.parse(storedRecaps) : [];
};

const saveRecapsToStorage = (recaps: Recap[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('recaps', JSON.stringify(recaps));
    window.dispatchEvent(new Event('storage'));
};

const RecapCard = ({ recap, onEdit, onDelete, canManage }: { recap: Recap, onEdit: (recap: Recap) => void, onDelete: (id: string) => void, canManage: boolean }) => {
    const getBadgeVariant = (status: Recap['status']) => {
        switch (status) {
            case 'Published': return 'default';
            case 'Draft': return 'secondary';
            default: return 'outline';
        }
    };

    return (
        <Card className="overflow-hidden content-card group flex flex-col">
            <CardHeader className="p-0">
                <div className="relative w-full aspect-video">
                    <Image
                        src={recap.imageUrl || "https://placehold.co/400x225.png"}
                        alt={recap.title}
                        layout="fill"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint="event recap concert"
                    />
                    {canManage && (
                        <div className="absolute top-2 right-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="icon" variant="secondary" className="rounded-full h-8 w-8 bg-white/80 backdrop-blur-sm">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Actions</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => onEdit(recap)}>Edit</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(recap.id)}>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg font-bold">{recap.title}</CardTitle>
                    <Badge variant={getBadgeVariant(recap.status)}>{recap.status}</Badge>
                </div>
                <CardDescription className="text-sm text-muted-foreground line-clamp-3">
                    {recap.description}
                </CardDescription>
            </CardContent>
        </Card>
    );
};

export default function RecapGrid() {
    const { hasRole } = useAuth();
    const canManage = hasRole(['Admin']);
    const [recaps, setRecaps] = useState<Recap[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedRecap, setSelectedRecap] = useState<Recap | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching data from a database
        const data = getRecapsFromStorage();
        setRecaps(data);
        setIsLoading(false);

        const handleStorageChange = () => {
            setRecaps(getRecapsFromStorage());
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleAdd = () => {
        setSelectedRecap(null);
        setSheetOpen(true);
    };

    const handleEdit = (recap: Recap) => {
        setSelectedRecap(recap);
        setSheetOpen(true);
    };
    
    const handleDelete = async (id: string) => {
        // Simulate an API call to delete
        const currentRecaps = getRecapsFromStorage();
        const updatedRecaps = currentRecaps.filter(r => r.id !== id);
        saveRecapsToStorage(updatedRecaps);
        setRecaps(updatedRecaps);
    };

    const handleSave = async (recapData: Recap) => {
        // Simulate an API call to save
        const currentRecaps = getRecapsFromStorage();
        let updatedRecaps;

        if (selectedRecap && recapData.id) {
            updatedRecaps = currentRecaps.map(r => r.id === recapData.id ? recapData : r);
        } else {
            const newRecap = { ...recapData, id: `RCP${Date.now()}` };
            updatedRecaps = [...currentRecaps, newRecap];
        }
        
        saveRecapsToStorage(updatedRecaps);
        setRecaps(updatedRecaps);
        setSheetOpen(false);
        setSelectedRecap(null);
    }
    
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <PageHeader title="Recap" actions={
                canManage && (
                    <Button onClick={handleAdd}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Recap
                    </Button>
                )
            } />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recaps.map((recap) => (
                    <RecapCard key={recap.id} recap={recap} onEdit={handleEdit} onDelete={handleDelete} canManage={canManage} />
                ))}
            </div>
            
            {canManage && (
                <RecapForm 
                    open={sheetOpen} 
                    onOpenChange={setSheetOpen}
                    recap={selectedRecap}
                    onSave={handleSave}
                />
            )}
        </>
    );
}

