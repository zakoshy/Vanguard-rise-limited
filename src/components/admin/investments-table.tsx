
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

import type { InvestmentProject } from '@/lib/types';
import { InvestmentForm } from './investment-form';
import { Skeleton } from '../ui/skeleton';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

export function InvestmentsTable() {
    const firestore = useFirestore();
    const { toast } = useToast();

    const projectsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'investment_projects');
    }, [firestore]);

    const { data: projects, isLoading } = useCollection<InvestmentProject>(projectsQuery);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<InvestmentProject | null>(null);
    const [projectToDelete, setProjectToDelete] = useState<InvestmentProject | null>(null);

    const handleEdit = (project: InvestmentProject) => {
        setSelectedProject(project);
        setDialogOpen(true);
    };
    
    const handleAddNew = () => {
        setSelectedProject(null);
        setDialogOpen(true);
    };

    const handleDelete = (project: InvestmentProject) => {
        setProjectToDelete(project);
    };

    const confirmDelete = () => {
        if (!projectToDelete || !firestore) return;
        const docRef = doc(firestore, 'investment_projects', projectToDelete.id);
        deleteDocumentNonBlocking(docRef);
        toast({ title: "Success", description: "Project deleted successfully." });
        setProjectToDelete(null);
    };

  return (
    <>
        <div className="flex items-center justify-between mb-8">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Investment Projects</h2>
                <p className="text-muted-foreground">
                    Manage the investment projects here.
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
                            {selectedProject ? 'Edit Project' : 'Add New Project'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedProject ? 'Update the details for this project.' : 'Fill in the details for the new project.'}
                        </DialogDescription>
                    </DialogHeader>
                    <InvestmentForm project={selectedProject} onFinished={() => setDialogOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Investment Value</TableHead>
                    <TableHead className="hidden md:table-cell">Start Date</TableHead>
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
                {projects && projects.length > 0 ? (
                    projects.map((project) => (
                    <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>${project.investmentValue.toLocaleString()}</TableCell>
                        <TableCell className="hidden md:table-cell">
                        {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}
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
                                <DropdownMenuItem onSelect={() => handleEdit(project)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleDelete(project)} className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    !isLoading && <TableRow><TableCell colSpan={4} className="text-center">No projects found.</TableCell></TableRow>
                )}
                </TableBody>
            </Table>
        </div>
        
        <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the project titled "{projectToDelete?.name}".
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setProjectToDelete(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
}
