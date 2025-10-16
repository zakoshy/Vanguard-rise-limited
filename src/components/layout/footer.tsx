import Link from 'next/link';
import { Linkedin, Twitter, Facebook, Mail, Phone } from 'lucide-react';
import { Icons } from '@/components/icons';

const socialLinks = [
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Facebook', icon: Facebook, href: '#' },
];

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/project-management', label: 'Project Management' },
  { href: '/investments', label: 'Investments' },
  { href: '/real-estate', label: 'Real Estate' },
  { href: '/philanthropy', label: 'Philanthropy' },
  { href: '/contact', label: 'Contact' },
];

export function Footer() {
  return (
    <footer className="border-t bg-secondary/30">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-1 sm:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <Icons.logo className="h-6 w-6 text-primary" />
              <span className="font-bold font-headline text-lg">Zenith Horizon</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Professional real estate, project management, and investment consultancy.
            </p>
            <div className="flex space-x-4 pt-2">
              {socialLinks.map((social) => (
                <a key={social.name} href={social.href} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="sm:col-start-1 md:col-start-2">
            <h4 className="font-semibold mb-4 font-headline">Quick Links</h4>
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
            <h4 className="font-semibold mb-4 font-headline">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <a href="mailto:info@zenithhorizon.com" className="hover:text-primary transition-colors">info@zenithhorizon.com</a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <a href="tel:+1234567890" className="hover:text-primary transition-colors">+1 (234) 567-890</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t bg-secondary/50 py-4">
        <div className="container text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Zenith Horizon. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
