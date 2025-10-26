
'use client';

import { useUser } from '@/firebase';
import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAuth, signOut } from 'firebase/auth';
import Link from 'next/link';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const auth = getAuth();

  if (isUserLoading) {
    return (
      <div className="container py-16 md:py-24 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-16 md:py-24">
        <div className="max-w-md mx-auto">
          <LoginForm />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16 md:py-24">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Admin Panel</CardTitle>
            <Button variant="outline" onClick={() => signOut(auth)}>Sign Out</Button>
          </div>
          <CardDescription>Welcome, {user.email}. Manage your site content from here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
              <Card>
                  <CardHeader>
                      <CardTitle>Content Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <ul className="space-y-2">
                          <li>
                            <Button asChild variant="link" className="p-0">
                                <Link href="/admin/success-stories">Manage Project Management Success Stories</Link>
                            </Button>
                          </li>
                      </ul>
                  </CardContent>
              </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
