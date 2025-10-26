
'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import './globals.css';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { AdminLayout } from '@/components/layout/admin-layout';

function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const isAdminSection = pathname.startsWith('/admin');

  if (isAdminSection) {
    if (isUserLoading) {
      return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;
    }
    if (user) {
      return <AdminLayout>{children}</AdminLayout>;
    }
  }
  
  return (
    <div className={cn("relative flex min-h-screen flex-col bg-background", { 'h-screen': isAdminSection && !user})}>
      {!isAdminSection && <Header />}
      <main className="flex-1">{children}</main>
      {!isAdminSection && <Footer />}
    </div>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const metadata = {
    title: 'Vanguard Rise Limited',
    description: 'Professional real estate, project management, and investment consultancy.',
    keywords: ['real estate', 'project management', 'investment', 'consultancy', 'philanthropy'],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(', ')} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('min-h-screen font-body antialiased')}>
        <FirebaseClientProvider>
            <AppLayout>{children}</AppLayout>
            <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
