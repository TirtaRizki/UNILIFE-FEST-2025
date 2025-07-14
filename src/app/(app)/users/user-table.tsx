
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

// Helper functions to simulate database interaction with localStorage
const getUsersFromStorage = (): User[] => {
    if (typeof window === 'undefined') return [];
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers) : [];
};

const saveUsersToStorage = (users: User[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('users', JSON.stringify(users));
    window.dispatchEvent(new Event('storage'));
};


export default function UserTable() {
    const { user: loggedInUser, hasRole } = useAuth();
    const canManage = hasRole(['Admin']);
    const [users, setUsers] = useState<User[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching data from a database
        const data = getUsersFromStorage();
        setUsers(data);
        setIsLoading(false);

        const handleStorageChange = () => {
            setUsers(getUsersFromStorage());
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
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
        if (id === loggedInUser?.id) {
            alert("You cannot delete your own account.");
            return;
        }
        // Simulate an API call to delete
        const currentUsers = getUsersFromStorage();
        const updatedUsers = currentUsers.filter(u => u.id !== id);
        saveUsersToStorage(updatedUsers);
        setUsers(updatedUsers);
    };

    const handleSave = async (userData: User) => {
        // Simulate an API call to save
        const currentUsers = getUsersFromStorage();
        let updatedUsers;

        if (selectedUser && userData.id) {
            updatedUsers = currentUsers.map(u => {
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
            updatedUsers = [...currentUsers, newUser];
        }
        
        saveUsersToStorage(updatedUsers);
        setUsers(updatedUsers);
        setSheetOpen(false);
        setSelectedUser(null);
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
    
    if (isLoading) {
        return <div>Loading...</div>;
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

