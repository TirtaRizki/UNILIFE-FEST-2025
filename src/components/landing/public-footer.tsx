
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
    <footer className="bg-[#1A1A1A] text-gray-300 font-sans">
        <div className="container mx-auto px-4 py-16">
            <div className="flex flex-col items-center text-center">
                 <Link href="/" className="inline-block mb-4">
                    <Image 
                        src="/images/unilife_logo.png" 
                        alt="Unilife Logo" 
                        width={180} 
                        height={48} 
                        className="object-contain" 
                    />
                </Link>
                <p className="text-lg max-w-md text-gray-400 mt-2 mb-6">
                    The most anticipated back-to-school festival in Lampung, uniting music, art, and youthful creativity.
                </p>
                <div className="flex space-x-6 mb-8">
                    <a href="https://www.instagram.com/unilife.festival?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-transform duration-300 hover:scale-110">
                        <FaInstagram size={28} />
                    </a>
                    <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-transform duration-300 hover:scale-110">
                        <FaTiktok size={28} />
                    </a>
                </div>
                <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10">
                  {navLinks.map((link) => (
                      <Link key={link.href} href={link.href} onClick={(e) => handleLinkClick(e, link.href)} className="text-base text-gray-300 hover:text-primary transition-colors">
                          {link.name}
                      </Link>
                  ))}
                </nav>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="w-full h-64 rounded-lg overflow-hidden border-2 border-primary/20 shadow-lg">
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
        </div>
        <div className="py-4 bg-black/30">
            <div className="container mx-auto px-4 text-center text-xs text-gray-500">
                &copy; {new Date().getFullYear()} UNIYOUTH. All rights reserved.
            </div>
        </div>
    </footer>
  );
};

export default PublicFooter;
