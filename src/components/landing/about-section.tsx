
"use server";

import React from 'react';
import Image from 'next/image';
import type { About } from '@/lib/types';
import { getAboutData } from '@/lib/data-services';
import { AboutSectionClient } from './about-section-client';


const AboutSection = async () => {
    const about = await getAboutData();
    
    if (!about) {
        return null;
    }

    return (
        <section id="about" className="py-20 md:py-32 bg-background/5 backdrop-blur-sm overflow-hidden animate-fade-up">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-bold font-headline mb-6 text-primary">{about.title}</h2>
                        <p className="text-muted-foreground text-lg mb-8 whitespace-pre-wrap">{about.description}</p>
                        <AboutSectionClient />
                    </div>
                    <div className="flex justify-center">
                         <Image
                            src="https://placehold.co/600x600.png"
                            alt="About Unilife Fest"
                            width={500}
                            height={500}
                            className="rounded-xl shadow-2xl shadow-primary/20 object-cover"
                            data-ai-hint="music festival crowd"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
