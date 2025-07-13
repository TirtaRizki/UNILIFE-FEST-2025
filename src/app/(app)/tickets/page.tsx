import PageHeader from "@/components/page-header";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function TicketsPage() {
    return (
        <>
            <PageHeader title="Kelola Tiket" />
            <Card className="glass-card text-white">
                <CardHeader>
                    <CardTitle>Ticket Management</CardTitle>
                    <CardDescription className="text-gray-300">
                        Manage all event tickets: view sales, check-in status, and issue new tickets.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Content for managing tickets will be displayed here.</p>
                </CardContent>
            </Card>
        </>
    );
}
