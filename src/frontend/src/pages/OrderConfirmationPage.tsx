import { useParams, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { useTrackOrder } from '../hooks/useQueries';
import { useState, useEffect } from 'react';

export default function OrderConfirmationPage() {
  const params = useParams({ from: '/order-confirmation/$orderId' });
  const navigate = useNavigate();
  const orderId = BigInt(params.orderId);
  const [phone, setPhone] = useState('');

  // Try to get phone from sessionStorage (set during checkout)
  useEffect(() => {
    const storedPhone = sessionStorage.getItem('lastOrderPhone');
    if (storedPhone) {
      setPhone(storedPhone);
    }
  }, []);

  const { data: order } = useTrackOrder(orderId, phone);

  return (
    <div className="container-custom py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
          <CardTitle className="text-3xl">Order Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">Thank you for your order</p>
            <p className="text-2xl font-bold">Order #{orderId.toString()}</p>
          </div>

          {order && (
            <div className="space-y-4 pt-4 border-t">
              <div>
                <h3 className="font-semibold mb-2">Order Details</h3>
                <div className="space-y-1 text-sm">
                  {order.cartItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-muted-foreground">Product ID: {item.productId.toString()}</span>
                      <span>Qty: {item.quantity.toString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total Amount</span>
                <span className="text-primary">₹{(Number(order.totalAmount) / 100).toFixed(2)}</span>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Payment Method:{' '}
                  <span className="font-medium text-foreground">
                    {order.paymentMethod.__kind__ === 'cashOnDelivery' ? 'Cash on Delivery' : 'UPI'}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Payment Status:{' '}
                  <span className="font-medium text-foreground capitalize">{order.paymentStatus}</span>
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3 pt-4">
            <p className="text-sm text-muted-foreground text-center">
              Save your order number to track your delivery
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => navigate({ to: '/track-order' })}>
                Track Order
              </Button>
              <Button className="flex-1" onClick={() => navigate({ to: '/' })}>
                Continue Shopping
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
