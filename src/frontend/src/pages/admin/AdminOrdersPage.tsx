import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useGetAllOrders, useUpdatePaymentStatus } from '../../hooks/useQueries';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import { Eye, Loader2 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import type { Order } from '../../backend';
import { PaymentStatus } from '../../backend';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const { data: orders, isLoading } = useGetAllOrders();
  const updatePaymentMutation = useUpdatePaymentStatus();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<PaymentStatus>(PaymentStatus.pending);

  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.paymentStatus);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      await updatePaymentMutation.mutateAsync({
        orderId: selectedOrder.orderId,
        status: newStatus,
      });
      setSelectedOrder(null);
    } catch (error) {
      console.error('Failed to update payment status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate({ to: '/admin' })} className="mb-2">
          ← Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Manage Orders</h1>
      </div>

      <div className="space-y-4">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <Card key={order.orderId.toString()}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">Order #{order.orderId.toString()}</h3>
                      <OrderStatusBadge status={order.paymentStatus} />
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Customer: {order.customerDetails.name}</p>
                      <p>Phone: {order.customerDetails.phone}</p>
                      <p>
                        Location: {order.customerDetails.city}, {order.customerDetails.state}
                      </p>
                      <p className="font-semibold text-foreground mt-2">
                        Total: ₹{(Number(order.totalAmount) / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => openOrderDetail(order)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No orders yet</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.orderId.toString()}</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Customer Details</h3>
                <div className="text-sm space-y-1">
                  <p>{selectedOrder.customerDetails.name}</p>
                  <p>{selectedOrder.customerDetails.address}</p>
                  <p>
                    {selectedOrder.customerDetails.city}, {selectedOrder.customerDetails.state} -{' '}
                    {selectedOrder.customerDetails.pinCode}
                  </p>
                  <p>Phone: {selectedOrder.customerDetails.phone}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.cartItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>Product ID: {item.productId.toString()}</span>
                      <span>Quantity: {item.quantity.toString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Payment Information</h3>
                <div className="text-sm space-y-1">
                  <p>
                    Method:{' '}
                    {selectedOrder.paymentMethod.__kind__ === 'cashOnDelivery' ? 'Cash on Delivery' : 'UPI'}
                  </p>
                  {selectedOrder.paymentMethod.__kind__ === 'upi' && (
                    <p>UPI Reference: {selectedOrder.paymentMethod.upi.upiId}</p>
                  )}
                  <p className="font-semibold text-lg mt-2">
                    Total: ₹{(Number(selectedOrder.totalAmount) / 100).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <Label>Update Payment Status</Label>
                <RadioGroup value={newStatus} onValueChange={(value) => setNewStatus(value as PaymentStatus)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={PaymentStatus.pending} id="pending" />
                    <Label htmlFor="pending" className="font-normal cursor-pointer">
                      Pending
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={PaymentStatus.paid} id="paid" />
                    <Label htmlFor="paid" className="font-normal cursor-pointer">
                      Paid
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={PaymentStatus.failed} id="failed" />
                    <Label htmlFor="failed" className="font-normal cursor-pointer">
                      Failed
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <DialogFooter>
                <Button
                  onClick={handleUpdateStatus}
                  disabled={updatePaymentMutation.isPending || newStatus === selectedOrder.paymentStatus}
                >
                  {updatePaymentMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Status'
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
