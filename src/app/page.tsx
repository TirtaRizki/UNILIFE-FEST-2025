import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const Logo = () => (
    <h1 className="text-3xl font-headline font-bold text-primary">UNLIFE</h1>
);

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[rgb(var(--background-start-rgb))] to-[rgb(var(--background-end-rgb))] px-4">
      <Card className="w-full max-w-md rounded-2xl border-white/20 bg-white/95 p-4 shadow-2xl backdrop-blur-lg sm:p-8">
        <CardHeader className="pb-4">
            <div className="flex items-center justify-center mb-4">
                <Logo />
            </div>
          <CardTitle className="text-2xl font-bold text-center text-foreground">Welcome Back</CardTitle>
          <CardDescription className="text-center text-muted-foreground">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="bg-white"
              />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required className="bg-white" />
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Checkbox id="remember-me" />
                    <Label htmlFor="remember-me" className="text-sm font-normal">Remember me</Label>
                </div>
                <Link href="#" className="ml-auto inline-block text-sm text-primary hover:underline" prefetch={false}>
                  Forgot your password?
                </Link>
            </div>
            <Button type="submit" className="w-full text-base font-semibold mt-2" asChild>
                <Link href="/dashboard">Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
