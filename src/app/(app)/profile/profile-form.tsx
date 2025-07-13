
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
import { useAuth } from "@/hooks/use-auth";

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
    const { user: authUser } = useAuth();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (authUser) {
            const usersInStorage = localStorage.getItem('users');
            if (usersInStorage) {
                const allUsers: User[] = JSON.parse(usersInStorage);
                const fullUser = allUsers.find(u => u.id === authUser.id);
                if(fullUser) {
                    setCurrentUser(fullUser);
                }
            } else {
                setCurrentUser(null);
            }
        } else {
            setCurrentUser(null);
        }
    }, [authUser]);

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
        if (currentUser) {
            form.reset({
                id: currentUser.id,
                name: currentUser.name,
                email: currentUser.email,
                password: "",
                confirmPassword: "",
            });
        }
    }, [currentUser, form]);
    
    const onSubmit = (values: z.infer<typeof profileSchema>) => {
        if (!currentUser) return;
        
        const usersInStorage = localStorage.getItem('users');
        if (!usersInStorage) return;

        let allUsers: User[] = JSON.parse(usersInStorage);
        const updatedUsers = allUsers.map(u => {
            if (u.id === currentUser.id) {
                const updatedUser = {
                    ...u,
                    name: values.name,
                    email: values.email,
                };
                if (values.password) {
                    updatedUser.password = values.password;
                }
                return updatedUser;
            }
            return u;
        });

        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        const newlyUpdatedUser = updatedUsers.find(u => u.id === currentUser.id);
        if (newlyUpdatedUser) {
          setCurrentUser(newlyUpdatedUser);
          
          const userForSession: Omit<User, 'password'> = {
              id: newlyUpdatedUser.id,
              name: newlyUpdatedUser.name,
              email: newlyUpdatedUser.email,
              role: newlyUpdatedUser.role,
          };
          sessionStorage.setItem('loggedInUser', JSON.stringify(userForSession));
          
          window.dispatchEvent(new Event('storage'));
        }

        toast({
            title: "Profil Diperbarui",
            description: "Informasi profil Anda telah berhasil disimpan.",
        });
        form.reset({ ...form.getValues(), password: '', confirmPassword: '' });
    };

    if(!currentUser) return <div>Memuat profil...</div>

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20 border-4 border-white/50 shadow-md">
                        <AvatarImage src="https://placehold.co/80x80.png" alt={currentUser.name} data-ai-hint="person user"/>
                        <AvatarFallback>{currentUser.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h3 className="text-2xl font-bold">{currentUser.name}</h3>
                        <p className="text-muted-foreground">{currentUser.email}</p>
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
