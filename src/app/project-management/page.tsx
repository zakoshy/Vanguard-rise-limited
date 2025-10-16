import Image from 'next/image';
import { CheckCircle, GanttChartSquare, Users } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const processSteps = [
  { icon: <GanttChartSquare className="h-8 w-8 text-primary" />, title: 'Initiation & Planning', description: 'Defining project scope, objectives, and creating a detailed roadmap for success.' },
  { icon: <Users className="h-8 w-8 text-primary" />, title: 'Execution & Monitoring', description: 'Managing resources, timelines, and budgets while ensuring quality standards are met.' },
  { icon: <CheckCircle className="h-8 w-8 text-primary" />, title: 'Closure & Delivery', description: 'Finalizing all activities, handing over deliverables, and completing project documentation.' },
];

const successStories = [
  { id: 'pm1', title: 'Downtown Skyscraper', category: 'Commercial', description: 'Managed the development of a 40-story commercial tower, completed 2 months ahead of schedule and 5% under budget.', imageId: 'project-management-1' },
  { id: 'pm2', title: 'Greenwood Residences', category: 'Residential', description: 'Oversaw the construction of a 200-unit luxury residential complex, achieving LEED Gold certification and high resident satisfaction.', imageId: 'project-management-2' },
];

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
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Our Proven Process</h2>
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

      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Success Stories</h2>
            <p className="mt-2 text-lg text-muted-foreground">Showcasing our proven track record of successful projects.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {successStories.map((story) => {
              const image = PlaceHolderImages.find(p => p.id === story.imageId);
              return (
                <Card key={story.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  {image && (
                    <div className="relative h-64 w-full">
                       <Image
                        src={image.imageUrl}
                        alt={image.description}
                        fill
                        className="object-cover"
                        data-ai-hint={image.imageHint}
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="font-headline text-2xl">{story.title}</CardTitle>
                      <Badge variant="outline" className="border-accent text-accent">{story.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{story.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
