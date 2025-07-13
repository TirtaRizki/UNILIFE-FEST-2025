import PageHeader from "@/components/page-header";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function UsersPage() {
    return (
        <>
            <PageHeader title="Kelola User" />
            <Card>
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                        Basic level user role management.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Content for managing users will be displayed here.</p>
                </CardContent>
            </Card>
        </>
    );
}
