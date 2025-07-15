import React from 'react';
import Image from 'next/image';
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import Link from 'next/link';

const PublicFooter = () => {
  return (
    <footer className="bg-black py-12">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <div className="flex justify-center mb-6">
           <Link href="/" className="text-3xl font-headline font-bold text-primary">
                UNILIFE
            </Link>
        </div>
        <div className="flex justify-center space-x-6 mb-8">
            <a href="#" className="hover:text-primary transition-colors"><FaInstagram size={24} /></a>
            <a href="#" className="hover:text-primary transition-colors"><FaTiktok size={24} /></a>
            <a href="#" className="hover:text-primary transition-colors"><FaYoutube size={24} /></a>
        </div>
        <p className="text-sm">&copy; {new Date().getFullYear()} UNIYOUTH. All rights reserved.</p>
        <div className="mt-4 text-xs">
            <Link href="/login" className="hover:text-primary transition-colors">
                Admin & Panitia Login
            </Link>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
