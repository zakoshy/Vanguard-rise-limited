'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoginForm } from '@/components/auth/login-form';

export default function AdminLoginPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/admin');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <p className="text-muted-foreground animate-pulse font-headline">Verifying session...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-secondary/10 px-4">
      <LoginForm />
    </div>
  );
}
