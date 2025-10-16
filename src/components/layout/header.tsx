'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const serviceLinks = [
  { href: '/project-management', label: 'Project Management' },
  { href: '/investments', label: 'Investments' },
  { href: '/real-estate', label: 'Real Estate' },
  { href: '/philanthropy', label: 'Philanthropy' },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderNavLinks = (isMobile = false) => (
    <>
      <Link
        href="/"
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
        className={cn(
          'text-sm font-medium transition-colors hover:text-primary',
          pathname === '/' ? 'text-primary font-bold' : 'text-muted-foreground',
          isMobile && 'block py-2 text-lg'
        )}
      >
        Home
      </Link>
      
      {isMobile ? (
        <div className="flex flex-col space-y-2">
          <span className="text-lg font-medium text-muted-foreground">Services</span>
          {serviceLinks.map(link => (
             <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                'text-sm transition-colors hover:text-primary pl-4',
                 pathname.startsWith(link.href) ? 'text-primary font-bold' : 'text-muted-foreground',
                 'block py-2 text-lg'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={cn(
              "flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary px-0",
              serviceLinks.some(l => pathname.startsWith(l.href)) && "text-primary font-bold"
            )}>
              Services
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {serviceLinks.map((link) => (
              <DropdownMenuItem key={link.href} asChild>
                <Link href={link.href} className={cn(pathname.startsWith(link.href) && "font-bold")}>{link.label}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <Link
        href="/contact"
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
        className={cn(
          'text-sm font-medium transition-colors hover:text-primary',
          pathname === '/contact' ? 'text-primary font-bold' : 'text-muted-foreground',
          isMobile && 'block py-2 text-lg'
        )}
      >
        Contact
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex md:mr-8">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="hidden font-bold font-headline text-lg sm:inline-block">Vanguard Rise Limited</span>
          </Link>
        </div>
        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
          {renderNavLinks()}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-4">
          <Button asChild className="hidden md:inline-flex rounded-full">
            <Link href="/contact">Get in Touch</Link>
          </Button>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 w-full max-w-sm">
              <Link
                href="/"
                className="flex items-center mb-8"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icons.logo className="h-6 w-6 mr-2 text-primary" />
                <span className="font-bold font-headline text-lg">Vanguard Rise Limited</span>
              </Link>
              <div className="flex flex-col space-y-4">
                {renderNavLinks(true)}
              </div>
               <Button asChild className="mt-8 rounded-full" size="lg">
                  <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Get in Touch</Link>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
