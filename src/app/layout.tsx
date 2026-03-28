import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { AppLayout } from '@/components/layout/app-layout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Vanguard Rise Limited',
  description: 'Professional real estate, project management, and investment consultancy.',
  keywords: ['real estate', 'project management', 'investment', 'consultancy', 'philanthropy'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(inter.variable, montserrat.variable)}>
      <body className={cn('min-h-screen font-body antialiased')}>
        <FirebaseClientProvider>
            <AppLayout>{children}</AppLayout>
            <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
