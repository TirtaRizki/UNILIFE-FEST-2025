
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
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import PageHeader from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Banner } from "@/lib/types";
import { BannerForm } from './banner-form';
import { useAuth } from '@/hooks/use-auth';
import Image from 'next/image';

// Helper functions to simulate database interaction with localStorage
const getBannersFromStorage = (): Banner[] => {
    if (typeof window === 'undefined') return [];
    const storedBanners = localStorage.getItem('banners');
    return storedBanners ? JSON.parse(storedBanners) : [];
};

const saveBannersToStorage = (banners: Banner[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('banners', JSON.stringify(banners));
    window.dispatchEvent(new Event('storage'));
};

export default function BannerTable() {
    const { hasRole } = useAuth();
    const canManage = hasRole(['Admin']);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching data from a database
        const data = getBannersFromStorage();
        setBanners(data);
        setIsLoading(false);
        
        const handleStorageChange = () => {
            setBanners(getBannersFromStorage());
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleAdd = () => {
        setSelectedBanner(null);
        setSheetOpen(true);
    };

    const handleEdit = (banner: Banner) => {
        setSelectedBanner(banner);
        setSheetOpen(true);
    };
    
    const handleDelete = async (id: string) => {
        // Simulate an API call to delete
        const currentBanners = getBannersFromStorage();
        const updatedBanners = currentBanners.filter(banner => banner.id !== id);
        saveBannersToStorage(updatedBanners);
        setBanners(updatedBanners);
    };

    const handleSave = async (bannerData: Banner) => {
        // Simulate an API call to save
        const currentBanners = getBannersFromStorage();
        let updatedBanners;

        if (selectedBanner && bannerData.id) {
            updatedBanners = currentBanners.map(b => b.id === bannerData.id ? bannerData : b);
        } else {
            const newBanner = { ...bannerData, id: `BNR${Date.now()}` };
            updatedBanners = [...currentBanners, newBanner];
        }
        saveBannersToStorage(updatedBanners);
        setBanners(updatedBanners);
        setSheetOpen(false);
        setSelectedBanner(null);
    }
    
    const getBadgeVariant = (status: Banner['status']) => {
        switch (status) {
            case 'Active':
                return 'default';
            case 'Inactive':
                return 'secondary';
            default:
                return 'outline';
        }
    };
    
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <PageHeader title="Banner" actions={
                canManage && (
                    <Button onClick={handleAdd}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Banner
                    </Button>
                )
            } />
            <Card className="content-card">
                <CardHeader>
                    <CardTitle>Daftar Banner</CardTitle>
                    <CardDescription>Kelola banner iklan untuk event Anda.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40%]">Image</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Status</TableHead>
                                    {canManage && (
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {banners.map((banner) => (
                                    <TableRow key={banner.id}>
                                        <TableCell>
                                            <Image 
                                                src={banner.imageUrl || "https://placehold.co/400x225.png"}
                                                alt={banner.title}
                                                width={400}
                                                height={225}
                                                className="rounded-md object-cover w-full aspect-video"
                                                data-ai-hint="banner advertisement"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{banner.title}</TableCell>
                                        <TableCell>
                                            <Badge variant={getBadgeVariant(banner.status)}>{banner.status}</Badge>
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
                                                        <DropdownMenuItem onClick={() => handleEdit(banner)}>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(banner.id)}>Delete</DropdownMenuItem>
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
                <BannerForm 
                    open={sheetOpen} 
                    onOpenChange={setSheetOpen}
                    banner={selectedBanner}
                    onSave={handleSave}
                />
            )}
        </>
    );
}

