import PageHeader from "@/components/page-header";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function LineupPage() {
    return (
        <>
            <PageHeader title="Kelola Line Up" />
            <Card>
                <CardHeader>
                    <CardTitle>Lineup Management</CardTitle>
                    <CardDescription>
                        Handle listing artists and performers: add, edit, or remove lineup details with photos, bios, etc.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Content for managing the lineup will be displayed here.</p>
                </CardContent>
            </Card>
        </>
    );
}
