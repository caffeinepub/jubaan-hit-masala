import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    categoryId: CategoryId;
    inStock: boolean;
    name: string;
    description: string;
    productId: ProductId;
    imageUrl?: string;
    price: bigint;
}
export interface CustomerDetails {
    city: string;
    name: string;
    state: string;
    address: string;
    pinCode: string;
    phone: string;
}
export interface Category {
    categoryId: CategoryId;
    name: string;
    description: string;
}
export type PaymentMethod = {
    __kind__: "upi";
    upi: {
        upiId: string;
    };
} | {
    __kind__: "cashOnDelivery";
    cashOnDelivery: null;
};
export type CategoryId = bigint;
export type ProductId = bigint;
export interface CartItem {
    productId: ProductId;
    quantity: bigint;
}
export interface Order {
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    orderId: OrderId;
    cartItems: Array<CartItem>;
    totalAmount: bigint;
    customerDetails: CustomerDetails;
}
export type OrderId = bigint;
export interface UserProfile {
    city?: string;
    name: string;
    state?: string;
    address?: string;
    pinCode?: string;
    phone?: string;
}
export enum PaymentStatus {
    pending = "pending",
    paid = "paid",
    failed = "failed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCategory(name: string, description: string): Promise<void>;
    addProduct(name: string, price: bigint, description: string, imageUrl: string | null, categoryId: CategoryId, inStock: boolean): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategories(): Promise<Array<Category>>;
    getOrder(orderId: OrderId): Promise<Order | null>;
    getProduct(productId: ProductId): Promise<Product | null>;
    getProductsByCategory(categoryId: CategoryId): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markOrderAsPaid(orderId: OrderId): Promise<void>;
    placeOrder(cartItems: Array<CartItem>, customerDetails: CustomerDetails, paymentMethod: PaymentMethod): Promise<OrderId>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedDemoData(): Promise<void>;
    trackOrder(orderId: OrderId, phone: string): Promise<Order | null>;
    updateCategory(categoryId: CategoryId, name: string, description: string): Promise<void>;
    updatePaymentStatus(orderId: OrderId, status: PaymentStatus): Promise<void>;
    updateProduct(productId: ProductId, name: string, price: bigint, description: string, imageUrl: string | null, categoryId: CategoryId, inStock: boolean): Promise<void>;
}
