"use client";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { About } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

const AboutSection = () => {
    const { toast } = useToast();
    const [about, setAbout] = useState<About | null>(null);

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const response = await fetch('/api/about');
                if (!response.ok) return;
                const data = await response.json();
                if (data.length > 0) {
                    setAbout(data[0]);
                }
            } catch (error) {
                console.error("Could not fetch about content:", error);
            }
        };
        fetchAbout();
    }, []);

    const handleGetTicketClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const targetElement = document.querySelector('#dashboard-info');
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
        toast({
            title: "Prepare for The War! 🚀",
            description: "You are being scrolled to the ticket countdown section.",
        });
    };
    
    if (!about) {
        // Render a placeholder or nothing while loading
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
                            <a href="#dashboard-info" onClick={handleGetTicketClick}>
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
