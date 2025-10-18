
'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Progress } from '@/components/ui/progress';
import { Heart, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DonationForm } from '@/components/donation-form';
import { useState } from 'react';
import Link from 'next/link';

const initiatives = [
  {
    title: 'Community Green Space Initiative',
    description: 'Developing and maintaining parks and green spaces in urban areas to promote well-being and community gathering.',
    imageId: 'philanthropy-1',
    goal: 50000,
    raised: 35000,
  },
  {
    title: 'Youth Education Scholarship',
    description: 'Providing scholarships and educational resources to underprivileged students to help them achieve their potential.',
    imageId: 'philanthropy-2',
    goal: 75000,
    raised: 60000,
  },
];

const paymentChannels = [
  { name: 'M-Pesa', icon: Icons.mpesa },
  { name: 'MasterCard', icon: Icons.mastercard },
  { name: 'PayPal', icon: Icons.paypal },
  { name: 'Crypto', icon: Icons.crypto },
];

export default function PhilanthropyPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Philanthropic Activities</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Investing in our communities is as important as investing in property. We are committed to driving positive social change through our CSR initiatives.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Our Initiatives</h2>
            <p className="mt-2 text-lg text-muted-foreground">Making a tangible impact through dedicated projects.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {initiatives.map((item) => {
              const image = PlaceHolderImages.find(p => p.id === item.imageId);
              const progress = (item.raised / item.goal) * 100;
              return (
                <Card key={item.title} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  {image && (
                    <div className="relative h-64 w-full">
                      <Image src={image.imageUrl} alt={image.description} fill className="object-cover" data-ai-hint={image.imageHint} />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">{item.description}</CardDescription>
                    <Progress value={progress} className="h-2 mb-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Raised: ${item.raised.toLocaleString()}</span>
                      <span>Goal: ${item.goal.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Join Us in Making a Difference</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Your contribution can help us expand our reach and support more communities. Partner with us or make a donation today.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="lg"><Heart className="mr-2 h-5 w-5" /> Donate Now</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[480px]">
                      <DialogHeader>
                        <DialogTitle className="font-headline text-2xl">Make a Donation</DialogTitle>
                        <DialogDescription>
                          Your support helps us create a lasting impact in our communities.
                        </DialogDescription>
                      </DialogHeader>
                      <DonationForm setDialogOpen={setDialogOpen} />
                    </DialogContent>
                  </Dialog>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/contact">
                      <Users className="mr-2 h-5 w-5" /> Become a Partner
                    </Link>
                  </Button>
              </div>
            </div>
            <div>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-center">We Accept</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-around items-center gap-4 flex-wrap">
                    {paymentChannels.map(channel => (
                      <div key={channel.name} className="flex flex-col items-center gap-2 text-muted-foreground">
                        <channel.icon className="h-10 w-auto" />
                        <span className="text-xs">{channel.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
