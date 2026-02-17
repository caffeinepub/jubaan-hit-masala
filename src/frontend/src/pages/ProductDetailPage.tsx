import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetProduct } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../state/cartStore';

export default function ProductDetailPage() {
  const params = useParams({ from: '/product/$productId' });
  const navigate = useNavigate();
  const productId = BigInt(params.productId);
  const { data: product, isLoading } = useGetProduct(productId);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      navigate({ to: '/cart' });
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="aspect-square bg-muted/50 rounded-lg animate-pulse" />
            <div className="space-y-4">
              <div className="h-10 bg-muted/50 rounded animate-pulse" />
              <div className="h-6 bg-muted/50 rounded animate-pulse w-1/3" />
              <div className="h-24 bg-muted/50 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => navigate({ to: '/products' })}>Browse Products</Button>
        </div>
      </div>
    );
  }

  const priceInRupees = Number(product.price) / 100;

  return (
    <div className="container-custom py-12">
      <Button variant="ghost" onClick={() => navigate({ to: '/products' })} className="mb-6">
        ← Back to Products
      </Button>

      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center overflow-hidden">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-8">
                <ShoppingCart className="h-24 w-24 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No image available</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{product.name}</h1>
              <div className="flex items-center gap-3 mb-4">
                <p className="text-3xl font-bold text-primary">₹{priceInRupees.toFixed(2)}</p>
                {product.inStock ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </CardContent>
            </Card>

            {product.inStock && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= 99}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button size="lg" className="w-full" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
