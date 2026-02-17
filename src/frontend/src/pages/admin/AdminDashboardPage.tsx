import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, LayoutGrid } from 'lucide-react';
import { useGetCallerUserProfile, useGetAllOrders, useGetAllProducts } from '../../hooks/useQueries';
import LoginButton from '../../components/auth/LoginButton';

export default function AdminDashboardPage() {
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: orders } = useGetAllOrders();
  const { data: products } = useGetAllProducts();

  return (
    <div className="container-custom py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          {userProfile && <p className="text-muted-foreground">Welcome back, {userProfile.name}</p>}
        </div>
        <LoginButton />
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <LayoutGrid className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders?.filter((o) => o.paymentStatus === 'pending').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link to="/admin/catalog">
          <Card className="cursor-pointer hover:shadow-soft transition-all hover:border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Manage Catalog
              </CardTitle>
              <CardDescription>Add, edit, and manage products and categories</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/orders">
          <Card className="cursor-pointer hover:shadow-soft transition-all hover:border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Manage Orders
              </CardTitle>
              <CardDescription>View and update order status and payments</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
