"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Events', href: '#events' },
    { name: 'Line Up', href: '#lineup' },
    { name: 'Recap', href: '#recap' },
];

const PublicHeader = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
    };

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            scrolled ? "bg-black/80 backdrop-blur-sm shadow-lg" : "bg-transparent"
        )}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    <Link href="#home" onClick={(e) => handleLinkClick(e, '#home')} className="text-3xl font-headline font-bold text-primary">
                        UNILIFE
                    </Link>

                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link key={link.name} href={link.href} onClick={(e) => handleLinkClick(e, link.href)} className="text-base font-medium text-white hover:text-primary transition-colors">
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden md:block">
                        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                            <a href="https://mytiketin.com/event/79" target="_blank" rel="noopener noreferrer">
                                Get Ticket
                            </a>
                        </Button>
                    </div>

                    <div className="md:hidden">
                        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
                            <Menu className="h-6 w-6 text-white" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={cn(
                "fixed inset-0 z-50 bg-black/95 backdrop-blur-lg transform transition-transform md:hidden",
                mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            )}>
                <div className="flex justify-end p-4">
                     <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                        <X className="h-6 w-6 text-white" />
                    </Button>
                </div>
                <nav className="flex flex-col items-center justify-center h-full space-y-8">
                     {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} onClick={(e) => handleLinkClick(e, link.href)} className="text-2xl font-bold text-white hover:text-primary transition-colors">
                            {link.name}
                        </Link>
                    ))}
                     <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold mt-8">
                        <a href="https://mytiketin.com/event/79" target="_blank" rel="noopener noreferrer">
                            Get Ticket
                        </a>
                    </Button>
                </nav>
            </div>
        </header>
    );
};

export default PublicHeader;
