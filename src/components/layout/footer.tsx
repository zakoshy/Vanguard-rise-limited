'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Linkedin, Facebook, Mail, Phone } from 'lucide-react';
import { Icons } from '@/components/icons';

const socialLinks = [
  { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/in/erick-musonye-3a450828a/' },
  { name: 'Twitter', icon: Icons.x, href: 'https://x.com/NyamariPat31017' },
  { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61582204540365' },
  { name: 'WhatsApp', icon: Icons.whatsapp, href: 'https://wa.me/254795472495' },
];

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/project-management', label: 'Project Management' },
  { href: '/investments', label: 'Investments' },
  { href: '/real-estate', label: 'Real Estate' },
  { href: '/philanthropy', label: 'Philanthropy' },
  { href: '/contact', label: 'Contact' },
];

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t bg-secondary/30">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center space-x-3">
              <Image 
                src="/logo.png" 
                alt="Vanguard Rise Limited Logo" 
                width={40} 
                height={40} 
                className="object-contain"
              />
              <span className="font-bold font-headline text-lg">Vanguard Rise Limited</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md italic">
              Building prosperity, touching lives
            </p>
            <p className="text-sm text-muted-foreground max-w-md pt-2">
              Professional real estate, project management, and investment consultancy.
            </p>
            <div className="flex space-x-4 pt-2">
              {socialLinks.map((social) => (
                <a key={social.name} href={social.href} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 col-span-1 md:col-span-2 gap-8">
              <div>
                <h4 className="font-semibold mb-4 font-headline text-foreground">Quick Links</h4>
                <ul className="space-y-2">
                  {quickLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4 font-headline text-foreground">Contact Us</h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0 mt-1" />
                    <a href="mailto:vanguardriselimited@gmail.com" className="hover:text-primary transition-colors">vanguardriselimited@gmail.com</a>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0 mt-1" />
                    <a href="tel:0795472495" className="hover:text-primary transition-colors">0795472495 / 0738589475 / 0757063001</a>
                  </li>
                </ul>
              </div>
          </div>
        </div>
      </div>
      <div className="border-t bg-secondary/50 py-4">
        <div className="container text-center text-xs text-muted-foreground flex flex-col md:flex-row justify-center items-center gap-4">
          <span>&copy; {year ?? 2025} Vanguard Rise Limited. All Rights Reserved.</span>
          <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}
