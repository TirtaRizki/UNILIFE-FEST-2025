import React from 'react';
import { Button } from '@/components/ui/button';
import { FaInstagram } from 'react-icons/fa';

const HeroSection = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-hero-bg-zoom" style={{backgroundImage: "url('https://placehold.co/1920x1080.png')"}} data-ai-hint="concert stage lights"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
        
        <div className="relative z-10 px-4 flex flex-col items-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-headline uppercase tracking-wider mb-4 animate-fade-up" style={{animationDelay: '0.2s'}}>
                UNILIFE LAMPUNG FEST 2025
            </h1>
            <h2 className="text-2xl md:text-4xl font-bold text-primary mb-8 font-headline animate-fade-up" style={{animationDelay: '0.4s'}}>
                Back To School
            </h2>
            <p className="text-lg md:text-xl mb-4 animate-fade-up" style={{animationDelay: '0.6s'}}>30-31 Agustus 2025</p>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 animate-fade-up" style={{animationDelay: '0.8s'}}>PKOR, Bandar Lampung</p>
            <Button size="lg" className="h-14 px-10 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg shadow-primary/30 transition-transform duration-300 hover:scale-105 animate-fade-up" style={{animationDelay: '1s'}} asChild>
                <a href="https://mytiketin.com/event/79" target="_blank" rel="noopener noreferrer">
                    Get Ticket
                </a>
            </Button>
            <div className="flex space-x-6 mt-12 animate-fade-up" style={{animationDelay: '1.2s'}}>
                <a href="https://www.instagram.com/unilife.festival?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><FaInstagram size={24} /></a>
            </div>
        </div>
    </section>
  );
};

export default HeroSection;