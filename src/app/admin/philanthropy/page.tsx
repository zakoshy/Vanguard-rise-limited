
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
    <div>
        <Card>
            <CardHeader>
                <CardTitle>Manage Philanthropic Activities</CardTitle>
                <CardDescription>
                    This section is under construction. Soon you'll be able to add, edit, and delete philanthropic initiatives.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>Philanthropy management functionality will be implemented here.</p>
            </CardContent>
        </Card>
    </div>
  );
}
