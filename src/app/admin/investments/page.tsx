
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { InvestmentsTable } from '@/components/admin/investments-table';

export default function InvestmentsAdminPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/admin');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading and verifying access...</p>
      </div>
    );
  }

  return (
    <InvestmentsTable />
  );
}
