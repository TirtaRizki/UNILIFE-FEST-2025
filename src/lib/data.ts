
import type { Event, About, Banner, Committee, Lineup, Recap, Ticket, User } from "./types";

// This file acts as a persistent in-memory database simulation.

// Initialize global variables if they don't exist
if (!global.users) {
    global.users = [
        { id: 'USR001', name: 'Admin User', email: 'admin@unilifefest.com', role: 'Admin', password: 'unilifejaya123', phoneNumber: '081234567890' },
        { id: 'USR002', name: 'Panitia Event', email: 'panitia2025@unilife.com', role: 'Panitia', password: 'lampungfest123', phoneNumber: '080987654321' }
    ];
}
if (!global.events) global.events = [];
if (!global.abouts) global.abouts = [];
if (!global.banners) global.banners = [];
if (!global.committees) global.committees = [];
if (!global.lineups) global.lineups = [];
if (!global.recaps) global.recaps = [];
if (!global.tickets) global.tickets = [];

export const db = {
    users: global.users as User[],
    events: global.events as Event[],
    abouts: global.abouts as About[],
    banners: global.banners as Banner[],
    committees: global.committees as Omit<Committee, 'user'>[],
    lineups: global.lineups as Lineup[],
    recaps: global.recaps as Recap[],
    tickets: global.tickets as Ticket[],
};
