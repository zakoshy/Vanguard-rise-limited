
'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Building, Heart, Home as HomeIcon, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import type { 
  ProjectManagementSuccessStory, 
  InvestmentProject, 
  RealEstateListing, 
  PhilanthropicActivity 
} from '@/lib/types';

function DashboardStatCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  colorClass 
}: { 
  title: string; 
  value: string | number; 
  description: string; 
  icon: any; 
  colorClass: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${colorClass}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function SectionPreview({ 
  title, 
  items, 
  isLoading, 
  href, 
  renderItem 
}: { 
  title: string; 
  items: any[] | null; 
  isLoading: boolean; 
  href: string;
  renderItem: (item: any) => React.ReactNode;
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-headline">{title}</CardTitle>
          <Button variant="ghost" size="sm" asChild className="h-8 px-2">
            <Link href={href} className="text-xs flex items-center">
              Manage <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : items && items.length > 0 ? (
          <ul className="divide-y text-sm">
            {items.slice(0, 3).map((item, i) => (
              <li key={item.id || i} className="py-3 first:pt-0 last:pb-0">
                {renderItem(item)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground italic">No items found.</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  // Queries
  const storiesQuery = useMemoFirebase(() => collection(firestore, 'project_management_success_stories'), [firestore]);
  const investmentsQuery = useMemoFirebase(() => collection(firestore, 'investment_projects'), [firestore]);
  const listingsQuery = useMemoFirebase(() => collection(firestore, 'real_estate_listings'), [firestore]);
  const philanthropyQuery = useMemoFirebase(() => collection(firestore, 'philanthropic_activities'), [firestore]);

  // Collection Data
  const { data: stories, isLoading: loadingStories } = useCollection<ProjectManagementSuccessStory>(storiesQuery);
  const { data: investments, isLoading: loadingInvestments } = useCollection<InvestmentProject>(investmentsQuery);
  const { data: listings, isLoading: loadingListings } = useCollection<RealEstateListing>(listingsQuery);
  const { data: philanthropy, isLoading: loadingPhilanthropy } = useCollection<PhilanthropicActivity>(philanthropyQuery);

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full text-center">
        <p className="text-muted-foreground animate-pulse font-headline">Verifying session...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-full h-full w-full bg-secondary/10 px-4 py-20">
        <div className="max-w-md w-full">
          <LoginForm />
        </div>
      </div>
    );
  }

  // Calculated Stats
  const totalInvestmentValue = investments?.reduce((acc, curr) => acc + (curr.investmentValue || 0), 0) || 0;
  const availableListings = listings?.filter(l => l.status === 'Available').length || 0;
  const totalRaised = philanthropy?.reduce((acc, curr) => acc + (curr.raised || 0), 0) || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.email}. Here's an overview of your website content.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard 
          title="Success Stories" 
          value={stories?.length || 0} 
          description="Total case studies" 
          icon={Briefcase} 
          colorClass="text-blue-500"
        />
        <DashboardStatCard 
          title="Portfolio Value" 
          value={`$${(totalInvestmentValue / 1000000).toFixed(1)}M`} 
          description="Total investment value" 
          icon={TrendingUp} 
          colorClass="text-green-500"
        />
        <DashboardStatCard 
          title="Properties" 
          value={availableListings} 
          description="Currently available" 
          icon={HomeIcon} 
          colorClass="text-orange-500"
        />
        <DashboardStatCard 
          title="Donations" 
          value={`$${totalRaised.toLocaleString()}`} 
          description="Total raised for charity" 
          icon={Heart} 
          colorClass="text-red-500"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SectionPreview 
          title="Recent Success Stories" 
          items={stories} 
          isLoading={loadingStories} 
          href="/admin/success-stories"
          renderItem={(item: ProjectManagementSuccessStory) => (
            <div className="flex flex-col">
              <span className="font-semibold text-foreground line-clamp-1">{item.title}</span>
              <span className="text-xs text-muted-foreground">{item.category}</span>
            </div>
          )}
        />

        <SectionPreview 
          title="Recent Investments" 
          items={investments} 
          isLoading={loadingInvestments} 
          href="/admin/investments"
          renderItem={(item: InvestmentProject) => (
            <div className="flex justify-between items-center">
              <span className="font-semibold text-foreground line-clamp-1">{item.name}</span>
              <span className="text-xs font-mono font-bold text-green-600">${(item.investmentValue || 0).toLocaleString()}</span>
            </div>
          )}
        />

        <SectionPreview 
          title="Real Estate Inventory" 
          items={listings} 
          isLoading={loadingListings} 
          href="/admin/real-estate"
          renderItem={(item: RealEstateListing) => (
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="font-semibold text-foreground line-clamp-1">{item.address}</span>
                <span className="text-xs text-muted-foreground">{item.propertyType}</span>
              </div>
              <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${item.status === 'Sold' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {item.status}
              </span>
            </div>
          )}
        />

        <SectionPreview 
          title="Philanthropy Status" 
          items={philanthropy} 
          isLoading={loadingPhilanthropy} 
          href="/admin/philanthropy"
          renderItem={(item: PhilanthropicActivity) => (
            <div className="flex flex-col space-y-1">
              <div className="flex justify-between">
                <span className="font-semibold text-foreground line-clamp-1">{item.title}</span>
                <span className="text-xs font-bold">${(item.raised || 0).toLocaleString()}</span>
              </div>
              <div className="w-full bg-secondary h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all" 
                  style={{ width: `${Math.min(((item.raised || 0) / (item.goal || 1)) * 100, 100)}%` }} 
                />
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
