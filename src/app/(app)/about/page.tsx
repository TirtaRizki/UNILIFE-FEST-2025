import PageHeader from "@/components/page-header";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AboutPage() {
    return (
        <>
            <PageHeader title="Kelola About" />
            <Card>
                <CardHeader>
                    <CardTitle>About Section Management</CardTitle>
                    <CardDescription>
                        Manage and update information related to the 'About Us' section of the platform.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Content for managing the About section will be displayed here.</p>
                </CardContent>
            </Card>
        </>
    );
}
