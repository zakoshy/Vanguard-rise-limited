
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <div className="container py-16 md:py-24">
      <Card>
        <CardHeader>
          <CardTitle>Admin Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome to the admin panel. Content management features will be added here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
