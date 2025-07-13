import PageHeader from "@/components/page-header";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function BannersPage() {
    return (
        <>
            <PageHeader title="Kelola Banner" />
            <Card>
                <CardHeader>
                    <CardTitle>Banner Management</CardTitle>
                    <CardDescription>
                        Manage display advertisements: upload new banner ads, set display duration, targeting, etc.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Content for managing banners will be displayed here.</p>
                </CardContent>
            </Card>
        </>
    );
}
