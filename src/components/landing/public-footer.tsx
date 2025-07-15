
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import VisitorCounter from './visitor-counter';
import { Button } from '../ui/button';

const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Events', href: '#events' },
    { name: 'Line Up', href: '#lineup' },
    { name: 'Recap', href: '#recap' },
];

const PublicFooter = () => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const targetElement = document.querySelector(href);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
  };

  return (
    <footer className="bg-gradient-to-t from-[#1A1A1A] to-[#252525] text-gray-300 font-sans pt-12">
        <div className="container mx-auto px-4">
            {/* Top section with logo, socials, and navigation */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                 <div className="flex-shrink-0">
                    <Link href="/" className="inline-block">
                        <Image 
                            src="https://firebasestudio.googleapis.com/v0/b/firebase-studio-users.appspot.com/o/user%2Fclxsn2j1b00001y9zaa6n2w09%2Fimages%2Fcoe93b0j-ciki-cinta.png?alt=media&token=c27e04f6-ef77-4b7b-8ff0-d13c19b027c6" 
                            alt="Unilife Logo" 
                            width={150} 
                            height={40} 
                            className="object-contain" 
                        />
                    </Link>
                    <p className="text-sm max-w-xs text-gray-400 mt-2">
                        The most anticipated event in Lampung, combining music, art, and creativity.
                    </p>
                </div>
                
                <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                  {navLinks.map((link) => (
                      <Link key={link.href} href={link.href} onClick={(e) => handleLinkClick(e, link.href)} className="text-sm text-gray-400 hover:text-primary transition-colors">
                          {link.name}
                      </Link>
                  ))}
                </nav>
                
                <div className="flex space-x-6">
                    <a href="https://www.instagram.com/unilife.festival?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-transform duration-300 hover:scale-110">
                        <FaInstagram size={24} />
                    </a>
                    <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-transform duration-300 hover:scale-110">
                        <FaTiktok size={24} />
                    </a>
                </div>
            </div>

            {/* Bottom section for map and visitor counter, with responsive layout */}
            <div className="mt-10 pt-10 border-t border-white/10 flex flex-col-reverse md:flex-row items-center justify-between gap-8">
                <div className="w-full md:w-auto text-center md:text-left text-xs text-gray-500">
                    &copy; {new Date().getFullYear()} UNIYOUTH. All rights reserved.
                </div>

                <div className="w-full md:w-2/3 lg:w-1/2 h-48 rounded-lg overflow-hidden border-2 border-primary/20 shadow-lg">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.235154110599!2d105.27548907602906!3d-5.381077353813967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40db52585e7689%3A0x7e96c3d76b2c7aae!2sPusat%20Kegiatan%20Olahraga%20(PKOR)!5e0!3m2!1sid!2sid!4v1752602016714!5m2!1sid!2sid" 
                        width="100%" 
                        height="100%"
                        style={{border:0}} 
                        allowFullScreen={true} 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade">
                    </iframe>
                </div>
                
                <div className="flex justify-center">
                    <VisitorCounter />
                </div>
            </div>
        </div>
        <div className="mt-10 py-4 bg-black/20">
            {/* Can add a final message here if needed, or leave it for spacing */}
        </div>
    </footer>
  );
};

export default PublicFooter;
