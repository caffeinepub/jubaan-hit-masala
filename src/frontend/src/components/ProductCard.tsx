import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '../backend';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const priceInRupees = Number(product.price) / 100;

  return (
    <Card
      className="overflow-hidden hover:shadow-soft transition-all cursor-pointer group"
      onClick={() => navigate({ to: '/product/$productId', params: { productId: product.productId.toString() } })}
    >
      <div className="aspect-square bg-muted/30 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <ShoppingCart className="h-16 w-16 text-muted-foreground/30" />
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-primary">₹{priceInRupees.toFixed(2)}</p>
          {product.inStock ? (
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              In Stock
            </Badge>
          ) : (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          disabled={!product.inStock}
          onClick={(e) => {
            e.stopPropagation();
            navigate({ to: '/product/$productId', params: { productId: product.productId.toString() } });
          }}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
