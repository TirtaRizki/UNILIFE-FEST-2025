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

    useEffect(() => {
      if (mobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
      return () => {
        document.body.style.overflow = 'auto';
      }
    }, [mobileMenuOpen]);

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
        setMobileMenuOpen(false);
    };

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            scrolled || mobileMenuOpen ? "bg-black/80 backdrop-blur-sm shadow-lg" : "bg-transparent"
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

                    <div className="hidden md:flex items-center gap-2">
                        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                            <a href="https://mytiketin.com/event/79" target="_blank" rel="noopener noreferrer">
                                Get Ticket
                            </a>
                        </Button>
                        <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary font-bold">
                            <Link href="/login">
                                Admin Login
                            </Link>
                        </Button>
                    </div>

                    <div className="md:hidden">
                        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
                            <Menu className="h-6 w-6 text-white" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden",
                    mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <div className={cn(
                "fixed top-0 right-0 h-full w-4/5 max-w-sm z-50 bg-black/90 backdrop-blur-lg transform transition-transform duration-300 ease-in-out md:hidden",
                mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            )}>
                <div className="flex justify-end p-4 border-b border-white/10">
                     <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                        <X className="h-6 w-6 text-white" />
                    </Button>
                </div>
                <nav className="flex flex-col p-8 space-y-4">
                     {navLinks.map((link, index) => (
                        <Link 
                          key={link.name} 
                          href={link.href} 
                          onClick={(e) => handleLinkClick(e, link.href)} 
                          className="text-xl font-bold text-white hover:text-primary transition-all duration-300 transform"
                          style={{
                              transitionDelay: `${index * 50}ms`,
                              opacity: mobileMenuOpen ? 1 : 0,
                              transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(10px)',
                          }}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div 
                      className="pt-8 flex flex-col space-y-4 transition-all duration-300"
                      style={{
                          transitionDelay: `${navLinks.length * 50}ms`,
                          opacity: mobileMenuOpen ? 1 : 0,
                          transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(10px)',
                      }}
                    >
                      <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold w-full">
                          <a href="https://mytiketin.com/event/79" target="_blank" rel="noopener noreferrer">
                              Get Ticket
                          </a>
                      </Button>
                      <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 hover:text-primary font-bold w-full">
                          <Link href="/login">
                              Admin Login
                          </Link>
                      </Button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default PublicHeader;
