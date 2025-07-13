
"use client"

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const profileSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Nama harus memiliki setidaknya 3 karakter"),
  email: z.string().email("Alamat email tidak valid"),
  password: z.string().min(8, "Password harus memiliki setidaknya 8 karakter").optional().or(z.literal('')),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.password) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});


export function ProfileForm() {
    const [user, setUser] = useState<User | null>(null);
    const { toast } = useToast();

    // In a real app, you would fetch the current user's data from your authentication context or API
    useEffect(() => {
        const usersInStorage = localStorage.getItem('users');
        if (usersInStorage) {
            const allUsers: User[] = JSON.parse(usersInStorage);
            // For demo purposes, we'll assume the 'Admin' is the current user
            const adminUser = allUsers.find(u => u.role === 'Admin');
            if(adminUser) {
                setUser(adminUser);
            } else if (allUsers.length > 0) {
                setUser(allUsers[0]); // fallback to first user
            }
        }
    }, []);

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                id: user.id,
                name: user.name,
                email: user.email,
                password: "",
                confirmPassword: "",
            });
        }
    }, [user, form]);
    
    const onSubmit = (values: z.infer<typeof profileSchema>) => {
        if (!user) return;
        
        const usersInStorage = localStorage.getItem('users');
        if (!usersInStorage) return;

        let allUsers: User[] = JSON.parse(usersInStorage);
        const updatedUsers = allUsers.map(u => {
            if (u.id === user.id) {
                // For a real app, you would handle password hashing on the server
                // Here we just demonstrate the logic
                const updatedUser = {
                    ...u,
                    name: values.name,
                    email: values.email,
                    // Note: In a real app, never store plain text passwords.
                    // This is just for demonstration.
                };
                 // password field is omitted for security demo
                return updatedUser;
            }
            return u;
        });

        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Update local state to reflect changes immediately
        const newlyUpdatedUser = updatedUsers.find(u => u.id === user.id);
        if (newlyUpdatedUser) {
          setUser(newlyUpdatedUser);
          // Also trigger storage event for other components if needed
          window.dispatchEvent(new Event('storage'));
        }

        toast({
            title: "Profil Diperbarui",
            description: "Informasi profil Anda telah berhasil disimpan.",
        });
    };

    if(!user) return <div>Memuat profil...</div>

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20 border-4 border-white/50 shadow-md">
                        <AvatarImage src="https://placehold.co/80x80.png" alt={user.name} data-ai-hint="person user"/>
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h3 className="text-2xl font-bold">{user.name}</h3>
                        <p className="text-muted-foreground">{user.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Lengkap</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nama lengkap Anda" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Alamat Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="email@anda.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password Baru</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Biarkan kosong untuk tidak mengubah" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Konfirmasi Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Konfirmasi password baru Anda" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                
                <div className="flex justify-end">
                    <Button type="submit">Simpan Perubahan</Button>
                </div>
            </form>
        </Form>
    );
}
