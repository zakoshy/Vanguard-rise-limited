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
import type { PhilanthropicActivity } from "@/lib/types";
import { useFirestore } from "@/firebase";
import { addDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, doc } from "firebase/firestore";
import { ImageUpload } from "./image-upload";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  goal: z.coerce.number().min(1, "Goal must be greater than 0."),
  raised: z.coerce.number().min(0),
  imageUrl: z.string().optional(),
});

type PhilanthropyFormProps = {
  activity?: PhilanthropicActivity | null;
  onFinished: () => void;
}

export function PhilanthropyForm({ activity, onFinished }: PhilanthropyFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!activity;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: activity?.title || "",
      description: activity?.description || "",
      goal: activity?.goal || 0,
      raised: activity?.raised || 0,
      imageUrl: activity?.imageUrl || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);

    const activityData = {
        ...values,
        date: activity?.date || new Date().toISOString(),
    };
    
    try {
        if (isEditing) {
            const docRef = doc(firestore, "philanthropic_activities", activity.id);
            updateDocumentNonBlocking(docRef, activityData);
            toast({ title: "Success", description: "Activity updated successfully." });
        } else {
            const colRef = collection(firestore, "philanthropic_activities");
            await addDocumentNonBlocking(colRef, activityData);
            toast({ title: "Success", description: "Activity added successfully." });
        }
        form.reset();
        onFinished();
    } catch (error) {
        console.error("Error saving activity: ", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "An error occurred while saving the activity.",
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activity Title</FormLabel>
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
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Goal (USD)</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="raised"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Raised (USD)</FormLabel>
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

        <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Update Activity' : 'Add Activity'}
        </Button>
      </form>
    </Form>
  );
}
