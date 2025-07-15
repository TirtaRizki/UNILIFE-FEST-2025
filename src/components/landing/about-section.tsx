"use server";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { About } from '@/lib/types';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const fetchAbout = async (): Promise<About | null> => {
    try {
        const aboutsCollection = collection(db, 'abouts');
        // We only ever need one "About" document
        const q = query(aboutsCollection, limit(1));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log("No about document found.");
            return null;
        }
        
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as About;

    } catch (error) {
        console.error("Could not fetch about content:", error);
        // In case of error, return null to not render the section
        return null;
    }
};


const AboutSection = async () => {
    const about = await fetchAbout();
    
    if (!about) {
        return null; // Don't render the section if there's no content or an error occurs
    }

    return (
        <section id="about" className="py-20 md:py-32 bg-background/5 backdrop-blur-sm overflow-hidden animate-fade-up">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-bold font-headline mb-6 text-primary">{about.title}</h2>
                        <p className="text-muted-foreground text-lg mb-8 whitespace-pre-wrap">{about.description}</p>
                        <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                            <a href="#dashboard-info">
                                Get Your Ticket
                            </a>
                        </Button>
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
