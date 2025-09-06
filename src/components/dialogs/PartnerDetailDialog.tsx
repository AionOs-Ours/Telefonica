import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Partner } from '@/types/partner';
import { StatusBadge } from '@/components/ui/status-badge';
import { 
  Building2, 
  Mail, 
  Calendar, 
  DollarSign, 
  ShoppingCart, 
  Percent,
  TrendingUp,
  Users
} from 'lucide-react';

interface PartnerDetailDialogProps {
  partner: Partner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PartnerDetailDialog({ partner, open, onOpenChange }: PartnerDetailDialogProps) {
  if (!partner) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-o2-blue" />
            Partner Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Partner Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{partner.companyName}</h3>
                <p className="text-sm text-muted-foreground">ID: {partner.id}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Contact:</span>
                  <span className="text-sm text-foreground">{partner.name}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-foreground">{partner.email}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Type:</span>
                  <Badge variant="outline" className="capitalize">
                    {partner.partnerType}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Joined:</span>
                  <span className="text-sm text-foreground">{formatDate(partner.createdAt)}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-muted-foreground">Status:</span>
                <StatusBadge status={partner.status} />
              </div>
              
              <div className="flex items-center space-x-2">
                <Percent className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Commission Rate:</span>
                <span className="text-lg font-semibold text-foreground">{partner.commissionRate}%</span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="border-t border-border pt-6">
            <h4 className="text-lg font-semibold text-foreground mb-4">Performance Metrics</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-o2-blue-subtle p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold text-foreground">{partner.totalOrders}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-o2-blue" />
                </div>
              </div>
              
              <div className="bg-success-subtle p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(partner.totalRevenue)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-success" />
                </div>
              </div>
              
              <div className="bg-warning-subtle p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Commission Earned</p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(partner.totalRevenue * (partner.commissionRate / 100))}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-warning" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Placeholder */}
          <div className="border-t border-border pt-6">
            <h4 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">Product catalog updated</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <Badge variant="outline">Products</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">New order processed</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
                <Badge variant="outline">Orders</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">Commission payout received</p>
                  <p className="text-xs text-muted-foreground">1 week ago</p>
                </div>
                <Badge variant="outline">Finance</Badge>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-border pt-6">
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button className="bg-o2-blue hover:bg-o2-blue-dark">
                Edit Partner
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}