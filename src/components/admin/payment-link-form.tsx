
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection } from "firebase/firestore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { PaymentLink } from "@/lib/types";

const formSchema = z.object({
  customerName: z.string().min(2, "Customer name is required."),
  customerEmail: z.string().email("Please enter a valid email."),
  customerPhone: z.string().min(10, "Please enter a valid phone number."),
  amount: z.coerce.number().min(1, "Amount must be at least 1."),
  currency: z.string().default("KES"),
});

type PaymentLinkFormProps = {
  onLinkGenerated: (link: string, whatsappLink: string) => void;
};

export function PaymentLinkForm({ onLinkGenerated }: PaymentLinkFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      amount: 0,
      currency: "KES",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);

    const uniqueId = uuidv4();
    const domain = window.location.origin;
    const paymentUrl = `${domain}/pay/${uniqueId}`;

    const paymentLinkData: Omit<PaymentLink, 'id'> = {
        orderId: uniqueId,
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        customerPhone: values.customerPhone,
        amount: values.amount,
        currency: values.currency,
        status: 'pending',
        createdAt: new Date().toISOString(),
    };

    try {
        const colRef = collection(firestore, "payment_links");
        await addDocumentNonBlocking(colRef, paymentLinkData);
        
        const whatsappText = encodeURIComponent(`Hello ${values.customerName}, please complete your payment of ${values.currency} ${values.amount} using this link: ${paymentUrl}`);
        const whatsappUrl = `https://wa.me/${values.customerPhone}?text=${whatsappText}`;
        
        onLinkGenerated(paymentUrl, whatsappUrl);

        toast({ title: "Success", description: "Payment link generated successfully." });
        form.reset();

    } catch (error) {
        console.error("Error generating payment link: ", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "An error occurred while generating the link.",
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Customer Name</FormLabel>
                <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="customerEmail"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Customer Email</FormLabel>
                <FormControl><Input placeholder="john.doe@example.com" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
            control={form.control}
            name="customerPhone"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Customer Phone</FormLabel>
                <FormControl><Input placeholder="e.g., 254712345678" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="KES">KES</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Link
        </Button>
      </form>
    </Form>
  );
}
