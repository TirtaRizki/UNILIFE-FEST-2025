
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import VisitorCounter from './visitor-counter';

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
    <footer className="bg-gradient-to-t from-[#1A1A1A] to-[#252525] text-gray-300 font-sans">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center">
            {/* Logo and Tagline */}
            <Link href="/" className="inline-block mb-4">
                <Image src="https://firebasestudio.googleapis.com/v0/b/firebase-studio-users.appspot.com/o/user%2Fclw1uss2s00001y6w36fhhq82%2Fimages%2Fcoh46dln-unilife.png?alt=media&token=b71c0ef4-6447-4fec-8877-33633ab0a7d9" alt="Unilife Logo" width={150} height={40} className="object-contain" />
            </Link>
            <p className="text-sm max-w-md text-gray-400 mb-6">
                The most anticipated event in Lampung, combining music, art, and creativity. Back to School!
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-6 mb-8">
                <a href="https://www.instagram.com/unilife.festival?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-transform duration-300 hover:scale-110">
                    <FaInstagram size={24} />
                </a>
                <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-transform duration-300 hover:scale-110">
                    <FaTiktok size={24} />
                </a>
            </div>

            {/* Navigation */}
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8">
              {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={(e) => handleLinkClick(e, link.href)} className="text-sm text-gray-400 hover:text-primary transition-colors">
                      {link.name}
                  </Link>
              ))}
            </nav>

            {/* Map and Visitor Counter */}
            <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-8">
                <div className="w-full h-48 rounded-lg overflow-hidden border-2 border-primary/20 shadow-lg md:col-span-2">
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
      <div className="bg-black/30 py-4">
          <div className="container mx-auto px-4">
            <p className='text-center text-xs text-gray-500'>&copy; {new Date().getFullYear()} UNIYOUTH. All rights reserved.</p>
          </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
