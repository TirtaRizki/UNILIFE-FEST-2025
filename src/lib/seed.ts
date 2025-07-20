// Use dotenv to load environment variables from .env.local
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { adminDb } from './firebase-admin';
import type { About, Banner, Event, Lineup, Recap, Ticket, User } from './types';

// --- Default Users ---
const defaultUsers: Omit<User, 'id'>[] = [
    { email: 'admin@unilifefest.com', password: 'unilifejaya123', role: 'Admin', name: 'Super Admin', phoneNumber: '08001234567' },
    { email: 'panitia2025@unilife.com', password: 'lampungfest123', role: 'Panitia', name: 'Panitia 2025', phoneNumber: '08119876543' }
];

// --- Dummy Data ---
const dummyAboutData: Omit<About, 'id'> = {
    title: "UNILIFE LAMPUNG FEST 2025",
    description: "UNILIFE (UNIYOUTH LIFE FESTIVAL) adalah festival 'Back To School' terbesar di Lampung yang diselenggarakan oleh UNIYOUTH. Acara ini merupakan perpaduan antara musik, seni, dan kreativitas anak muda, menciptakan momen tak terlupakan sebelum kembali ke rutinitas sekolah.\n\nNikmati penampilan dari musisi-musisi ternama, jelajahi instalasi seni yang mengagumkan, dan ikut serta dalam berbagai workshop kreatif. UNILIFE adalah wadah bagi generasi muda untuk berekspresi, berkolaborasi, dan merayakan semangat masa muda. Bergabunglah dengan kami dalam perayaan akbar ini!"
};

const dummyEvents: Omit<Event, 'id'>[] = [
    {
        name: "UNILIFE Main Concert Day 1",
        description: "Hari pertama festival dengan penampilan spektakuler dari deretan artis nasional. Rasakan euforia musik dan semangat kebersamaan di panggung utama UNILIFE.",
        date: "2025-08-30",
        location: "PKOR Way Halim, Bandar Lampung",
        status: "Upcoming",
        imageUrl: "https://placehold.co/400x300.png"
    },
    {
        name: "UNILIFE Main Concert Day 2",
        description: "Puncak acara UNILIFE! Jangan lewatkan penampilan pamungkas dari guest star utama dan nikmati malam penutupan yang meriah dengan pesta kembang api.",
        date: "2025-08-31",
        location: "PKOR Way Halim, Bandar Lampung",
        status: "Upcoming",
        imageUrl: "https://placehold.co/400x300.png"
    }
];

const dummyLineups: Omit<Lineup, 'id'>[] = [
    { artistName: "PARADE HUJAN", day: "Jumat", date: "2025-08-30" },
    { artistName: "PAMUNGKAS", day: "Jumat", date: "2025-08-30" },
    { artistName: "BANDA NEIRA", day: "Jumat", date: "2025-08-30" },
    { artistName: "HAPPY ASMARA", day: "Sabtu", date: "2025-08-31" },
    { artistName: "JKT48", day: "Sabtu", date: "2025-08-31" },
    { artistName: "TIPE-X", day: "Sabtu", date: "2025-08-31" },
];

const dummyRecaps: Omit<Recap, 'id'>[] = [
    {
        title: "Aftermovie UNILIFE 2024",
        description: "Lihat kembali keseruan dan momen tak terlupakan dari UNILIFE tahun lalu!",
        status: "Published",
        imageUrl: "https://placehold.co/500x500.png"
    },
    {
        title: "Keseruan Bazaar & Workshop",
        description: "Intip berbagai kegiatan kreatif di area bazaar dan workshop.",
        status: "Published",
        imageUrl: "https://placehold.co/500x500.png"
    },
];

const dummyTickets: Omit<Ticket, 'id'>[] = [
    { type: "MOS DAY 1", price: 149000, status: "Available" },
    { type: "GRADUATION DAY 2", price: 149000, status: "Available" },
    { type: "2 DAY PASS", price: 199000, status: "Available" },
];


async function seedCollection<T extends { [key: string]: any }>(collectionName: string, data: T[], uniqueField?: keyof T) {
    console.log(`\n- Seeding collection: ${collectionName}`);
    const collectionRef = adminDb().collection(collectionName);
    const existingSnapshot = await collectionRef.limit(1).get();

    if (!existingSnapshot.empty) {
        console.log(`  Collection '${collectionName}' already has data. Skipping.`);
        return;
    }

    let addedCount = 0;
    for (const item of data) {
        await collectionRef.add(item);
        addedCount++;
    }
    
    console.log(`  Added ${addedCount} new documents.`);
}

async function seedDatabase() {
    console.log('🌱 Starting database seeding...');
    try {
        await seedCollection('users', defaultUsers, 'email');
        await seedCollection('abouts', [dummyAboutData]);
        await seedCollection('events', dummyEvents);
        await seedCollection('lineups', dummyLineups);
        await seedCollection('recaps', dummyRecaps);
        await seedCollection('tickets', dummyTickets);
        
        console.log('\n🌲 Database seeding complete!');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase().then(() => {
    process.exit(0);
}).catch((error) => {
    console.error(error);
    process.exit(1);
});
