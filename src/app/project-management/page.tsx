
'use client';

import Image from 'next/image';
import { HardHat, Truck, Rocket } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { ProjectManagementSuccessStory } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const processSteps = [
  { icon: <HardHat className="h-8 w-8 text-primary" />, title: 'Construction', description: 'Overseeing all phases of construction to ensure quality, safety, and timely completion of projects.' },
  { icon: <Truck className="h-8 w-8 text-primary" />, title: 'Supply of Equipments', description: 'Procuring and managing the logistics of all necessary equipment for seamless project execution.' },
  { icon: <Rocket className="h-8 w-8 text-primary" />, title: 'Development Activities', description: 'Leading project development from initial concept to final delivery, ensuring all goals are met.' },
];

function SuccessStoriesSection() {
  const firestore = useFirestore();
  const storiesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'project_management_success_stories');
  }, [firestore]);

  const { data: successStories, isLoading } = useCollection<Omit<ProjectManagementSuccessStory, 'id'>>(storiesQuery);

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Success Stories</h2>
          <p className="mt-2 text-lg text-muted-foreground">Showcasing our proven track record of successful projects.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {isLoading && Array.from({ length: 2 }).map((_, i) => (
             <Card key={i} className="overflow-hidden shadow-lg">
                <Skeleton className="h-64 w-full" />
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6 mt-2" />
                </CardContent>
             </Card>
          ))}
          {!isLoading && successStories?.map((story) => {
            const image = PlaceHolderImages.find(p => p.id === story.imageId) ?? { imageUrl: story.imageUrl, description: story.title, imageHint: 'project management' };
            return (
              <Card key={story.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-64 w-full">
                    <Image
                    src={image.imageUrl || 'https://picsum.photos/seed/placeholder/600/400'}
                    alt={image.description || story.title}
                    fill
                    className="object-cover"
                    data-ai-hint={image.imageHint}
                    />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="font-headline text-2xl">{story.title}</CardTitle>
                    {story.category && <Badge variant="outline" className="border-accent text-accent">{story.category}</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{story.content}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
        { !isLoading && (!successStories || successStories.length === 0) && (
            <p className='text-center text-muted-foreground'>No success stories have been added yet.</p>
        )}
      </div>
    </section>
  );
}


export default function ProjectManagementPage() {
  return (
    <>
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Project Management</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Delivering excellence from concept to completion. We provide comprehensive project management services to ensure your vision becomes a reality, on time and on budget.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Our Core Services</h2>
            <p className="mt-2 text-lg text-muted-foreground">A structured approach to guarantee project success.</p>
          </div>
          <div className="relative grid md:grid-cols-3 gap-8">
            <div className="absolute top-1/2 left-0 w-full h-px bg-border -translate-y-4 hidden md:block" />
            {processSteps.map((step, index) => (
              <div key={step.title} className="relative flex flex-col items-center text-center p-6">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-4 h-3 w-3 rounded-full bg-primary ring-4 ring-background hidden md:block" />
                <div className="flex justify-center mb-4">{step.icon}</div>
                <h3 className="font-headline text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground mt-2">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <SuccessStoriesSection />
    </>
  );
}
