
'use client';

import { useState } from 'react';
import { collection } from 'firebase/firestore';
import { MoreHorizontal, PlusCircle } from 'lucide-react';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import type { ProjectManagementSuccessStory } from '@/lib/types';
import { SuccessStoryForm } from './success-story-form';
import { Skeleton } from '../ui/skeleton';
import { doc } from 'firebase/firestore';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

export function SuccessStoriesTable() {
    const firestore = useFirestore();
    const { toast } = useToast();

    const storiesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'project_management_success_stories');
    }, [firestore]);

    const { data: stories, isLoading } = useCollection<ProjectManagementSuccessStory>(storiesQuery);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedStory, setSelectedStory] = useState<ProjectManagementSuccessStory | null>(null);
    const [storyToDelete, setStoryToDelete] = useState<ProjectManagementSuccessStory | null>(null);

    const handleEdit = (story: ProjectManagementSuccessStory) => {
        setSelectedStory(story);
        setDialogOpen(true);
    };
    
    const handleAddNew = () => {
        setSelectedStory(null);
        setDialogOpen(true);
    };

    const handleDelete = (story: ProjectManagementSuccessStory) => {
        setStoryToDelete(story);
    };

    const confirmDelete = () => {
        if (!storyToDelete || !firestore) return;
        const docRef = doc(firestore, 'project_management_success_stories', storyToDelete.id);
        deleteDocumentNonBlocking(docRef);
        toast({ title: "Success", description: "Story deleted successfully." });
        setStoryToDelete(null);
    };

  return (
    <>
        <div className="flex items-center justify-between mb-8">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Success Stories</h2>
                <p className="text-muted-foreground">
                    Manage the project management success stories here.
                </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                    <Button onClick={handleAddNew}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle className="font-headline text-2xl">
                            {selectedStory ? 'Edit Success Story' : 'Add New Success Story'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedStory ? 'Update the details for this success story.' : 'Fill in the details for the new success story.'}
                        </DialogDescription>
                    </DialogHeader>
                    <SuccessStoryForm story={selectedStory} onFinished={() => setDialogOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="hidden md:table-cell">Date Published</TableHead>
                    <TableHead>
                    <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {isLoading && (
                    Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                        </TableRow>
                    ))
                )}
                {stories && stories.length > 0 ? (
                    stories.map((story) => (
                    <TableRow key={story.id}>
                        <TableCell className="font-medium">{story.title}</TableCell>
                        <TableCell>{story.category}</TableCell>
                        <TableCell className="hidden md:table-cell">
                        {story.datePublished ? new Date(story.datePublished).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onSelect={() => handleEdit(story)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleDelete(story)} className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    !isLoading && <TableRow><TableCell colSpan={4} className="text-center">No stories found.</TableCell></TableRow>
                )}
                </TableBody>
            </Table>
        </div>
        
        <AlertDialog open={!!storyToDelete} onOpenChange={(open) => !open && setStoryToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the story titled "{storyToDelete?.title}".
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setStoryToDelete(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
}
