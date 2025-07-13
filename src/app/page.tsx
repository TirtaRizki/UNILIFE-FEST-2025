import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Logo = () => (
    <h1 className="text-3xl font-headline font-bold text-white">UNILIFE</h1>
);


export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center mb-6">
          <Logo />
        </div>
        <Card className="glass-card text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-center">Login</CardTitle>
            <CardDescription className="text-center text-gray-300">Enter your email below to login</CardDescription>
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
                  className="bg-white/10 border-white/20 placeholder:text-gray-400"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="ml-auto inline-block text-sm underline" prefetch={false}>
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" required className="bg-white/10 border-white/20" />
              </div>
              <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white" asChild>
                  <Link href="/dashboard">Login</Link>
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="#" className="underline" prefetch={false}>
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
