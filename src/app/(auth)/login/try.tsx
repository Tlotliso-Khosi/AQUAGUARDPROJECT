"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push("/dashboard");
    setIsLoading(false);
  };

  return (
    <Card className="w-full shadow-none bg-transparent dark:bg-transparent border-none">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight text-white sm:text-black">
          Welcome back
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your email to sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white sm:text-black" htmlFor="email">Email</Label>
            <div className="relative">
              <Input 
                id="email"
                placeholder="name@example.com" 
                type="email" 
                autoCapitalize="none" 
                autoComplete="email" 
                autoCorrect="off"
                required
                className="pl-10"
              />
              <MailIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-white sm:text-black" htmlFor="password">Password</Label>
              <Link 
                href="/auth/forgot-password" 
                className="text-sm font-medium text-secondary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                className="pl-10"
              />
              <LockIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent bg-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="text-sm font-medium text-white sm:text-black leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Remember me
            </Label>
          </div>
          <Button className="w-full rounded-full" type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        
        <div className="mt-4 text-center text-sm text-white sm:text-black">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-secondary hover:underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
} 
