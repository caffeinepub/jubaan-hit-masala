import { Badge } from '@/components/ui/badge';
import { PaymentStatus } from '../backend';

interface OrderStatusBadgeProps {
  status: PaymentStatus;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusConfig = {
    [PaymentStatus.pending]: {
      label: 'Pending',
      variant: 'secondary' as const,
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    },
    [PaymentStatus.paid]: {
      label: 'Paid',
      variant: 'secondary' as const,
      className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    },
    [PaymentStatus.failed]: {
      label: 'Failed',
      variant: 'destructive' as const,
      className: '',
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}
