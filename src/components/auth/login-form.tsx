
'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react";
import Image from 'next/image';
import Link from 'next/link';

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Loader2, Eye, EyeOff } from "lucide-react";


const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
      message: "Password must be at least 6 characters."
  })
})

export function LoginForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
    } catch (error: any) {
      let errorMessage = "An unknown error occurred.";
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/invalid-credential':
          case 'auth/wrong-password':
            errorMessage = 'Invalid email or password.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
          default:
            errorMessage = 'Failed to log in. Please try again.';
            break;
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full animate-in fade-in zoom-in duration-300">
      <div className="mb-8">
        <Image 
          src="/logo.png" 
          alt="Vanguard Rise Limited Logo" 
          width={120} 
          height={120} 
          className="object-contain drop-shadow-lg"
          priority
        />
      </div>
      <Card className="shadow-2xl w-full border-t-4 border-t-primary bg-card">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="font-headline text-3xl text-center text-primary">Admin Access</CardTitle>
            <CardDescription className="text-center text-muted-foreground">Secure gateway to Vanguard Rise management portal.</CardDescription>
          </CardHeader>
          <CardContent>
              <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel className="text-foreground font-semibold">Corporate Email</FormLabel>
                          <FormControl>
                          <Input placeholder="admin@vanguardrise.com" {...field} className="h-12 border-muted-foreground/40" />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
                   <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel className="text-foreground font-semibold">Security Credential</FormLabel>
                          <div className="relative">
                              <FormControl>
                                  <Input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="••••••••" 
                                    {...field} 
                                    className="h-12 border-muted-foreground/40 pr-12" 
                                  />
                              </FormControl>
                              <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-primary transition-colors"
                              >
                                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                          </div>
                          <FormMessage />
                      </FormItem>
                      )}
                  />

                  {error && (
                    <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-sm font-medium text-destructive text-center">
                        {error}
                    </div>
                  )}

                  <Button type="submit" size="lg" className="w-full h-12 text-base font-bold shadow-md hover:shadow-lg transition-all" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                      {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
                  </Button>
              </form>
              </Form>
          </CardContent>
      </Card>
      <div className="mt-8">
        <Button variant="link" asChild className="text-muted-foreground">
          <Link href="/">← Return to Public Website</Link>
        </Button>
      </div>
    </div>
  )
}
