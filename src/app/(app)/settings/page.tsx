import PageHeader from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
    return (
        <>
            <PageHeader title="Settings" />
            <div className="grid gap-6">
                <Card className="content-card">
                    <CardHeader>
                        <CardTitle>General</CardTitle>
                        <CardDescription>Manage general application settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="appName">Application Name</Label>
                            <Input id="appName" defaultValue="UNLIFE Dashboard" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="appUrl">Application URL</Label>
                            <Input id="appUrl" defaultValue="https://unlife.com" />
                        </div>
                         <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="maintenance-mode" className="text-base">Maintenance Mode</Label>
                                <p className="text-sm text-muted-foreground">
                                    Temporarily disable access to the public site.
                                </p>
                            </div>
                            <Switch id="maintenance-mode" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="content-card">
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>Manage how you receive notifications.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive an email for important updates.
                                </p>
                            </div>
                            <Switch id="email-notifications" defaultChecked />
                        </div>
                         <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive push notifications on your devices.
                                </p>
                            </div>
                            <Switch id="push-notifications" />
                        </div>
                    </CardContent>
                </Card>

                 <div className="flex justify-end">
                    <Button>Save All Settings</Button>
                </div>
            </div>
        </>
    );
}
