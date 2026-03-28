
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bar, 
  BarChart, 
  Line, 
  LineChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";
import { Users, Eye, MousePointer2, TrendingUp, Loader2 } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase, useDoc } from "@/firebase";
import { collection, doc } from "firebase/firestore";

export function AnalyticsDashboard() {
  const firestore = useFirestore();

  // Fetch collections to get actual counts
  const storiesQuery = useMemoFirebase(() => collection(firestore, 'project_management_success_stories'), [firestore]);
  const investmentsQuery = useMemoFirebase(() => collection(firestore, 'investment_projects'), [firestore]);
  const listingsQuery = useMemoFirebase(() => collection(firestore, 'real_estate_listings'), [firestore]);
  const philanthropyQuery = useMemoFirebase(() => collection(firestore, 'philanthropic_activities'), [firestore]);

  const { data: stories } = useCollection(storiesQuery);
  const { data: investments } = useCollection(investmentsQuery);
  const { data: listings } = useCollection(listingsQuery);
  const { data: philanthropy } = useCollection(philanthropyQuery);

  // Fetch aggregated site stats
  const statsDocRef = useMemoFirebase(() => doc(firestore, 'site_analytics', 'summary'), [firestore]);
  const { data: stats, isLoading: statsLoading } = useDoc(statsDocRef);

  const interactionData = [
    { name: "Success Stories", count: stories?.length || 0 },
    { name: "Investments", count: investments?.length || 0 },
    { name: "Real Estate", count: listings?.length || 0 },
    { name: "Philanthropy", count: philanthropy?.length || 0 },
  ];

  // Fallback for chart data if site_analytics isn't populated yet
  const visitData = stats?.dailyVisits || [
    { name: "Mon", visits: 0 },
    { name: "Tue", visits: 0 },
    { name: "Wed", visits: 0 },
    { name: "Thu", visits: 0 },
    { name: "Fri", visits: 0 },
    { name: "Sat", visits: 0 },
    { name: "Sun", visits: 0 },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {statsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (stats?.totalVisitors || 0).toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">Unique site visits</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Page Views</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {statsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (stats?.totalPageViews || 0).toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">Total views across all pages</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Content</CardTitle>
          <MousePointer2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(stories?.length || 0) + (investments?.length || 0) + (listings?.length || 0) + (philanthropy?.length || 0)}
          </div>
          <p className="text-xs text-muted-foreground">Total published items</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Growth</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {investments && investments.length > 0 ? `+${investments.length}` : '0'}
          </div>
          <p className="text-xs text-muted-foreground">New projects this period</p>
        </CardContent>
      </Card>

      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Daily Traffic</CardTitle>
          <CardDescription>Number of visits per day over the last week.</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  itemStyle={{ color: 'hsl(var(--primary))' }}
                />
                <Line type="monotone" dataKey="visits" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Content Summary</CardTitle>
          <CardDescription>Total count of items per category.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={interactionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                   contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                   itemStyle={{ color: 'hsl(var(--primary))' }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
