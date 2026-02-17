import { useParams } from '@tanstack/react-router';
import { useGetAllProducts, useGetProductsByCategory, useGetCategories } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

export default function ProductsPage() {
  const params = useParams({ strict: false });
  const navigate = useNavigate();
  const categoryId = params.categoryId ? BigInt(params.categoryId) : null;

  const { data: allProducts, isLoading: loadingAll } = useGetAllProducts();
  const { data: categoryProducts, isLoading: loadingCategory } = useGetProductsByCategory(categoryId);
  const { data: categories } = useGetCategories();

  const products = categoryId ? categoryProducts : allProducts;
  const isLoading = categoryId ? loadingCategory : loadingAll;

  const currentCategory = categories?.find((c) => c.categoryId === categoryId);

  return (
    <div className="container-custom py-12">
      <div className="mb-8">
        {categoryId && (
          <Button variant="ghost" onClick={() => navigate({ to: '/categories' })} className="mb-4">
            ← Back to Categories
          </Button>
        )}
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          {currentCategory ? currentCategory.name : 'All Products'}
        </h1>
        <p className="text-muted-foreground">
          {currentCategory ? currentCategory.description : 'Browse our complete collection of spices and masalas'}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-96 bg-muted/50 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.productId.toString()} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">No products found in this category.</p>
        </div>
      )}
    </div>
  );
}
