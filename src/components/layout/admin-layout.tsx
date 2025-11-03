
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';
import { Briefcase, Building, Heart, Home as HomeIcon, LayoutDashboard, LogOut, CreditCard } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

const adminNavLinks = [
  { href: '/admin/success-stories', label: 'Success Stories', icon: <Briefcase className="h-5 w-5" /> },
  { href: '/admin/investments', label: 'Investments', icon: <Building className="h-5 w-5" /> },
  { href: '/admin/real-estate', label: 'Real Estate', icon: <HomeIcon className="h-5 w-5" /> },
  { href: '/admin/philanthropy', label: 'Philanthropy', icon: <Heart className="h-5 w-5" /> },
  { href: '/admin/payments', label: 'Payments', icon: <CreditCard className="h-5 w-5" /> },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = getAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error)      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-secondary/30">
      <aside className="w-64 bg-background border-r flex flex-col p-4">
        <div className="font-headline font-bold text-xl mb-8 p-2">Admin Panel</div>
        <nav className="flex flex-col space-y-2 flex-grow">
          <Link href="/admin">
            <Button
              variant={pathname === '/admin' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
          </Link>
          {adminNavLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant={pathname.startsWith(link.href) ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                {link.icon && <span className="mr-2">{link.icon}</span>}
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>
        <div>
          <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start text-muted-foreground hover:text-destructive">
            <LogOut className="mr-2 h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
