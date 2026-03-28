
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
import type { ProjectManagementSuccessStory } from "@/lib/types";
import { useFirestore } from "@/firebase";
import { addDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, doc } from "firebase/firestore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ImageUpload } from "./image-upload";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  content: z.string().min(10, "Content must be at least 10 characters."),
  category: z.string().optional(),
  imageUrl: z.string().optional(),
  imageId: z.string().optional(),
});

type SuccessStoryFormProps = {
  story?: ProjectManagementSuccessStory | null;
  onFinished: () => void;
}

export function SuccessStoryForm({ story, onFinished }: SuccessStoryFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!story;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: story?.title || "",
      content: story?.content || "",
      category: story?.category || "",
      imageUrl: story?.imageUrl || "",
      imageId: story?.imageId || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);

    const storyData = {
        ...values,
        datePublished: story?.datePublished || new Date().toISOString(),
    };
    
    try {
        if (isEditing) {
            const docRef = doc(firestore, "project_management_success_stories", story.id);
            updateDocumentNonBlocking(docRef, storyData);
            toast({ title: "Success", description: "Story updated successfully." });
        } else {
            const colRef = collection(firestore, "project_management_success_stories");
            await addDocumentNonBlocking(colRef, storyData);
            toast({ title: "Success", description: "Story added successfully." });
        }
        form.reset();
        onFinished();
    } catch (error) {
        console.error("Error saving story: ", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "An error occurred while saving the story.",
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
              <FormLabel>Title</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl><Textarea rows={5} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl><Input placeholder="e.g., Commercial" {...field} /></FormControl>
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
                          {PlaceHolderImages.filter(p => p.id.startsWith('project-management')).map(image => (
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
            {isEditing ? 'Update Story' : 'Add Story'}
        </Button>
      </form>
    </Form>
  );
}
