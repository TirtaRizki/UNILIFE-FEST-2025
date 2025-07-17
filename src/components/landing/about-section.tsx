
"use server";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { About } from '@/lib/types';
import Link from 'next/link';

// This function now fetches from the internal API route
const fetchAbout = async (): Promise<About | null> => {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/about`, {
            next: { revalidate: 300 } // Revalidate every 5 minutes
        });
        if (!response.ok) {
           throw new Error(`Failed to fetch about content: ${response.statusText}`);
        }
        const data = await response.json();
        return data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error("Could not fetch about content:", error);
        return null;
    }
};
    
const AboutSection = async () => {
    const about = await fetchAbout();
    
    if (!about) {
        return null;
    }

    return (
        <section id="about" className="py-20 md:py-32 bg-background/5 backdrop-blur-sm overflow-hidden animate-fade-up">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-bold font-headline mb-6 text-primary">{about.title}</h2>
                        <p className="text-muted-foreground text-lg mb-8 whitespace-pre-wrap">{about.description}</p>
                        <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                            <Link href="#dashboard-info">
                                Get Your Ticket
                            </Link>
                        </Button>
                    </div>
                    <div className="flex justify-center">
                         <Image
                            src="https://placehold.co/600x600.png"
                            alt="About Unilife Fest"
                            width={500}
                            height={500}
                            className="rounded-xl shadow-2xl shadow-primary/20 object-cover"
                            data-ai-hint="music festival crowd"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
