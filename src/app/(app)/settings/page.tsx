
"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import PageHeader from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/use-auth';

export default function SettingsPage() {
    const { hasRole } = useAuth();
    const isAdmin = hasRole(['Admin']);
    const { toast } = useToast();
    const [logoUrl, setLogoUrl] = useState('');
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    useEffect(() => {
        const storedLogo = localStorage.getItem('appLogo');
        if (storedLogo) {
            setLogoUrl(storedLogo);
            setLogoPreview(storedLogo);
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result as string;
                setLogoPreview(dataUrl);
                setLogoUrl(dataUrl); 
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setLogoUrl(url);
        setLogoPreview(url);
    };

    const handleSaveLogo = () => {
        localStorage.setItem('appLogo', logoUrl);
        // Dispatch storage event to notify other components like the sidebar
        window.dispatchEvent(new Event('storage'));
        toast({
            title: "Logo Diperbarui",
            description: "Logo aplikasi telah berhasil diganti.",
        });
    };

    return (
        <>
            <PageHeader title="Settings" />
            <div className="grid gap-6">
                {isAdmin && (
                    <Card className="content-card">
                        <CardHeader>
                            <CardTitle>Branding</CardTitle>
                            <CardDescription>Sesuaikan logo aplikasi Anda.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label>Pratinjau Logo</Label>
                                <div className="mt-2 flex h-20 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 p-4">
                                    {logoPreview ? (
                                        <Image src={logoPreview} alt="Logo Preview" height={60} width={200} className="object-contain" />
                                    ) : (
                                        <p className="text-muted-foreground">Tidak ada logo</p>
                                    )}
                                </div>
                            </div>
                            <Tabs defaultValue="url" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="url">URL</TabsTrigger>
                                    <TabsTrigger value="upload">Upload</TabsTrigger>
                                </TabsList>
                                <TabsContent value="url">
                                    <Label htmlFor="logoUrl">URL Logo</Label>
                                    <Input 
                                        id="logoUrl"
                                        placeholder="https://example.com/logo.png" 
                                        value={logoUrl}
                                        onChange={handleUrlChange}
                                    />
                                </TabsContent>
                                <TabsContent value="upload">
                                    <Label htmlFor="logoUpload">Upload File</Label>
                                    <Input
                                        id="logoUpload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full text-sm text-slate-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-primary/10 file:text-primary
                                            hover:file:bg-primary/20"
                                    />
                                </TabsContent>
                            </Tabs>
                            <div className="flex justify-end">
                                <Button onClick={handleSaveLogo}>Simpan Logo</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card className="content-card">
                    <CardHeader>
                        <CardTitle>General</CardTitle>
                        <CardDescription>Manage general application settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="appName">Application Name</Label>
                            <Input id="appName" defaultValue="UNILIFE Dashboard" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="appUrl">Application URL</Label>
                            <Input id="appUrl" defaultValue="https://unilife.com" />
                        </div>
                         <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="maintenance-mode" className="text-base">Maintenance Mode</Label>
                                <p className="text-sm text-muted-foreground">
                                    Temporarily disable access to the public site.
                                </p>
                            </div>
                            <Switch id="maintenance-mode" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="content-card">
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>Manage how you receive notifications.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive an email for important updates.
                                </p>
                            </div>
                            <Switch id="email-notifications" defaultChecked />
                        </div>
                         <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive push notifications on your devices.
                                </p>
                            </div>
                            <Switch id="push-notifications" />
                        </div>
                    </CardContent>
                </Card>

                 <div className="flex justify-end">
                    <Button>Save All Settings</Button>
                </div>
            </div>
        </>
    );
}
