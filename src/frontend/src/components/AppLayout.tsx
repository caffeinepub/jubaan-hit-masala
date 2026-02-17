import { ReactNode } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingCart, Package, Search, Menu, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '../state/cartStore';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { items } = useCart();
  const navigate = useNavigate();
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Categories', path: '/categories' },
    { label: 'Products', path: '/products' },
    { label: 'Track Order', path: '/track-order' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-3">
                <img
                  src="/assets/generated/jubaan-hit-masala-logo.dim_512x512.png"
                  alt="Jubaan Hit Masala"
                  className="h-10 w-10 object-contain"
                />
                <span className="font-display text-xl font-bold text-primary">
                  Jubaan Hit Masala
                </span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                    activeProps={{ className: 'text-primary' }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate({ to: '/cart' })}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-semibold">
                    {cartItemCount}
                  </span>
                )}
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <nav className="flex flex-col gap-4 mt-8">
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className="text-base font-medium text-foreground/80 hover:text-primary transition-colors py-2"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-muted/30 mt-auto">
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-3">Jubaan Hit Masala</h3>
              <p className="text-sm text-muted-foreground">
                Premium spices and masalas delivered across India
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/categories" className="text-muted-foreground hover:text-primary">
                    Browse Categories
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="text-muted-foreground hover:text-primary">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link to="/track-order" className="text-muted-foreground hover:text-primary">
                    Track Your Order
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Contact</h3>
              <p className="text-sm text-muted-foreground">
                All India Delivery Available
              </p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Jubaan Hit Masala. Built with{' '}
              <Heart className="inline h-4 w-4 text-accent fill-accent" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  window.location.hostname
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
