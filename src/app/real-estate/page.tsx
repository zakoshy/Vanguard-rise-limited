
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Search, BedDouble, Bath } from 'lucide-react';

const properties = [
  { id: 're1', title: 'Luxury Apartment', location: 'Kilimani, Nairobi', price: 'KES 25,000,000', beds: 3, baths: 3, imageId: 'real-estate-1' },
  { id: 're2', title: 'Executive Maisonette', location: 'Lavington, Nairobi', price: 'KES 45,000,000', beds: 4, baths: 4, imageId: 'real-estate-2' },
  { id: 're3', title: 'Serene Villa with Garden', location: 'Karen, Nairobi', price: 'KES 68,000,000', beds: 5, baths: 5, imageId: 'real-estate-3' },
];

const testimonials = [
  { name: 'Asha Njeri', role: 'Home Buyer', text: "The team at Vanguard Rise made our home buying process seamless and stress-free. Their market knowledge is unparalleled.", imageId: 'testimonial-1' },
  { name: 'David Odhiambo', role: 'Investor', text: "A truly professional and trustworthy partner. Their insights led to a highly profitable investment in Nairobi's property market.", imageId: 'testimonial-2' },
];

export default function RealEstatePage() {
  return (
    <>
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Real Estate Consultancy</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Expert guidance for your real estate journey. From acquisition to sales, we provide advisory services that maximize value and minimize risk.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <Card className="shadow-lg p-4 md:p-6 -mt-32 md:-mt-40 relative z-10 bg-background">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <Input placeholder="Search by location e.g. 'Kilimani'..." className="md:col-span-2 h-12 text-base" />
              <Select>
                <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Property Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
              <Button size="lg" className="h-12 text-base w-full"><Search className="mr-2 h-5 w-5"/>Search</Button>
            </div>
          </Card>

          <div className="mt-16">
            <h2 className="text-3xl font-headline font-bold text-center mb-10">Featured Listings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map(prop => {
                const image = PlaceHolderImages.find(p => p.id === prop.imageId);
                return (
                  <Card key={prop.id} className="overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
                    {image && (
                      <div className="relative h-56 w-full">
                        <Image src={image.imageUrl} alt={image.description} fill className="object-cover" data-ai-hint={image.imageHint} />
                        <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">{prop.price}</Badge>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="font-headline text-xl">{prop.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1"><MapPin className="h-4 w-4"/>{prop.location}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow" />
                    <CardFooter className="flex justify-between text-sm text-muted-foreground border-t pt-4">
                      <div className="flex items-center gap-2"><BedDouble className="h-5 w-5 text-primary"/>{prop.beds} Beds</div>
                      <div className="flex items-center gap-2"><Bath className="h-5 w-5 text-primary"/>{prop.baths} Baths</div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">What Our Clients Say</h2>
            <p className="mt-2 text-lg text-muted-foreground">Building trust, one successful partnership at a time.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map(t => {
                const image = PlaceHolderImages.find(p => p.id === t.imageId);
                return (
                    <Card key={t.name} className="p-6 shadow-lg">
                        <CardContent className="p-0">
                            <div className="flex text-yellow-400 mb-4">
                                <Star/><Star/><Star/><Star/><Star/>
                            </div>
                            <p className="text-muted-foreground mb-6 italic">"{t.text}"</p>
                            <div className="flex items-center gap-4">
                                {image && <Avatar>
                                    <AvatarImage src={image.imageUrl} alt={image.description} data-ai-hint={image.imageHint} />
                                    <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                                </Avatar>}
                                <div>
                                    <p className="font-semibold">{t.name}</p>
                                    <p className="text-sm text-muted-foreground">{t.role}</p>
                                </div>
                            </div>
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
