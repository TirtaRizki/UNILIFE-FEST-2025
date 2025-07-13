import type { Event, About, Banner, Committee, Lineup, Recap, Ticket, User } from "./types";

export const mockEvents: Event[] = [
    { id: "EVT001", name: "Summer Music Festival", date: "2024-08-15", location: "Grand Park, New York", status: "Upcoming" },
    { id: "EVT002", name: "Tech Conference 2024", date: "2024-07-20", location: "Convention Center, SF", status: "Upcoming" },
    { id: "EVT003", name: "Art & Design Expo", date: "2024-06-10", location: "The Modern Gallery", status: "Completed" },
    { id: "EVT004", name: "Indie Film Screening", date: "2024-05-25", location: "Cinema Paradiso", status: "Completed" },
    { id: "EVT005", name: "Charity Gala Dinner", date: "2024-09-05", location: "The Grand Ballroom", status: "Upcoming" },
    { id: "EVT006", name: "Local Marathon 2024", date: "2024-04-30", location: "City Streets", status: "Cancelled" },
    { id: "EVT007", name: "Winter Coding Bootcamp", date: "2024-12-01", location: "Online", status: "Upcoming" },
];

export const mockAbouts: About[] = [
    { id: "ABT001", title: "Our Mission", description: "To create unforgettable live music experiences." }
];

export const mockBanners: Banner[] = [
    { id: "BNR001", title: "Early Bird Tickets", status: "Active" },
    { id: "BNR002", title: "Headliner Announcement", status: "Inactive" },
];

export const mockCommittees: Committee[] = [
    { id: "CMT001", name: "John Doe", position: "Event Coordinator" },
    { id: "CMT002", name: "Jane Smith", position: "Marketing Head" },
];

export const mockLineups: Lineup[] = [
    { id: "LNP001", artistName: "The Rockers", day: "Friday", time: "20:00" },
    { id: "LNP002", artistName: "DJ Beats", day: "Saturday", time: "22:00" },
];

export const mockRecaps: Recap[] = [
    { id: "RCP001", title: "Last Year's Highlights", status: "Published" },
    { id: "RCP002", title: "2024 Event Plan", status: "Draft" },
];

export const mockTickets: Ticket[] = [
    { id: "TKT001", type: "General Admission", price: 50, status: "Available" },
    { id: "TKT002", type: "VIP", price: 150, status: "Sold Out" },
];

export const mockUsers: User[] = [
    { id: "USR001", name: "Admin User", email: "admin@example.com", role: "Admin" },
    { id: "USR002", name: "Member User", email: "member@example.com", role: "Member" },
];
