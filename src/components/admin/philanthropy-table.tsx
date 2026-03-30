'use client';

import { useState } from 'react';
import { collection, doc } from 'firebase/firestore';
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
import { ScrollArea } from "@/components/ui/scroll-area"

import type { PhilanthropicActivity } from '@/lib/types';
import { PhilanthropyForm } from './philanthropy-form';
import { Skeleton } from '../ui/skeleton';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

export function PhilanthropyTable() {
    const firestore = useFirestore();
    const { toast } = useToast();

    const activitiesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'philanthropic_activities');
    }, [firestore]);

    const { data: activities, isLoading } = useCollection<PhilanthropicActivity>(activitiesQuery);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<PhilanthropicActivity | null>(null);
    const [activityToDelete, setActivityToDelete] = useState<PhilanthropicActivity | null>(null);

    const handleEdit = (activity: PhilanthropicActivity) => {
        setSelectedActivity(activity);
        setDialogOpen(true);
    };
    
    const handleAddNew = () => {
        setSelectedActivity(null);
        setDialogOpen(true);
    };

    const handleDelete = (activity: PhilanthropicActivity) => {
        setActivityToDelete(activity);
    };

    const confirmDelete = () => {
        if (!activityToDelete || !firestore) return;
        const docRef = doc(firestore, 'philanthropic_activities', activityToDelete.id);
        deleteDocumentNonBlocking(docRef);
        toast({ title: "Success", description: "Activity deleted successfully." });
        setActivityToDelete(null);
    };

  return (
    <>
        <div className="flex items-center justify-between mb-8">
            <div>
                <h2 className="text-2xl font-bold tracking-tight font-headline text-primary">Philanthropic Activities</h2>
                <p className="text-muted-foreground">
                    Manage the philanthropic activities here.
                </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                    <Button onClick={handleAddNew}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] p-0 flex flex-col max-h-[90vh] overflow-hidden">
                    <DialogHeader className="p-6 pb-4 border-b shrink-0 bg-secondary/10">
                        <DialogTitle className="font-headline text-2xl text-primary">
                            {selectedActivity ? 'Edit Activity' : 'Add New Activity'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedActivity ? 'Update the details for this activity.' : 'Fill in the details for the new activity.'}
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="flex-grow overflow-y-auto">
                        <div className="p-6 pb-8">
                            <PhilanthropyForm activity={selectedActivity} onFinished={() => setDialogOpen(false)} />
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
        <div className="rounded-md border shadow-sm bg-card">
            <Table>
                <TableHeader>
                <TableRow className="bg-secondary/5">
                    <TableHead className="font-headline">Title</TableHead>
                    <TableHead className="font-headline">Goal</TableHead>
                    <TableHead className="font-headline">Raised</TableHead>
                    <TableHead className="hidden md:table-cell font-headline">Date</TableHead>
                    <TableHead>
                    <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {isLoading && (
                    Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                        </TableRow>
                    ))
                )}
                {activities && activities.length > 0 ? (
                    activities.map((activity) => (
                    <TableRow key={activity.id} className="hover:bg-secondary/5">
                        <TableCell className="font-medium text-primary">{activity.title}</TableCell>
                        <TableCell className="font-semibold">{activity.currency || 'USD'} {(activity.goal || 0).toLocaleString()}</TableCell>
                        <TableCell className="text-green-600 font-semibold">{activity.currency || 'USD'} {(activity.raised || 0).toLocaleString()}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                         {activity.date ? new Date(activity.date).toLocaleDateString() : 'N/A'}
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
                                <DropdownMenuItem onSelect={() => handleEdit(activity)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleDelete(activity)} className="text-destructive font-semibold">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    !isLoading && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground italic">No activities found.</TableCell></TableRow>
                )}
                </TableBody>
            </Table>
        </div>
        
        <AlertDialog open={!!activityToDelete} onOpenChange={(open) => !open && setActivityToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="font-headline text-destructive">Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the activity titled "{activityToDelete?.title}".
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setActivityToDelete(null)} className="font-semibold">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
}
