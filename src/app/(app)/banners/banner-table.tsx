
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

export default function BannerTable() {
    const { hasRole } = useAuth();
    const canManage = hasRole(['Admin']);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);

    useEffect(() => {
        const storedBanners = localStorage.getItem('banners');
        if (storedBanners) {
            setBanners(JSON.parse(storedBanners));
        }
    }, []);

    const updateBanners = (updatedBanners: Banner[]) => {
        setBanners(updatedBanners);
        localStorage.setItem('banners', JSON.stringify(updatedBanners));
        window.dispatchEvent(new Event('storage'));
    };

    const handleAdd = () => {
        setSelectedBanner(null);
        setSheetOpen(true);
    };

    const handleEdit = (banner: Banner) => {
        setSelectedBanner(banner);
        setSheetOpen(true);
    };
    
    const handleDelete = async (id: string) => {
        const updatedBanners = banners.filter(banner => banner.id !== id);
        updateBanners(updatedBanners);
    };

    const handleSave = async (bannerData: Banner) => {
        let updatedBanners;
        if (selectedBanner && bannerData.id) {
            updatedBanners = banners.map(b => b.id === bannerData.id ? bannerData : b);
        } else {
            const newBanner = { ...bannerData, id: `BNR${Date.now()}` };
            updatedBanners = [...banners, newBanner];
        }
        updateBanners(updatedBanners);
        setSheetOpen(false);
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

    return (
        <>
            <PageHeader title="Kelola Banner" actions={
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
