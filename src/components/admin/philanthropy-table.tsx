
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
                <h2 className="text-2xl font-bold tracking-tight">Philanthropic Activities</h2>
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
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle className="font-headline text-2xl">
                            {selectedActivity ? 'Edit Activity' : 'Add New Activity'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedActivity ? 'Update the details for this activity.' : 'Fill in the details for the new activity.'}
                        </DialogDescription>
                    </DialogHeader>
                    <PhilanthropyForm activity={selectedActivity} onFinished={() => setDialogOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Goal</TableHead>
                    <TableHead>Raised</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
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
                    <TableRow key={activity.id}>
                        <TableCell className="font-medium">{activity.title}</TableCell>
                        <TableCell>${activity.goal.toLocaleString()}</TableCell>
                        <TableCell>${activity.raised.toLocaleString()}</TableCell>
                        <TableCell className="hidden md:table-cell">
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
                                <DropdownMenuItem onSelect={() => handleDelete(activity)} className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    !isLoading && <TableRow><TableCell colSpan={5} className="text-center">No activities found.</TableCell></TableRow>
                )}
                </TableBody>
            </Table>
        </div>
        
        <AlertDialog open={!!activityToDelete} onOpenChange={(open) => !open && setActivityToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the activity titled "{activityToDelete?.title}".
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setActivityToDelete(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
}
