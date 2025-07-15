
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import { Button } from '../ui/button';
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
    <footer className="relative bg-gray-900 text-white pt-20 pb-10 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/30 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/30 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          
          <div className="lg:col-span-1">
            <h4 className="font-bold text-lg mb-4">Lokasi Event</h4>
            <div className="rounded-lg overflow-hidden border-2 border-primary/20 shadow-lg">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.235154110599!2d105.27548907602906!3d-5.381077353813967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40db52585e7689%3A0x7e96c3d76b2c7aae!2sPusat%20Kegiatan%20Olahraga%20(PKOR)!5e0!3m2!1sid!2sid!4v1752602016714!5m2!1sid!2sid" 
                    width="100%" 
                    height="200" 
                    style={{border:0}} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
            <p className="mt-4 text-sm text-gray-400">Pusat Kegiatan Olahraga (PKOR) Way Halim, Bandar Lampung</p>
          </div>
          
          <div className="lg:col-span-1">
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

          <div className="lg:col-span-1">
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

        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 gap-6">
          <div className='text-center sm:text-left'>
              <Link href="/">
                <Image src="https://firebasestudio.googleapis.com/v0/b/firebase-studio-users.appspot.com/o/user%2Fclxsn2j1b00001y9zaa6n2w09%2Fimages%2Fcoe93b0j-ciki-cinta.png?alt=media&token=c27e04f6-ef77-4b7b-8ff0-d13c19b027c6" alt="Unilife Logo" width={100} height={30} className="object-contain mb-2 mx-auto sm:mx-0" />
              </Link>
              <p>&copy; {new Date().getFullYear()} UNIYOUTH. All rights reserved.</p>
          </div>
          <VisitorCounter />
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
