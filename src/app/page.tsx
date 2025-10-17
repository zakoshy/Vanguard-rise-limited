import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Building, Heart, Home as HomeIcon, Briefcase } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const services = [
  {
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    title: 'Project Management',
    description: 'Expert oversight from inception to completion, ensuring your projects are delivered on time and within budget.',
    link: '/project-management',
  },
  {
    icon: <Building className="h-10 w-10 text-primary" />,
    title: 'Investment & Development',
    description: 'Strategic investment opportunities and comprehensive project development services for maximum returns.',
    link: '/investments',
  },
  {
    icon: <HomeIcon className="h-10 w-10 text-primary" />,
    title: 'Real Estate Consultancy',
    description: 'In-depth market analysis and advisory to help you navigate the complexities of real estate.',
    link: '/real-estate',
  },
  {
    icon: <Heart className="h-10 w-10 text-primary" />,
    title: 'Philanthropic Initiatives',
    description: 'Driving positive change through community development and corporate social responsibility.',
    link: '/philanthropy',
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-1');

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-4">
          <h1 className="text-4xl md:text-6xl font-headline font-bold !text-white leading-tight shadow-lg">
            Building Visions, Creating Reality
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl !text-gray-200">
            Vanguard Rise Limited is your trusted partner in real estate, project management, and investment consultancy, dedicated to excellence and community development.
          </p>
          <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg">
            <Link href="/contact">
              Discover More <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div className="p-8 rounded-lg">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground text-lg">
              To be a catalyst for sustainable growth and positive transformation, developing real estate and investment solutions that empower communities, create opportunities and inspire hope across Africa.
            </p>
          </div>
          <div className="p-8 rounded-lg">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Our Vision</h2>
            <p className="text-muted-foreground text-lg">
              To be a catalyst for sustainable growth and positive transformation, developing real estate and investment solutions that empower communities, create opportunities and inspire hope across Africa.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Our Expertise</h2>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
              We offer a comprehensive suite of services designed to meet the diverse needs of our clients.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <Card key={service.title} className="text-center flex flex-col items-center p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="mb-4">{service.icon}</div>
                <CardHeader className="p-0">
                  <CardTitle className="font-headline text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-4 flex-grow">
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </CardContent>
                <Button variant="link" asChild className="mt-4 text-primary">
                  <Link href={service.link}>Learn More <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
