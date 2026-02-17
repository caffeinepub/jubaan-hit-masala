import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetCategories } from '../hooks/useQueries';
import { ChevronRight } from 'lucide-react';

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { data: categories, isLoading } = useGetCategories();

  if (isLoading) {
    return (
      <div className="container-custom py-12">
        <h1 className="text-3xl font-bold mb-8">Browse Categories</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-muted/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Browse Categories</h1>
        <p className="text-muted-foreground">
          Explore our wide range of spices, masalas, and kitchen essentials
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories?.map((category) => (
          <Card
            key={category.categoryId.toString()}
            className="cursor-pointer hover:shadow-soft transition-all hover:border-primary/50 group"
            onClick={() =>
              navigate({ to: '/products/category/$categoryId', params: { categoryId: category.categoryId.toString() } })
            }
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {category.name}
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
