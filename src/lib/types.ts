export type Event = {
    id: string;
    name: string;
    date: string;
    location: string;
    status: "Upcoming" | "Completed" | "Cancelled";
};
