/**
 * @fileoverview This script is used to seed the Firestore database with initial data.
 * It's meant to be run manually from the command line, NOT as part of the application runtime.
 * 
 * To run this script:
 * 1. Ensure your .env.local file is correctly set up with FIREBASE_CREDENTIALS.
 * 2. Run `npm run db:seed` in your terminal.
 */
import { adminDb } from './firebase-admin';
import type { User, About, Event, Lineup, Recap, Ticket } from './types';

// --- Default Users ---
const defaultUsers: Omit<User, 'id'>[] = [
    { email: 'admin@unilifefest.com', password: 'unilifejaya123', role: 'Admin', name: 'Super Admin', phoneNumber: '08001234567' },
    { email: 'panitia2025@unilife.com', password: 'lampungfest123', role: 'Panitia', name: 'Panitia 2025', phoneNumber: '08119876543' }
];

// --- Dummy About ---
const dummyAbout: Omit<About, 'id'>[] = [
    {
        title: "UNILIFE LAMPUNG FEST 2025",
        description: "UNILIFE (UNIYOUTH LIFE FESTIVAL) adalah festival 'Back To School' terbesar di Lampung yang diselenggarakan oleh UNIYOUTH. Acara ini merupakan perpaduan antara musik, seni, dan kreativitas anak muda, menciptakan momen tak terlupakan sebelum kembali ke rutinitas sekolah.\n\nNikmati penampilan dari musisi-musisi ternama, jelajahi instalasi seni yang mengagumkan, dan ikut serta dalam berbagai workshop kreatif. UNILIFE adalah wadah bagi generasi muda untuk berekspresi, berkolaborasi, dan merayakan semangat masa muda. Bergabunglah dengan kami dalam perayaan akbar ini!"
    }
];

// --- Dummy Events ---
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

// --- Dummy Lineups ---
const dummyLineups: Omit<Lineup, 'id'>[] = [
    { artistName: "Denny Caknan", day: "Jumat", date: "2025-08-30" },
    { artistName: "Guyon Waton", day: "Jumat", date: "2025-08-30" },
    { artistName: "Feel Koplo", day: "Jumat", date: "2025-08-30" },
    { artistName: "Happy Asmara", day: "Sabtu", date: "2025-08-31" },
    { artistName: "JKT48", day: "Sabtu", date: "2025-08-31" },
    { artistName: "Tipe-X", day: "Sabtu", date: "2025-08-31" },
    { artistName: "Nadin Amizah", day: "Sabtu", date: "2025-08-31" },
    { artistName: "For Revenge", day: "Sabtu", date: "2025-08-31" },
];

// --- Dummy Recaps ---
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
    {
        title: "Antusiasme Penonton",
        description: "Energi luar biasa dari para Unifriends yang hadir!",
        status: "Published",
        imageUrl: "https://placehold.co/500x500.png"
    },
     {
        title: "Behind The Scenes",
        description: "Momen di balik panggung dan persiapan para panitia.",
        status: "Draft",
        imageUrl: "https://placehold.co/500x500.png"
    }
];

// --- Dummy Tickets ---
const dummyTickets: Omit<Ticket, 'id'>[] = [
    { type: "Early Bird - Day 1", price: 75000, status: "Sold Out" },
    { type: "Presale 1 - Day 1", price: 100000, status: "Available" },
    { type: "Early Bird - Day 2", price: 75000, status: "Sold Out" },
    { type: "Presale 1 - Day 2", price: 100000, status: "Available" },
    { type: "Presale 1 - 2 Days Pass", price: 180000, status: "Available" },
    { type: "VIP Access", price: 500000, status: "Available" },
];

async function seedCollection<T extends { [key: string]: any }>(collectionName: string, data: T[], uniqueField: keyof T) {
    console.log(`\n- Seeding collection: ${collectionName}`);
    const collectionRef = adminDb().collection(collectionName);
    let addedCount = 0;

    for (const item of data) {
        const q = collectionRef.where(uniqueField as string, '==', item[uniqueField]);
        const existingSnapshot = await q.get();

        if (existingSnapshot.empty) {
            await collectionRef.add(item);
            addedCount++;
        }
    }
    console.log(`  Added ${addedCount} new documents.`);
    console.log(`  Collection '${collectionName}' now contains ${ (await collectionRef.get()).size } documents.`);
}

async function seedDatabase() {
    console.log('🌱 Starting database seeding...');
    
    await seedCollection<Omit<User, 'id'>>('users', defaultUsers, 'email');
    await seedCollection<Omit<About, 'id'>>('abouts', dummyAbout, 'title');
    await seedCollection<Omit<Event, 'id'>>('events', dummyEvents, 'name');
    await seedCollection<Omit<Lineup, 'id'>>('lineups', dummyLineups, 'artistName');
    await seedCollection<Omit<Recap, 'id'>>('recaps', dummyRecaps, 'title');
    await seedCollection<Omit<Ticket, 'id'>>('tickets', dummyTickets, 'type');

    console.log('\n🌲 Database seeding complete!');
    process.exit(0);
}

seedDatabase().catch((error) => {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
});
