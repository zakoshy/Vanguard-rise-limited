
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentLinkForm } from '@/components/admin/payment-link-form';
import { Button } from '@/components/ui/button';
import { Copy, PlusCircle, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function PaymentsAdminPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [whatsAppLink, setWhatsAppLink] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const handleLinkGenerated = (link: string, whatsappLink: string) => {
    setGeneratedLink(link);
    setWhatsAppLink(whatsappLink);
    setDialogOpen(false);
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
                <h2 className="text-2xl font-bold tracking-tight">Payments</h2>
                <p className="text-muted-foreground">
                    Create and manage customer payment links.
                </p>
            </div>
             <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" /> Generate New Link
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle className="font-headline text-2xl">
                           Generate Payment Link
                        </DialogTitle>
                        <DialogDescription>
                           Fill in the customer and payment details below.
                        </DialogDescription>
                    </DialogHeader>
                    <PaymentLinkForm onLinkGenerated={handleLinkGenerated} />
                </DialogContent>
            </Dialog>
        </div>
        
        {generatedLink && (
            <Card>
                <CardHeader>
                    <CardTitle>Last Generated Link</CardTitle>
                    <CardDescription>Share this link with your customer to receive payment.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-4 border rounded-lg bg-secondary/50">
                        <p className="text-sm font-medium">Payment URL:</p>
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
                </CardContent>
            </Card>
        )}
    </div>
  );
}
