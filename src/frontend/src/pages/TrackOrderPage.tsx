import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTrackOrder } from '../hooks/useQueries';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { Package } from 'lucide-react';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const orderIdBigInt = orderId ? BigInt(orderId) : BigInt(0);
  const { data: order, isLoading, error } = useTrackOrder(orderIdBigInt, phone, submitted);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container-custom py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Track Your Order</h1>

        <Card>
          <CardHeader>
            <CardTitle>Enter Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orderId">Order ID</Label>
                <Input
                  id="orderId"
                  type="number"
                  placeholder="Enter your order number"
                  value={orderId}
                  onChange={(e) => {
                    setOrderId(e.target.value);
                    setSubmitted(false);
                  }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setSubmitted(false);
                  }}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Track Order'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {submitted && !isLoading && (
          <Card className="mt-6">
            {order ? (
              <>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Order #{orderId}</CardTitle>
                    <OrderStatusBadge status={order.paymentStatus} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Delivery Information</h3>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <p>{order.customerDetails.name}</p>
                      <p>{order.customerDetails.address}</p>
                      <p>
                        {order.customerDetails.city}, {order.customerDetails.state} - {order.customerDetails.pinCode}
                      </p>
                      <p>Phone: {order.customerDetails.phone}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-2">Order Items</h3>
                    <div className="space-y-2">
                      {order.cartItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Product ID: {item.productId.toString()}</span>
                          <span>Quantity: {item.quantity.toString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Payment Method</span>
                      <span className="font-medium">
                        {order.paymentMethod.__kind__ === 'cashOnDelivery' ? 'Cash on Delivery' : 'UPI'}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount</span>
                      <span className="text-primary">₹{(Number(order.totalAmount) / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  Order not found. Please check your order ID and phone number.
                </p>
              </CardContent>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
