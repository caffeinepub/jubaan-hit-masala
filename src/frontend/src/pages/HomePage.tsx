import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Package, TrendingUp } from 'lucide-react';
import { useGetAllProducts } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: products, isLoading } = useGetAllProducts();

  const featuredProducts = products?.slice(0, 6) || [];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5">
        <div className="container-custom py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Premium Spices & Masalas
                <span className="block text-primary mt-2">Delivered Across India</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Experience authentic flavors with Jubaan Hit Masala. From traditional garam masala to
                premium basmati rice, we bring quality to your kitchen.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => navigate({ to: '/products' })}>
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Now
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate({ to: '/categories' })}>
                  Browse Categories
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/jubaan-hit-masala-hero.dim_1600x600.png"
                alt="Jubaan Hit Masala Products"
                className="rounded-lg shadow-soft w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-muted/30">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                <Package className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">All India Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Fast and reliable shipping to every corner of India
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">Premium Quality</h3>
              <p className="text-sm text-muted-foreground">
                Sourced from the finest farms across India
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">Easy Ordering</h3>
              <p className="text-sm text-muted-foreground">
                Simple checkout with multiple payment options
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular spices, masalas, and essentials
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-muted/50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.productId.toString()} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link to="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
