'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react";
import { Loader2 } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { RealEstateListing } from "@/lib/types";
import { useFirestore } from "@/firebase";
import { addDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, doc } from "firebase/firestore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ImageUpload } from "./image-upload";

const formSchema = z.object({
  address: z.string().min(5, "Address is required."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().min(1, "Price must be greater than 0."),
  currency: z.string().default("KES"),
  propertyType: z.string().min(3, "Property type is required."),
  imageUrl: z.string().optional(),
  status: z.enum(['Available', 'Sold']),
});

type RealEstateFormProps = {
  listing?: RealEstateListing | null;
  onFinished: () => void;
}

export function RealEstateForm({ listing, onFinished }: RealEstateFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!listing;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: listing?.address || "",
      description: listing?.description || "",
      price: listing?.price || 0,
      currency: listing?.currency || "KES",
      propertyType: listing?.propertyType || "",
      imageUrl: listing?.imageUrl || "",
      status: listing?.status || "Available",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);

    try {
        if (isEditing && listing) {
            const docRef = doc(firestore, "real_estate_listings", listing.id);
            updateDocumentNonBlocking(docRef, values);
            toast({ title: "Success", description: "Listing updated successfully." });
        } else {
            const colRef = collection(firestore, "real_estate_listings");
            await addDocumentNonBlocking(colRef, values);
            toast({ title: "Success", description: "Listing added successfully." });
        }
        form.reset();
        onFinished();
    } catch (error) {
        console.error("Error saving listing: ", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "An error occurred while saving.",
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location / Address</FormLabel>
              <FormControl><Input placeholder="e.g., Bamburi, Mombasa" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="propertyType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Type</FormLabel>
              <FormControl><Input placeholder="e.g., 3 Bedroom Apartment" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl><Textarea rows={4} placeholder="Detailed property details..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-2 items-end">
                <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                        <FormItem className="w-32">
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
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormLabel>Price</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            
            <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Availability Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Sold">Sold</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <ImageUpload 
                defaultValue={field.value} 
                onUploadSuccess={(url) => field.onChange(url)} 
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg">
            {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {isEditing ? 'Update Listing' : 'Publish Listing'}
        </Button>
      </form>
    </Form>
  );
}
