
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import { MapPin, Phone, Mail } from 'lucide-react';
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
    <footer className="bg-[#1C1C1C] text-gray-300 font-sans">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          
          {/* Column 1: Identity and Contact */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
                <Image src="https://firebasestudio.googleapis.com/v0/b/firebase-studio-users.appspot.com/o/user%2Fclxsn2j1b00001y9zaa6n2w09%2Fimages%2Fcoe93b0j-ciki-cinta.png?alt=media&token=c27e04f6-ef77-4b7b-8ff0-d13c19b027c6" alt="Unilife Logo" width={150} height={40} className="object-contain" />
            </Link>
            <p className="text-sm">UNILIFE LAMPUNG FEST 2025: Back To School. Acara paling ditunggu di Lampung, menggabungkan musik, seni, dan kreativitas.</p>
            <div className="space-y-3 pt-2 text-sm">
                <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Pusat Kegiatan Olahraga (PKOR) Way Halim, Kota Bandar Lampung, Lampung</span>
                </div>
                 <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>+62 123 4567 890</span>
                </div>
                 <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>kontak@unilifefest.com</span>
                </div>
            </div>
          </div>

          {/* Column 2: Navigation and Socials */}
          <div className="space-y-8">
            <div>
              <h4 className="font-bold text-white text-lg mb-4">Navigasi</h4>
              <ul className="space-y-2 text-sm">
              {navLinks.map((link) => (
                  <li key={link.href}>
                  <Link href={link.href} onClick={(e) => handleLinkClick(e, link.href)} className="hover:text-primary transition-colors">
                      {link.name}
                  </Link>
                  </li>
              ))}
              </ul>
            </div>
            <div>
                <h4 className="font-bold text-white text-lg mb-4">Ikuti Kami</h4>
                <div className="flex space-x-4">
                <a href="https://www.instagram.com/unilife.festival?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-transform duration-300 hover:scale-110">
                    <FaInstagram size={24} />
                </a>
                <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-transform duration-300 hover:scale-110">
                    <FaTiktok size={24} />
                </a>
                </div>
            </div>
          </div>

          {/* Column 3: Map and Stats */}
          <div className="space-y-8">
             <div>
                <h4 className="font-bold text-white text-lg mb-4">Lokasi</h4>
                <div className="w-full h-48 rounded-lg overflow-hidden border-2 border-primary/20 shadow-lg">
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
            </div>
            <div>
              <h4 className="font-bold text-white text-lg mb-4">Statistik Pengunjung</h4>
              <VisitorCounter />
            </div>
          </div>

        </div>
      </div>
      <div className="bg-black/50 py-4">
          <div className="container mx-auto px-4">
            <p className='text-center text-sm text-gray-400'>&copy; {new Date().getFullYear()} UNIYOUTH. All rights reserved.</p>
          </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
