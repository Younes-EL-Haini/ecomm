import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="p-8 space-y-6 w-full">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>—</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>—</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>—</CardContent>
        </Card>
      </div>
    </div>
  );
}
