
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

import type { RealEstateListing } from '@/lib/types';
import { RealEstateForm } from './real-estate-form';
import { Skeleton } from '../ui/skeleton';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

export function RealEstateTable() {
    const firestore = useFirestore();
    const { toast } = useToast();

    const listingsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'real_estate_listings');
    }, [firestore]);

    const { data: listings, isLoading } = useCollection<RealEstateListing>(listingsQuery);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedListing, setSelectedListing] = useState<RealEstateListing | null>(null);
    const [listingToDelete, setListingToDelete] = useState<RealEstateListing | null>(null);

    const handleEdit = (listing: RealEstateListing) => {
        setSelectedListing(listing);
        setDialogOpen(true);
    };
    
    const handleAddNew = () => {
        setSelectedListing(null);
        setDialogOpen(true);
    };

    const handleDelete = (listing: RealEstateListing) => {
        setListingToDelete(listing);
    };

    const confirmDelete = () => {
        if (!listingToDelete || !firestore) return;
        const docRef = doc(firestore, 'real_estate_listings', listingToDelete.id);
        deleteDocumentNonBlocking(docRef);
        toast({ title: "Success", description: "Listing deleted successfully." });
        setListingToDelete(null);
    };

  return (
    <>
        <div className="flex items-center justify-between mb-8">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Real Estate Listings</h2>
                <p className="text-muted-foreground">
                    Manage the real estate listings here.
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
                            {selectedListing ? 'Edit Listing' : 'Add New Listing'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedListing ? 'Update the details for this listing.' : 'Fill in the details for the new listing.'}
                        </DialogDescription>
                    </DialogHeader>
                    <RealEstateForm listing={selectedListing} onFinished={() => setDialogOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Address</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
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
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                        </TableRow>
                    ))
                )}
                {listings && listings.length > 0 ? (
                    listings.map((listing) => (
                    <TableRow key={listing.id}>
                        <TableCell className="font-medium">{listing.address}</TableCell>
                        <TableCell>{listing.propertyType}</TableCell>
                        <TableCell>KES {listing.price.toLocaleString()}</TableCell>
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
                                <DropdownMenuItem onSelect={() => handleEdit(listing)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleDelete(listing)} className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    !isLoading && <TableRow><TableCell colSpan={4} className="text-center">No listings found.</TableCell></TableRow>
                )}
                </TableBody>
            </Table>
        </div>
        
        <AlertDialog open={!!listingToDelete} onOpenChange={(open) => !open && setListingToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the listing at "{listingToDelete?.address}".
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setListingToDelete(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
}
