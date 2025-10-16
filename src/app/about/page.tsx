import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Medal, Target, Eye, Users } from 'lucide-react';

const teamMembers = [
  { name: 'Alex Johnson', role: 'CEO & Founder', imageId: 'testimonial-1' },
  { name: 'Jane Doe', role: 'Head of Project Management', imageId: 'testimonial-2' },
  { name: 'Michael Smith', role: 'Lead Investment Analyst', imageId: 'testimonial-1' },
  { name: 'Emily White', role: 'Real Estate Director', imageId: 'testimonial-2' },
];

const coreValues = [
  { icon: <Medal className="h-8 w-8 text-primary" />, title: 'Integrity', description: 'We uphold the highest standards of integrity in all of our actions.' },
  { icon: <Users className="h-8 w-8 text-primary" />, title: 'Teamwork', description: 'We work together, across boundaries, to meet the needs of our customers.' },
  { icon: <Target className="h-8 w-8 text-primary" />, title: 'Excellence', description: 'We are passionate about delivering the highest quality in everything we do.' },
  { icon: <Eye className="h-8 w-8 text-primary" />, title: 'Transparency', description: 'We are committed to open and honest communication with our clients and partners.' },
];

export default function AboutPage() {
  const aboutImage = PlaceHolderImages.find(p => p.id === 'project-management-1');

  return (
    <>
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">About Vanguard Rise</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            A premier consultancy firm specializing in real estate, project management, and strategic investments.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-headline font-bold mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              Founded on the principles of integrity and innovation, Vanguard Rise Limited has grown from a small consultancy to a market leader in the real estate and investment sector. Our journey is one of passion, persistence, and a relentless pursuit of excellence. We believe in building more than just properties; we build lasting relationships and thriving communities.
            </p>
            <p className="text-muted-foreground">
              Our team of seasoned experts brings a wealth of experience from diverse backgrounds, enabling us to provide comprehensive solutions tailored to the unique needs of each client. From initial concept to final delivery, we are your trusted partner every step of the way.
            </p>
          </div>
          {aboutImage && (
            <div className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-lg">
              <Image 
                src={aboutImage.imageUrl} 
                alt={aboutImage.description} 
                fill 
                className="object-cover"
                data-ai-hint={aboutImage.imageHint}
              />
            </div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Our Core Values</h2>
            <p className="mt-2 text-lg text-muted-foreground">The principles that guide us.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value) => (
              <Card key={value.title} className="text-center p-6 border-0 shadow-lg bg-card">
                <div className="flex justify-center mb-4">{value.icon}</div>
                <CardHeader className="p-0">
                  <CardTitle className="font-headline text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-2">
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Meet the Team</h2>
            <p className="mt-2 text-lg text-muted-foreground">The experts driving our success.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {teamMembers.map((member) => {
              const image = PlaceHolderImages.find(p => p.id === member.imageId);
              return (
                <div key={member.name} className="text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4 ring-2 ring-primary p-1">
                    {image && <AvatarImage src={image.imageUrl} alt={image.description} data-ai-hint={image.imageHint} />}
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-sm text-primary">{member.role}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
