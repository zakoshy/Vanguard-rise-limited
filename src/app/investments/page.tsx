
'use client';

import Image from 'next/image';
import { ArrowUpRight, TrendingUp, DollarSign, Building2 } from 'lucide-react';
import { collection } from 'firebase/firestore';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InvestmentChart } from '@/components/investment-chart';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { InvestmentProject } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const investmentServices = [
    { icon: <TrendingUp className="h-8 w-8 text-primary" />, title: 'Market Analysis', description: 'Deep-dive analytics to identify high-growth investment opportunities.' },
    { icon: <DollarSign className="h-8 w-8 text-primary" />, title: 'Capital Raising', description: 'Connecting projects with a network of qualified investors and financial institutions.' },
    { icon: <Building2 className="h-8 w-8 text-primary" />, title: 'Asset Management', description: 'Optimizing portfolio performance through strategic asset management and repositioning.' }
];

function InvestmentPortfolioSection() {
    const firestore = useFirestore();
    const projectsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'investment_projects');
    }, [firestore]);

    const { data: portfolioItems, isLoading } = useCollection<InvestmentProject>(projectsQuery);

    return (
        <section className="py-16 md:py-24 bg-secondary/30">
            <div className="container">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-headline font-bold">Our Investment Portfolio</h2>
                    <p className="mt-2 text-lg text-muted-foreground">A glance at our diverse and profitable portfolio.</p>
                </div>
                <div className="grid lg:grid-cols-5 gap-8 items-stretch">
                    <div className="lg:col-span-3">
                        <InvestmentChart />
                    </div>
                    <div className="lg:col-span-2 flex flex-col space-y-8">
                        {isLoading && Array.from({ length: 2 }).map((_, i) => (
                             <Card key={i} className="flex flex-1 overflow-hidden shadow-lg">
                                <div className="relative w-2/5">
                                    <Skeleton className="h-full w-full" />
                                </div>
                                <div className="w-3/5 flex flex-col p-4">
                                    <Skeleton className="h-6 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-1/2 mb-4" />
                                    <Skeleton className="h-5 w-1/3" />
                                </div>
                             </Card>
                        ))}
                        {portfolioItems?.map(item => {
                            const image = PlaceHolderImages.find(p => p.id === item.imageId);
                            return (
                                <Card key={item.id} className="flex flex-1 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    {image && <div className="relative w-2/5">
                                        <Image src={image.imageUrl} alt={image.description} fill className="object-cover" data-ai-hint={image.imageHint} />
                                    </div>}
                                    <div className="w-3/5 flex flex-col">
                                        <CardHeader>
                                            <CardTitle className="font-headline text-lg leading-tight">{item.name}</CardTitle>
                                            <CardDescription>${item.investmentValue.toLocaleString()}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-grow flex flex-col justify-end">
                                            <p className="font-semibold text-primary">{item.description}</p>
                                            <Button variant="link" size="sm" asChild className="p-0 h-auto mt-2 text-primary justify-start">
                                                <Link href="#">View Details <ArrowUpRight className="h-4 w-4 ml-1" /></Link>
                                            </Button>
                                        </CardContent>
                                    </div>
                                </Card>
                            );
                        })}
                         {!isLoading && (!portfolioItems || portfolioItems.length === 0) && (
                            <p className='text-center text-muted-foreground col-span-full'>No investment projects have been added yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}


export default function InvestmentsPage() {
  return (
    <>
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Project Development & Investment</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Unlocking value and driving growth through strategic real estate investments and development projects.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Investment Services</h2>
            <p className="mt-2 text-lg text-muted-foreground">Comprehensive services for savvy investors.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {investmentServices.map((service) => (
              <Card key={service.title} className="text-center p-6 border-0 shadow-none bg-transparent">
                <div className="flex justify-center mb-4">{service.icon}</div>
                <CardHeader className="p-0">
                  <CardTitle className="font-headline text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-2">
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <InvestmentPortfolioSection />
    </>
  );
}
