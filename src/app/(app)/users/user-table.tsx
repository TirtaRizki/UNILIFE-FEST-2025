
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
import type { User } from "@/lib/types";
import { UserForm } from './user-form';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export default function UserTable() {
    const { user: loggedInUser, hasRole } = useAuth();
    const canManage = hasRole(['Admin']);
    const [users, setUsers] = useState<Omit<User, 'password'>[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${apiUrl}/api/users`);
            if (!response.ok) throw new Error("Failed to fetch users");
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            toast({ title: "Error", description: "Could not fetch users.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAdd = () => {
        setSelectedUser(null);
        setSheetOpen(true);
    };

    const handleEdit = (user: Omit<User, 'password'>) => {
        setSelectedUser(user as User);
        setSheetOpen(true);
    };
    
    const handleDelete = async (id: string) => {
        if (id === loggedInUser?.id) {
            toast({ title: "Action Forbidden", description: "You cannot delete your own account.", variant: "destructive" });
            return;
        }
        try {
            const response = await fetch(`${apiUrl}/api/users/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error("Failed to delete user");
            toast({ title: "Success", description: "User deleted successfully." });
            fetchUsers();
        } catch (error) {
            toast({ title: "Error", description: "Could not delete user.", variant: "destructive" });
        }
    };

    const handleSave = async (userData: User) => {
        try {
            const response = await fetch(`${apiUrl}/api/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            if (!response.ok) throw new Error("Failed to save user");
            toast({ title: "Success", description: "User saved successfully." });
            setSheetOpen(false);
            setSelectedUser(null);
            fetchUsers();
        } catch (error) {
            toast({ title: "Error", description: "Could not save user.", variant: "destructive" });
        }
    }
    
    const getBadgeVariant = (role: User['role']) => {
        switch (role) {
            case 'Admin': return 'destructive';
            case 'Member':
            case 'Panitia': return 'secondary';
            default: return 'outline';
        }
    };
    
    if (isLoading) {
        return <div>Loading users...</div>;
    }

    return (
        <>
            <PageHeader 
                title="User" 
                actions={
                    canManage && (
                        <Button onClick={handleAdd}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Tambah User
                        </Button>
                    )
                } 
            />
            <Card className="content-card">
                <CardHeader>
                    <CardTitle>Daftar Pengguna</CardTitle>
                    <CardDescription>Kelola akun pengguna dan peran mereka.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone Number</TableHead>
                                    <TableHead>Role</TableHead>
                                    {canManage && (
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.length > 0 ? users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phoneNumber}</TableCell>
                                        <TableCell>
                                            <Badge variant={getBadgeVariant(user.role)}>{user.role}</Badge>
                                        </TableCell>
                                        {canManage && user.role !== 'Admin' && (
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button aria-haspopup="true" size="icon" variant="ghost" disabled={user.role === 'Admin'}>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleEdit(user)}>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(user.id)} disabled={user.id === loggedInUser?.id}>Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        )}
                                        {canManage && user.role === 'Admin' && <TableCell></TableCell>}
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center">No users found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            {canManage && (
              <UserForm 
                  open={sheetOpen} 
                  onOpenChange={setSheetOpen}
                  user={selectedUser}
                  onSave={handleSave}
              />
            )}
        </>
    );
}
