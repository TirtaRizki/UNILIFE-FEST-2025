
import fs from 'fs';
import path from 'path';
import type { Event, About, Banner, Committee, Lineup, Recap, Ticket, User } from "./types";

// Path to the JSON file that will act as the database
const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

// Define the structure of our database
type DbData = {
    users: User[];
    events: Event[];
    abouts: About[];
    banners: Banner[];
    committees: Omit<Committee, 'user'>[];
    lineups: Lineup[];
    recaps: Recap[];
    tickets: Ticket[];
};

// Initial default data
const defaultData: DbData = {
    users: [
        { id: 'USR001', name: 'Admin User', email: 'admin@unilifefest.com', role: 'Admin', password: 'unilifejaya123', phoneNumber: '081234567890' },
        { id: 'USR002', name: 'Panitia Event', email: 'panitia2025@unilife.com', role: 'Panitia', password: 'lampungfest123', phoneNumber: '080987654321' }
    ],
    events: [],
    abouts: [],
    banners: [],
    committees: [],
    lineups: [],
    recaps: [],
    tickets: [],
};

// Function to read the database from the file
function readDb(): DbData {
    try {
        if (!fs.existsSync(dbPath)) {
            // If the file doesn't exist, create it with default data
            fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2), 'utf8');
            return defaultData;
        }
        const fileContent = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Error reading from db.json, returning default data:", error);
        return defaultData;
    }
}

// Function to write to the database file
function writeDb(data: DbData): void {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error("Error writing to db.json:", error);
    }
}

// The main db object that interacts with the JSON file
export const db = {
    read: readDb,
    write: writeDb,
};

// Initialize the database file on first load if it doesn't exist
readDb();
