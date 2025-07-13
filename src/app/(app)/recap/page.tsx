import PageHeader from "@/components/page-header";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function RecapPage() {
    return (
        <>
            <PageHeader title="Kelola Recap" />
            <Card>
                <CardHeader>
                    <CardTitle>Recap Management</CardTitle>
                    <CardDescription>
                         Manage event summaries/reviews with media: create, edit, delete, publish/unpublish event recap content.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Content for managing recaps will be displayed here.</p>
                </CardContent>
            </Card>
        </>
    );
}
