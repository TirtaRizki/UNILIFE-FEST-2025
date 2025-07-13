"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from "@/hooks/use-toast";
import type { User } from '@/lib/types';
import { mockUsers } from '@/lib/data';

const Logo = () => (
    <h1 className="text-3xl font-headline font-bold text-primary">UNILIFE</h1>
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Initialize admin user if not present
    const usersInStorage = localStorage.getItem('users');
    let users = usersInStorage ? JSON.parse(usersInStorage) : [];

    if (!users.some((u: User) => u.email === 'admin@unilife.com')) {
        const initialUsers: User[] = [
            { id: 'USR001', name: 'Admin User', email: 'admin@unilife.com', role: 'Admin' },
            ...mockUsers
        ];
        // Note: For a real app, do not store passwords in localStorage. This is for demo purposes.
        localStorage.setItem('users', JSON.stringify(initialUsers));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const usersInStorage = localStorage.getItem('users');
    const users: User[] = usersInStorage ? JSON.parse(usersInStorage) : [];
    
    const foundUser = users.find(user => user.email === email);
    
    // For demo: admin has a specific password, others can log in with a generic password.
    const isPasswordCorrect = (foundUser?.role === 'Admin' && password === 'unilifejaya123') || (foundUser?.role !== 'Admin' && password === 'unilifejaya123');

    if (foundUser && isPasswordCorrect) {
        // In a real app, you'd use a more secure session management method.
        sessionStorage.setItem('loggedInUser', JSON.stringify(foundUser));

        toast({
            title: "Login Successful",
            description: `Welcome back, ${foundUser.name}!`,
        });
        router.push("/dashboard");
    } else {
        toast({
            title: "Login Failed",
            description: "Invalid email or password.",
            variant: "destructive",
        });
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[rgb(var(--background-start-rgb))] to-[rgb(var(--background-end-rgb))] px-4">
      <Card className="w-full max-w-md rounded-2xl border-white/20 bg-white/95 p-4 shadow-2xl backdrop-blur-lg sm:p-8">
        <CardHeader className="pb-4">
            <div className="flex items-center justify-center mb-4">
                <Logo />
            </div>
          <CardTitle className="text-2xl font-bold text-center text-foreground">Welcome Back</CardTitle>
          <CardDescription className="text-center text-muted-foreground">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                className="bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Checkbox id="remember-me" />
                    <Label htmlFor="remember-me" className="text-sm font-normal">Remember me</Label>
                </div>
                <Link href="#" className="ml-auto inline-block text-sm text-primary hover:underline" prefetch={false}>
                  Forgot your password?
                </Link>
            </div>
            <Button type="submit" className="w-full text-base font-semibold mt-2">
                Login
            </Button>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
