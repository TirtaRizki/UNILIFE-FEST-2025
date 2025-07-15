
import React from 'react';
import Image from 'next/image';
import { FaInstagram } from 'react-icons/fa';
import Link from 'next/link';

const PublicFooter = () => {
  return (
    <footer className="bg-gradient-to-r from-green-200 via-cyan-200 to-blue-300 py-12">
      <div className="container mx-auto px-4 text-center text-gray-700">
        <div className="flex justify-center mb-6">
           <Link href="/">
              <Image src="https://firebasestudio.googleapis.com/v0/b/firebase-studio-users.appspot.com/o/user%2Fclxsn2j1b00001y9zaa6n2w09%2Fimages%2Fcokrwxkj-logo-unilife.png?alt=media&token=e93a7b53-094d-4458-971c-4231b1406e22" alt="Unilife Logo" width={120} height={32} className="object-contain" />
            </Link>
        </div>
        <div className="flex justify-center space-x-6 mb-8">
            <a href="https://www.instagram.com/unilife.festival?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors"><FaInstagram size={24} /></a>
        </div>
        <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} UNIYOUTH. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default PublicFooter;
