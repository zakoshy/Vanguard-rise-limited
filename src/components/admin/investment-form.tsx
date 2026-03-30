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
import type { InvestmentProject } from "@/lib/types";
import { useFirestore } from "@/firebase";
import { addDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, doc } from "firebase/firestore";
import { ImageUpload } from "./image-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const formSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  investmentValue: z.coerce.number().min(1, "Value must be greater than 0."),
  currency: z.string().default("USD"),
  imageUrl: z.string().optional(),
});

type InvestmentFormProps = {
  project?: InvestmentProject | null;
  onFinished: () => void;
}

export function InvestmentForm({ project, onFinished }: InvestmentFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!project;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      investmentValue: project?.investmentValue || 0,
      currency: project?.currency || "USD",
      imageUrl: project?.imageUrl || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);

    const projectData = {
        ...values,
        startDate: project?.startDate || new Date().toISOString(),
    };
    
    try {
        if (isEditing) {
            const docRef = doc(firestore, "investment_projects", project.id);
            updateDocumentNonBlocking(docRef, projectData);
            toast({ title: "Success", description: "Project updated." });
        } else {
            const colRef = collection(firestore, "investment_projects");
            await addDocumentNonBlocking(colRef, projectData);
            toast({ title: "Success", description: "Project added." });
        }
        form.reset();
        onFinished();
    } catch (error) {
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl><Input placeholder="e.g., Downtown Commercial Hub" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Investment Description</FormLabel>
              <FormControl><Textarea rows={4} placeholder="Summarize the investment potential..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="KES">KES</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="investmentValue"
                render={({ field }) => (
                    <FormItem className="flex-1">
                        <FormLabel>Total Investment Value</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
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
            {isEditing ? 'Update Project' : 'Add to Portfolio'}
        </Button>
      </form>
    </Form>
  );
}
