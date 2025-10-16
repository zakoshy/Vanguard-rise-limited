"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Icons } from "./icons"

const paymentMethods = [
    { name: "M-Pesa", value: "mpesa", icon: Icons.mpesa },
    { name: "MasterCard", value: "mastercard", icon: Icons.mastercard },
    { name: "PayPal", value: "paypal", icon: Icons.paypal },
    { name: "Crypto", value: "crypto", icon: Icons.crypto },
];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  amount: z.coerce.number().min(1, {
      message: "Amount must be at least $1."
  }),
  paymentMethod: z.enum(["mpesa", "mastercard", "paypal", "crypto"], {
      required_error: "You need to select a payment method."
  })
})

type DonationFormProps = {
    setDialogOpen: (open: boolean) => void;
}

export function DonationForm({ setDialogOpen }: DonationFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: 10,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);

    toast({
      title: "Donation Received!",
      description: `Thank you for your generous donation of $${values.amount}, ${values.name}!`,
    });
    form.reset();
    setDialogOpen(false);
  }

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
        <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        </div>
        <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Amount (USD)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="50" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
                <FormItem className="space-y-3">
                <FormLabel>Payment Method</FormLabel>
                <FormControl>
                    <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-2 gap-4"
                    >
                    {paymentMethods.map(method => (
                        <FormItem key={method.value} className="flex items-center space-x-3 space-y-0">
                             <FormControl>
                                <RadioGroupItem value={method.value} />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center gap-2 cursor-pointer">
                                <method.icon className="h-6 w-auto" />
                                {method.name}
                            </FormLabel>
                        </FormItem>
                    ))}
                    </RadioGroup>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Processing..." : `Donate Now`}
        </Button>
    </form>
    </Form>
  )
}
