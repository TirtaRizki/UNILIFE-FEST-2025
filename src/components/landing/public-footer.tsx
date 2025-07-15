
import React from 'react';
import Image from 'next/image';
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import Link from 'next/link';

const PublicFooter = () => {
  return (
    <footer className="bg-black py-12">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <div className="flex justify-center mb-6">
           <Link href="/">
              <Image src="https://firebasestudio.googleapis.com/v0/b/firebase-studio-users.appspot.com/o/user%2Fclw1uss2s00001y6w36fhhq82%2Fimages%2Fcn291m59-unilife-logo.png?alt=media&token=487d60df-520c-4390-ac92-421714fc7504" alt="Unilife Logo" width={120} height={32} className="object-contain" />
            </Link>
        </div>
        <div className="flex justify-center space-x-6 mb-8">
            <a href="https://www.instagram.com/unilife.festival?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><FaInstagram size={24} /></a>
        </div>
        <p className="text-sm">&copy; {new Date().getFullYear()} UNIYOUTH. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default PublicFooter;
