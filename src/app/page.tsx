
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import type { User } from '@/lib/types';

const Logo = () => {
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    useEffect(() => {
        const handleStorageChange = () => {
            const storedLogo = localStorage.getItem('appLogo');
            setLogoUrl(storedLogo);
        };
        handleStorageChange(); // Initial load
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    if (logoUrl) {
        return <Image src={logoUrl} alt="Unilife Logo" width={140} height={40} className="object-contain" />;
    }
    return <h1 className="text-3xl font-headline font-bold text-primary">UNILIFE</h1>;
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const response = await fetch(`/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }
        
        const foundUser = data.user;

        sessionStorage.setItem('loggedInUser', JSON.stringify(foundUser));
        window.dispatchEvent(new Event('storage')); // Notify auth hook

        toast({
            title: "Login Successful",
            description: `Welcome back, ${foundUser.name}!`,
        });
        router.push("/dashboard");

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({
            title: "Login Failed",
            description: errorMessage,
            variant: "destructive",
        });
    }
  };

  const handleMemberEntry = () => {
      const memberUser: Omit<User, 'password'> = {
        id: `MEMBER${Date.now()}`,
        name: 'Guest Member',
        email: 'member@unilifefest.com',
        role: 'Member'
      };
      sessionStorage.setItem('loggedInUser', JSON.stringify(memberUser));
      window.dispatchEvent(new Event('storage'));
      toast({
        title: "Welcome!",
        description: "You have entered as a guest.",
      });
      router.push('/dashboard');
  };

  return (
    <div className="auth-layout px-4">
      <Card className="w-full max-w-md rounded-2xl border-white/20 bg-white/95 p-4 shadow-2xl backdrop-blur-lg sm:p-8">
        <CardHeader className="pb-4">
            <div className="flex items-center justify-center mb-4 h-10">
                <Logo />
            </div>
          <CardTitle className="text-2xl font-bold text-center text-foreground">Login</CardTitle>
          <CardDescription className="text-center text-muted-foreground">UNILIFE LAMPUNG FEST 2025 - Back to School</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdminLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@unilifefest.com"
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
            
            <Button type="submit" className="w-full text-base font-semibold mt-2">
                Login
            </Button>
          </form>

            <div className="my-6 flex items-center">
                <div className="flex-grow border-t border-muted-foreground/20"></div>
                <span className="mx-4 flex-shrink text-xs uppercase text-muted-foreground">Or</span>
                <div className="flex-grow border-t border-muted-foreground/20"></div>
            </div>

            <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">User tidak perlu mendaftar</p>
                <Button onClick={handleMemberEntry} className="w-full text-base font-semibold" variant="outline">
                    Klik Disini Untuk Masuk
                </Button>
            </div>

        </CardContent>
        <CardFooter className="pt-6">
            <p className="w-full text-center text-xs text-muted-foreground">Powered by UNIYOUTH © 2025</p>
        </CardFooter>
      </Card>
    </div>
  );
}
