
'use client';

import { useUser } from '@/firebase';
import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-16 md:py-24 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-16 md:py-24">
        <div className="max-w-md w-full">
          <LoginForm />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
        <Card>
            <CardHeader>
                <CardTitle>Welcome to the Admin Dashboard</CardTitle>
                <CardDescription>
                    Select a category from the sidebar to begin managing your website content.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>You can manage success stories, investment projects, real estate listings, and philanthropic activities from here.</p>
            </CardContent>
        </Card>
    </div>
  );
}
