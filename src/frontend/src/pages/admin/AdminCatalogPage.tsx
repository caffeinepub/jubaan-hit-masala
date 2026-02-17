import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useGetCategories,
  useGetAllProducts,
  useAddCategory,
  useAddProduct,
  useUpdateProduct,
  useSeedDemoData,
} from '../../hooks/useQueries';
import { Plus, Edit, Loader2 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function AdminCatalogPage() {
  const navigate = useNavigate();
  const { data: categories } = useGetCategories();
  const { data: products } = useGetAllProducts();
  const addCategoryMutation = useAddCategory();
  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct();
  const seedDemoDataMutation = useSeedDemoData();

  const [categoryDialog, setCategoryDialog] = useState(false);
  const [productDialog, setProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    categoryId: '',
    inStock: true,
  });

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCategoryMutation.mutateAsync(categoryForm);
      setCategoryForm({ name: '', description: '' });
      setCategoryDialog(false);
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceInPaise = Math.round(parseFloat(productForm.price) * 100);

    try {
      if (editingProduct) {
        await updateProductMutation.mutateAsync({
          productId: editingProduct.productId,
          name: productForm.name,
          price: BigInt(priceInPaise),
          description: productForm.description,
          imageUrl: productForm.imageUrl || null,
          categoryId: BigInt(productForm.categoryId),
          inStock: productForm.inStock,
        });
      } else {
        await addProductMutation.mutateAsync({
          name: productForm.name,
          price: BigInt(priceInPaise),
          description: productForm.description,
          imageUrl: productForm.imageUrl || null,
          categoryId: BigInt(productForm.categoryId),
          inStock: productForm.inStock,
        });
      }
      setProductForm({ name: '', price: '', description: '', imageUrl: '', categoryId: '', inStock: true });
      setEditingProduct(null);
      setProductDialog(false);
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const openEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: (Number(product.price) / 100).toString(),
      description: product.description,
      imageUrl: product.imageUrl || '',
      categoryId: product.categoryId.toString(),
      inStock: product.inStock,
    });
    setProductDialog(true);
  };

  return (
    <div className="container-custom py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button variant="ghost" onClick={() => navigate({ to: '/admin' })} className="mb-2">
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Manage Catalog</h1>
        </div>
        <Button
          variant="outline"
          onClick={() => seedDemoDataMutation.mutate()}
          disabled={seedDemoDataMutation.isPending}
        >
          {seedDemoDataMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Seeding...
            </>
          ) : (
            'Seed Demo Data'
          )}
        </Button>
      </div>

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={productDialog} onOpenChange={setProductDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingProduct(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="productName">Product Name *</Label>
                      <Input
                        id="productName"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (₹) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL (optional)</Label>
                    <Input
                      id="imageUrl"
                      value={productForm.imageUrl}
                      onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={productForm.categoryId}
                        onValueChange={(value) => setProductForm({ ...productForm, categoryId: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((cat) => (
                            <SelectItem key={cat.categoryId.toString()} value={cat.categoryId.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inStock">In Stock</Label>
                      <div className="flex items-center space-x-2 pt-2">
                        <Switch
                          id="inStock"
                          checked={productForm.inStock}
                          onCheckedChange={(checked) => setProductForm({ ...productForm, inStock: checked })}
                        />
                        <Label htmlFor="inStock" className="font-normal">
                          {productForm.inStock ? 'Available' : 'Out of Stock'}
                        </Label>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={addProductMutation.isPending || updateProductMutation.isPending}
                    >
                      {(addProductMutation.isPending || updateProductMutation.isPending) ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : editingProduct ? (
                        'Update Product'
                      ) : (
                        'Add Product'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {products?.map((product) => (
              <Card key={product.productId.toString()}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-semibold text-primary">
                          ₹{(Number(product.price) / 100).toFixed(2)}
                        </span>
                        <span className={product.inStock ? 'text-green-600' : 'text-destructive'}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => openEditProduct(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={categoryDialog} onOpenChange={setCategoryDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryName">Category Name *</Label>
                    <Input
                      id="categoryName"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoryDescription">Description *</Label>
                    <Textarea
                      id="categoryDescription"
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={addCategoryMutation.isPending}>
                      {addCategoryMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        'Add Category'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories?.map((category) => (
              <Card key={category.categoryId.toString()}>
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
