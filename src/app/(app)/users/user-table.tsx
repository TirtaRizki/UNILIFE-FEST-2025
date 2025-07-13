
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

export default function UserTable() {
    const { user: loggedInUser, hasRole } = useAuth();
    const canManage = hasRole(['Admin', 'Panitia']);
    const [users, setUsers] = useState<User[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
        }

        const handleStorageChange = () => {
            const storedUsers = localStorage.getItem('users');
            if (storedUsers) {
                setUsers(JSON.parse(storedUsers));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const updateUsers = (updatedUsers: User[]) => {
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        window.dispatchEvent(new Event('storage'));
    };

    const handleAdd = () => {
        setSelectedUser(null);
        setSheetOpen(true);
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setSheetOpen(true);
    };
    
    const handleDelete = async (id: string) => {
        if (id === loggedInUser?.id) {
            alert("You cannot delete your own account.");
            return;
        }
        const updatedUsers = users.filter(u => u.id !== id);
        updateUsers(updatedUsers);
    };

    const handleSave = async (userData: User) => {
        let updatedUsers;
        if (selectedUser && userData.id) {
            updatedUsers = users.map(u => {
                if (u.id === userData.id) {
                    const existingUser = { ...u };
                    const updatedUser = { ...existingUser, ...userData };
                    
                    if (!userData.password) {
                        updatedUser.password = existingUser.password;
                    }
                    return updatedUser;
                }
                return u;
            });
        } else {
            const newUser = { ...userData, id: `USR${Date.now()}` };
            updatedUsers = [...users, newUser];
        }
        updateUsers(updatedUsers);
        setSheetOpen(false);
    }
    
    const getBadgeVariant = (role: User['role']) => {
        switch (role) {
            case 'Admin':
                return 'destructive';
            case 'Member':
            case 'Panitia':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    return (
        <>
            <PageHeader 
                title="Kelola User" 
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
                                {users.map((user) => (
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
                                ))}
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
