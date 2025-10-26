
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PhilanthropyTable } from '@/components/admin/philanthropy-table';

export default function PhilanthropyAdminPage() {
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
    <PhilanthropyTable />
  );
}
