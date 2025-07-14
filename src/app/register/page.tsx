
"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { RegisterForm } from "./register-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const Logo = () => {
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    useEffect(() => {
        const storedLogo = localStorage.getItem('appLogo');
        if (storedLogo) {
            setLogoUrl(storedLogo);
        }
    }, []);

    if (logoUrl) {
        return <Image src={logoUrl} alt="Unilife Logo" width={140} height={40} className="object-contain" />;
    }
    return <h1 className="text-3xl font-headline font-bold text-primary">UNILIFE</h1>;
};

export default function RegisterPage() {
  return (
    <div className="auth-layout px-4">
      <Card className="w-full max-w-md rounded-2xl border-white/20 bg-white/95 p-4 shadow-2xl backdrop-blur-lg sm:p-8">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-center mb-4 h-10">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-foreground">Create an Account</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Enter your details below to create your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
           <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/" className="underline">
                Sign in
              </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
