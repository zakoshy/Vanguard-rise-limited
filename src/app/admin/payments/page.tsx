
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentLinkForm } from '@/components/admin/payment-link-form';
import { Button } from '@/components/ui/button';
import { Copy, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PaymentsAdminPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [whatsAppLink, setWhatsAppLInk] = useState<string | null>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/admin');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading and verifying access...</p>
      </div>
    );
  }

  const handleLinkGenerated = (link: string, whatsApp: string) => {
    setGeneratedLink(link);
    setWhatsAppLInk(whatsApp);
  };
  
  const copyLink = () => {
    if (generatedLink) {
        navigator.clipboard.writeText(generatedLink);
        toast({
            title: "Copied!",
            description: "Payment link copied to clipboard.",
        });
    }
  };

  const sendOnWhatsApp = () => {
    if(whatsAppLink) {
        window.open(whatsAppLink, '_blank');
    }
  };

  return (
    <div>
        <div className="flex items-center justify-between mb-8">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Generate Payment Link</h2>
                <p className="text-muted-foreground">
                    Create a unique payment link for a customer.
                </p>
            </div>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Customer & Payment Details</CardTitle>
                <CardDescription>Fill in the form below to generate a new payment link.</CardDescription>
            </CardHeader>
            <CardContent>
                <PaymentLinkForm onLinkGenerated={handleLinkGenerated} />

                {generatedLink && (
                    <div className="mt-8 p-4 border rounded-lg bg-secondary/50">
                        <p className="text-sm font-medium">Generated Link:</p>
                        <a href={generatedLink} target="_blank" rel="noopener noreferrer" className="text-primary underline break-all">
                            {generatedLink}
                        </a>
                        <div className="mt-4 flex gap-2">
                            <Button onClick={copyLink} variant="outline" size="sm">
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Link
                            </Button>
                            <Button onClick={sendOnWhatsApp} variant="outline" size="sm">
                                <Share2 className="mr-2 h-4 w-4" />
                                Send via WhatsApp
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
