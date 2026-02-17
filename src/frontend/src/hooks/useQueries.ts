import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  Product,
  Category,
  Order,
  CartItem,
  CustomerDetails,
  PaymentMethod,
  PaymentStatus,
  UserProfile,
  ProductId,
  CategoryId,
  OrderId,
} from '../backend';

// Categories
export function useGetCategories() {
  const { actor, isFetching } = useActor();

  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, description }: { name: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCategory(name, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

// Products
export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProductsByCategory(categoryId: CategoryId | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'category', categoryId?.toString()],
    queryFn: async () => {
      if (!actor || !categoryId) return [];
      return actor.getProductsByCategory(categoryId);
    },
    enabled: !!actor && !isFetching && categoryId !== null,
  });
}

export function useGetProduct(productId: ProductId) {
  const { actor, isFetching } = useActor();

  return useQuery<Product | null>({
    queryKey: ['product', productId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProduct(productId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: {
      name: string;
      price: bigint;
      description: string;
      imageUrl: string | null;
      categoryId: CategoryId;
      inStock: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProduct(
        product.name,
        product.price,
        product.description,
        product.imageUrl,
        product.categoryId,
        product.inStock
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: {
      productId: ProductId;
      name: string;
      price: bigint;
      description: string;
      imageUrl: string | null;
      categoryId: CategoryId;
      inStock: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProduct(
        product.productId,
        product.name,
        product.price,
        product.description,
        product.imageUrl,
        product.categoryId,
        product.inStock
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Orders
export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cartItems,
      customerDetails,
      paymentMethod,
    }: {
      cartItems: CartItem[];
      customerDetails: CustomerDetails;
      paymentMethod: PaymentMethod;
    }) => {
      if (!actor) throw new Error('Actor not available');
      // Store phone in session for order confirmation page
      sessionStorage.setItem('lastOrderPhone', customerDetails.phone);
      return actor.placeOrder(cartItems, customerDetails, paymentMethod);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useTrackOrder(orderId: OrderId, phone: string, enabled: boolean = true) {
  const { actor, isFetching } = useActor();

  return useQuery<Order | null>({
    queryKey: ['order', 'track', orderId.toString(), phone],
    queryFn: async () => {
      if (!actor || !phone) return null;
      return actor.trackOrder(orderId, phone);
    },
    enabled: !!actor && !isFetching && enabled && !!phone && orderId > 0,
  });
}

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['orders', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdatePaymentStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: OrderId; status: PaymentStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePaymentStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSeedDemoData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.seedDemoData();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
