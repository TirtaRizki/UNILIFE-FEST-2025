
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
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
    <footer className="relative bg-gray-900 text-white pt-20 pb-10 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/30 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/30 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-2">
            <Link href="/">
              <Image src="https://firebasestudio.googleapis.com/v0/b/firebase-studio-users.appspot.com/o/user%2Fclxsn2j1b00001y9zaa6n2w09%2Fimages%2Fcoe93b0j-ciki-cinta.png?alt=media&token=c27e04f6-ef77-4b7b-8ff0-d13c19b027c6" alt="Unilife Logo" width={150} height={40} className="object-contain" />
            </Link>
            <p className="mt-4 text-gray-400 max-w-md">
              UNILIFE LAMPUNG FEST 2025: Back To School. Acara paling ditunggu di Lampung, menggabungkan musik, seni, dan kreativitas.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Navigasi</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} onClick={(e) => handleLinkClick(e, link.href)} className="text-gray-400 hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Ikuti Kami</h4>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/unilife.festival?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-transform duration-300 hover:scale-110">
                <FaInstagram size={28} />
              </a>
              <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-transform duration-300 hover:scale-110">
                <FaTiktok size={28} />
              </a>
            </div>
             <Button asChild className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold w-full md:w-auto">
                <a href="https://mytiketin.com/event/79" target="_blank" rel="noopener noreferrer">
                    Beli Tiket
                </a>
            </Button>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} UNIYOUTH. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
