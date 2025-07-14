
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="auth-layout px-4">
      <Card className="w-full max-w-md rounded-2xl border-white/20 bg-white/95 p-4 shadow-2xl backdrop-blur-lg sm:p-8">
        <CardHeader className="pb-4">
            <div className="flex items-center justify-center mb-4 h-10">
                <Logo />
            </div>
          <CardTitle className="text-2xl font-bold text-center text-foreground">Welcome Back</CardTitle>
          <CardDescription className="text-center text-muted-foreground">UNILIFE LAMPUNG FEST 2025 - Back to School</CardDescription>
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
                <Link href="/forgot-password" className="ml-auto inline-block text-sm text-primary hover:underline" prefetch={false}>
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
