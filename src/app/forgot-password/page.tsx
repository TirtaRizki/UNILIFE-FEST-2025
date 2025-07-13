
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import type { User } from '@/lib/types';
import { ChevronLeft } from 'lucide-react';

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


const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const passwordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});


export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [userEmail, setUserEmail] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  const emailForm = useForm<z.infer<typeof emailSchema>>({ resolver: zodResolver(emailSchema) });
  const otpForm = useForm<z.infer<typeof otpSchema>>({ resolver: zodResolver(otpSchema) });
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({ resolver: zodResolver(passwordSchema) });

  const handleEmailSubmit = (values: z.infer<typeof emailSchema>) => {
    const usersInStorage = localStorage.getItem('users');
    const users: User[] = usersInStorage ? JSON.parse(usersInStorage) : [];
    const foundUser = users.find(u => u.email === values.email);

    if (!foundUser || !foundUser.phoneNumber) {
      toast({ title: "Error", description: "User not found or no phone number is associated with this account.", variant: "destructive" });
      return;
    }

    // Simulate sending OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setUserEmail(values.email);

    toast({
      title: "OTP Sent (Simulation)",
      description: `Your OTP is: ${otp}. It was "sent" to ${foundUser.phoneNumber}.`,
      duration: 10000,
    });
    setStep(2);
  };

  const handleOtpSubmit = (values: z.infer<typeof otpSchema>) => {
    if (values.otp === generatedOtp) {
      toast({ title: "Success", description: "OTP verified. Please set your new password." });
      setStep(3);
    } else {
      toast({ title: "Error", description: "Invalid OTP.", variant: "destructive" });
    }
  };

  const handlePasswordSubmit = (values: z.infer<typeof passwordSchema>) => {
    const usersInStorage = localStorage.getItem('users');
    let users: User[] = usersInStorage ? JSON.parse(usersInStorage) : [];
    const userIndex = users.findIndex(u => u.email === userEmail);

    if (userIndex === -1) {
      toast({ title: "Error", description: "An unexpected error occurred. Please try again.", variant: "destructive" });
      return;
    }

    users[userIndex].password = values.password;
    localStorage.setItem('users', JSON.stringify(users));

    toast({
      title: "Password Reset Successful",
      description: "You can now log in with your new password.",
    });
    router.push('/');
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[rgb(var(--background-start-rgb))] to-[rgb(var(--background-end-rgb))] px-4">
      <Card className="w-full max-w-md rounded-2xl border-white/20 bg-white/95 p-4 shadow-2xl backdrop-blur-lg sm:p-8">
        <CardHeader className="pb-4 text-center">
            <div className="flex items-center justify-center mb-4 h-10">
                <Logo />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
                {step === 1 && "Forgot Password"}
                {step === 2 && "Enter OTP"}
                {step === 3 && "Reset Password"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
                {step === 1 && "Enter your email to receive a reset code."}
                {step === 2 && "Check your phone for the 6-digit code."}
                {step === 3 && "Create a new secure password."}
            </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input placeholder="you@example.com" {...field} className="bg-white" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Send Reset Code</Button>
              </form>
            </Form>
          )}

          {step === 2 && (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-4">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OTP Code</FormLabel>
                      <FormControl><Input placeholder="123456" {...field} className="bg-white" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Verify OTP</Button>
              </form>
            </Form>
          )}

          {step === 3 && (
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl><Input type="password" placeholder="••••••••" {...field} className="bg-white" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl><Input type="password" placeholder="••••••••" {...field} className="bg-white" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Reset Password</Button>
              </form>
            </Form>
          )}

           <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

