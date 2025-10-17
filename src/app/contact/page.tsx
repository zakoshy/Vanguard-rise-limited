import { Mail, Phone, MapPin } from 'lucide-react';
import { ContactForm } from '@/components/contact-form';

const contactDetails = [
  { icon: <Mail className="h-6 w-6 text-primary" />, label: "Email", value: "vanguardriselimited@gmail.com", href: "mailto:vanguardriselimited@gmail.com" },
  { icon: <Phone className="h-6 w-6 text-primary" />, label: "Phone", value: "0795472495 / 0738589475", href: "tel:0795472495" },
  { icon: <MapPin className="h-6 w-6 text-primary" />, label: "Office", value: "Mombasa ,Kenya Bamburi mtambo Rd, 4th avenue Next to Arawa Hospital" },
];

export default function ContactPage() {
  return (
    <>
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Get In Touch</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            We're here to help. Whether you have a question about our services or want to discuss a new project, we'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-5 gap-12">
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-headline font-bold mb-4">Contact Information</h2>
                <p className="text-muted-foreground mb-6">
                  Reach out to us through any of the following channels. Our team is ready to assist you.
                </p>
              </div>
              <div className="space-y-6">
                {contactDetails.map(detail => (
                  <div key={detail.label} className="flex items-start gap-4">
                    <div className='mt-1'>{detail.icon}</div>
                    <div>
                      <h3 className="font-semibold">{detail.label}</h3>
                      {detail.href ? (
                         <a href={detail.href} className="text-muted-foreground hover:text-primary transition-colors">{detail.value}</a>
                      ) : (
                        <p className="text-muted-foreground">{detail.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-3">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
