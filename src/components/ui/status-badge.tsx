import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { ProductStatus } from '@/types/product';
import { OrderStatus } from '@/types/order';

interface StatusBadgeProps {
  status: ProductStatus | OrderStatus | string;
  showIcon?: boolean;
  className?: string;
}

const getStatusConfig = (status: string) => {
  const configs = {
    // Product statuses
    'pending-review': {
      label: 'Pending Review',
      variant: 'secondary' as const,
      className: 'bg-warning text-warning-foreground',
      icon: Clock
    },
    'approved': {
      label: 'Approved',
      variant: 'secondary' as const,
      className: 'bg-success-subtle text-success',
      icon: CheckCircle
    },
    'rejected': {
      label: 'Rejected',
      variant: 'destructive' as const,
      className: 'bg-destructive text-destructive-foreground',
      icon: XCircle
    },
    'syncing': {
      label: 'Syncing',
      variant: 'secondary' as const,
      className: 'bg-o2-blue text-white',
      icon: Loader2
    },
    'synced': {
      label: 'Synced to Herakles',
      variant: 'secondary' as const,
      className: 'bg-success text-success-foreground',
      icon: CheckCircle
    },
    'sync-failed': {
      label: 'Sync Failed',
      variant: 'destructive' as const,
      className: 'bg-destructive text-destructive-foreground',
      icon: AlertCircle
    },
    // Order statuses
    'new': {
      label: 'New',
      variant: 'secondary' as const,
      className: 'bg-o2-blue text-white',
      icon: Clock
    },
    'processing': {
      label: 'Processing',
      variant: 'secondary' as const,
      className: 'bg-warning text-warning-foreground',
      icon: Loader2
    },
    'fulfilled': {
      label: 'Fulfilled',
      variant: 'secondary' as const,
      className: 'bg-success text-success-foreground',
      icon: CheckCircle
    },
    'cancelled': {
      label: 'Cancelled',
      variant: 'destructive' as const,
      className: 'bg-destructive text-destructive-foreground',
      icon: XCircle
    },
    // Payout statuses
    'pending': {
      label: 'Pending',
      variant: 'secondary' as const,
      className: 'bg-warning text-warning-foreground',
      icon: Clock
    },
    'paid': {
      label: 'Paid',
      variant: 'secondary' as const,
      className: 'bg-success text-success-foreground',
      icon: CheckCircle
    }
  };

  return configs[status as keyof typeof configs] || {
    label: status,
    variant: 'secondary' as const,
    className: '',
    icon: AlertCircle
  };
};

export function StatusBadge({ status, showIcon = true, className }: StatusBadgeProps) {
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant}
      className={`${config.className} ${className || ''}`}
    >
      {showIcon && (
        <Icon 
          className={`w-3 h-3 mr-1 ${status === 'syncing' || status === 'processing' ? 'animate-spin' : ''}`} 
        />
      )}
      {config.label}
    </Badge>
  );
}