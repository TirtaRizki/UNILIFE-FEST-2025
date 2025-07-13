import PageHeader from "@/components/page-header";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CommitteePage() {
    return (
        <>
            <PageHeader title="Kelola Panitia" />
            <Card>
                <CardHeader>
                    <CardTitle>Committee Management</CardTitle>
                    <CardDescription>
                        Manage a list of organizing committee members: Add, edit, delete committee profiles.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Content for managing the committee will be displayed here.</p>
                </CardContent>
            </Card>
        </>
    );
}
