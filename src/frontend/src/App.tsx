import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import TrackOrderPage from './pages/TrackOrderPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminCatalogPage from './pages/admin/AdminCatalogPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminGate from './components/admin/AdminGate';
import { CartProvider } from './state/cartStore';

const rootRoute = createRootRoute({
  component: () => (
    <CartProvider>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </CartProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const categoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/categories',
  component: CategoriesPage,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductsPage,
});

const productsByCategoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/category/$categoryId',
  component: ProductsPage,
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$productId',
  component: ProductDetailPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order-confirmation/$orderId',
  component: OrderConfirmationPage,
});

const trackOrderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/track-order',
  component: TrackOrderPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminGate>
      <Outlet />
    </AdminGate>
  ),
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/',
  component: AdminDashboardPage,
});

const adminCatalogRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/catalog',
  component: AdminCatalogPage,
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/orders',
  component: AdminOrdersPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  categoriesRoute,
  productsRoute,
  productsByCategoryRoute,
  productDetailRoute,
  cartRoute,
  checkoutRoute,
  orderConfirmationRoute,
  trackOrderRoute,
  adminRoute.addChildren([adminDashboardRoute, adminCatalogRoute, adminOrdersRoute]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
