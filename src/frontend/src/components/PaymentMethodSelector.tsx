import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import type { PaymentMethod } from '../backend';
import { useState } from 'react';

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export default function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  const [upiId, setUpiId] = useState('');

  const handleMethodChange = (methodType: string) => {
    if (methodType === 'cod') {
      onChange({ __kind__: 'cashOnDelivery', cashOnDelivery: null });
    } else if (methodType === 'upi') {
      onChange({ __kind__: 'upi', upi: { upiId: upiId } });
    }
  };

  const handleUpiIdChange = (newUpiId: string) => {
    setUpiId(newUpiId);
    if (value.__kind__ === 'upi') {
      onChange({ __kind__: 'upi', upi: { upiId: newUpiId } });
    }
  };

  const selectedMethod = value.__kind__ === 'cashOnDelivery' ? 'cod' : 'upi';

  return (
    <div className="space-y-4">
      <RadioGroup value={selectedMethod} onValueChange={handleMethodChange}>
        <Card className={selectedMethod === 'cod' ? 'border-primary' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod" className="flex-1 cursor-pointer">
                <div>
                  <p className="font-semibold">Cash on Delivery</p>
                  <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                </div>
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card className={selectedMethod === 'upi' ? 'border-primary' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <RadioGroupItem value="upi" id="upi" />
              <Label htmlFor="upi" className="flex-1 cursor-pointer">
                <div>
                  <p className="font-semibold">UPI Payment (Manual)</p>
                  <p className="text-sm text-muted-foreground">Pay via UPI and enter payment reference</p>
                </div>
              </Label>
            </div>

            {selectedMethod === 'upi' && (
              <div className="ml-7 space-y-2">
                <Label htmlFor="upiId" className="text-sm">
                  UPI Payment Reference / UTR Number
                </Label>
                <Input
                  id="upiId"
                  placeholder="Enter payment reference or UTR"
                  value={upiId}
                  onChange={(e) => handleUpiIdChange(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Please complete your UPI payment and enter the transaction reference number above
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </RadioGroup>
    </div>
  );
}
