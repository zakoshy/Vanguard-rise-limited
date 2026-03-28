'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useUser } from '@/firebase';
import { AdminLayout } from '@/components/layout/admin-layout';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const isAdminSection = pathname.startsWith('/admin');

  if (isAdminSection) {
    if (isUserLoading) {
      return (
        <div className="flex justify-center items-center h-screen bg-background">
          <p className="text-muted-foreground animate-pulse">Verifying access...</p>
        </div>
      );
    }
    if (user) {
      return <AdminLayout>{children}</AdminLayout>;
    }
  }
  
  return (
    <div className={cn("relative flex min-h-screen flex-col bg-background", { 'h-screen overflow-hidden': isAdminSection && !user })}>
      {!isAdminSection && <Header />}
      <main className="flex-1">{children}</main>
      {!isAdminSection && <Footer />}
    </div>
  );
}
