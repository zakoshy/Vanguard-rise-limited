
'use client';

import { SuccessStoriesTable } from '@/components/admin/success-stories-table';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SuccessStoriesAdminPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/admin');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="container py-16 md:py-24 text-center">
        <p>Loading and verifying access...</p>
      </div>
    );
  }

  return (
    <div className="container py-16 md:py-24">
        <Button variant="outline" asChild className="mb-8">
            <Link href="/admin"><ArrowLeft className="mr-2 h-4 w-4" />Back to Admin</Link>
        </Button>
      <SuccessStoriesTable />
    </div>
  );
}
