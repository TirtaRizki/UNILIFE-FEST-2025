import { RegisterForm } from "./register-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Logo = () => (
    <h1 className="text-3xl font-headline font-bold text-primary">UNILIFE</h1>
);

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[rgb(var(--background-start-rgb))] to-[rgb(var(--background-end-rgb))] px-4">
      <Card className="w-full max-w-md rounded-2xl border-white/20 bg-white/95 p-4 shadow-2xl backdrop-blur-lg sm:p-8">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-foreground">Create an Account</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Enter your details below to create your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}