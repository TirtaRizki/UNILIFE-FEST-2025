"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { About } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

const AboutSection = () => {
    const [about, setAbout] = useState<About | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const res = await fetch('/api/about');
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                if (data.length > 0) {
                    setAbout(data[0]);
                }
            } catch (error) {
                console.error("Could not fetch about content:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAbout();
    }, []);

    if (isLoading) {
        return (
            <section id="about" className="py-20 md:py-32 bg-background/5">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <Skeleton className="h-12 w-3/4 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-5/6 mb-4" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                    <Skeleton className="w-full aspect-square rounded-lg" />
                </div>
            </section>
        );
    }
    
    if (!about) {
        return null; // Don't render the section if there's no content
    }

    return (
        <section id="about" className="py-20 md:py-32 bg-background/5 backdrop-blur-sm">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-bold font-headline mb-6 text-primary">{about.title}</h2>
                        <p className="text-muted-foreground text-lg mb-8 whitespace-pre-wrap">{about.description}</p>
                        <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                            <a href="https://mytiketin.com/event/79" target="_blank" rel="noopener noreferrer">
                                Get Your Ticket
                            </a>
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
