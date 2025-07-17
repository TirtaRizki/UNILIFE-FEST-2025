
"use server";

import React from 'react';
import VisitorCounter from './visitor-counter';
import { getBrandingSettings } from '@/lib/data-services';
import PublicFooterClient from './public-footer-client';


const PublicFooter = async () => {
    const branding = await getBrandingSettings();
    // Pass the logoUrl to the client component. Use a default if it's null.
    const logoUrl = branding?.logoUrl || '/images/unilife_logo.png';

    return (
        <footer className="bg-slate-900 text-gray-300 font-sans">
            <div className="container mx-auto px-4 pt-16">
                <div className="flex flex-col items-center text-center">
                    <PublicFooterClient logoUrl={logoUrl} />
                </div>
                <div className="w-full flex flex-col md:flex-row gap-8 items-center border-t border-white/10 pt-8 mt-4 pb-16">
                    <div className="w-full md:w-1/2 h-64 rounded-lg overflow-hidden border-2 border-primary/20 shadow-lg">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.235154110599!2d105.27548907602906!3d-5.381077353813967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40db52585e7689%3A0x7e96c3d76b2c7aae!2sPusat%20Kegiatan%20Olahraga%20(PKOR)!5e0!3m2!1sid!2sid!4v1752602016714!5m2!1sid!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                    <div className="w-full md:w-1/2 flex justify-center">
                        <VisitorCounter />
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
