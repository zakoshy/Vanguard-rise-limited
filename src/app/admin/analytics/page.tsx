'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AnalyticsDashboard } from '@/components/admin/analytics-dashboard';

export default function AnalyticsAdminPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading analytics data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Website Analytics</h2>
        <p className="text-muted-foreground">
          Monitor how people are interacting with your website.
        </p>
      </div>
      <AnalyticsDashboard />
    </div>
  );
}
