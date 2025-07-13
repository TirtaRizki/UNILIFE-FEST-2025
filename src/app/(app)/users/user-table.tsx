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

export default function UserTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // TODO: Fetch data from your database
    useEffect(() => {
        // const fetchedUsers = await fetch('/api/users');
        // setUsers(fetchedUsers);
    }, []);

    const handleAdd = () => {
        setSelectedUser(null);
        setSheetOpen(true);
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setSheetOpen(true);
    };
    
    const handleDelete = async (id: string) => {
      // TODO: Add your database deletion logic here
      // await fetch(`/api/users/${id}`, { method: 'DELETE' });
      setUsers(users.filter(u => u.id !== id));
    };

    const handleSave = async (userData: User) => {
        if (selectedUser && userData.id) {
            // TODO: Add your database update logic here
            // const updatedUser = await fetch(`/api/users/${userData.id}`, { method: 'PUT', body: JSON.stringify(userData) });
            setUsers(users.map(u => u.id === userData.id ? userData : u));
        } else {
            // TODO: Add your database creation logic here
            const newUser = { ...userData, id: `USR${Date.now()}` }; // Replace with ID from DB
            // const createdUser = await fetch('/api/users', { method: 'POST', body: JSON.stringify(newUser) });
            setUsers([...users, newUser]);
        }
        setSheetOpen(false);
    }
    
    const getBadgeVariant = (role: User['role']) => {
        switch (role) {
            case 'Admin':
                return 'destructive';
            case 'Member':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    return (
        <>
            <PageHeader title="Kelola User" actions={
                <Button onClick={handleAdd}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Tambah User
                </Button>
            } />
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
                                    <TableHead>Role</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={getBadgeVariant(user.role)}>{user.role}</Badge>
                                        </TableCell>
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
                                                    <DropdownMenuItem onClick={() => handleEdit(user)}>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(user.id)}>Delete</DropdownMenuItem>
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
            <UserForm 
                open={sheetOpen} 
                onOpenChange={setSheetOpen}
                user={selectedUser}
                onSave={handleSave}
            />
        </>
    );
}
