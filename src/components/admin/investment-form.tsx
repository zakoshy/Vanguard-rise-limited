
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ImageUpload } from "./image-upload";

const formSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  investmentValue: z.coerce.number().min(1, "Investment value must be greater than 0."),
  imageUrl: z.string().optional(),
  imageId: z.string().optional(),
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
      imageUrl: project?.imageUrl || "",
      imageId: project?.imageId || "",
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
            toast({ title: "Success", description: "Project updated successfully." });
        } else {
            const colRef = collection(firestore, "investment_projects");
            await addDocumentNonBlocking(colRef, projectData);
            toast({ title: "Success", description: "Project added successfully." });
        }
        form.reset();
        onFinished();
    } catch (error) {
        console.error("Error saving project: ", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "An error occurred while saving the project.",
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
              <FormControl><Input {...field} /></FormControl>
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
              <FormControl><Textarea rows={3} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="investmentValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Investment Value (USD)</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 gap-6">
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

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or select placeholder</span>
            </div>
          </div>

          <FormField
            control={form.control}
            name="imageId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Placeholder Image</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                          <SelectTrigger>
                              <SelectValue placeholder="Select an image" />
                          </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                          {PlaceHolderImages.filter(p => p.id.startsWith('investment') || p.id.startsWith('real-estate')).map(image => (
                              <SelectItem key={image.id} value={image.id}>{image.description}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Update Project' : 'Add Project'}
        </Button>
      </form>
    </Form>
  );
}
