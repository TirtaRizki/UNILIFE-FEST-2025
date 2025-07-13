
export type Event = {
    id: string;
    name: string;
    date: string;
    location: string;
    status: "Upcoming" | "Completed" | "Cancelled";
    imageUrl?: string;
};

export type About = {
    id: string;
    title: string;
    description: string;
};

export type Banner = {
    id: string;
    title: string;
    status: "Active" | "Inactive";
};

export type Committee = {
    id: string;
    name: string;
    position: string;
};

export type Lineup = {
    id: string;
    artistName: string;
    day: string;
    time: string;
};

export type Recap = {
    id: string;
    title: string;
    status: "Published" | "Draft";
};

export type Ticket = {
    id: string;
    type: string;
    price: number;
    status: "Available" | "Sold Out";
};

export type User = {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: "Admin" | "Member" | "Panitia";
    password?: string;
};
