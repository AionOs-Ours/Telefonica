import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Product } from '@/types/product';
import { StatusBadge } from '@/components/ui/status-badge';
import { Calendar, Package, DollarSign, Building2, Clock } from 'lucide-react';

interface ProductDetailDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetailDialog({ product, open, onOpenChange }: ProductDetailDialogProps) {
  if (!product) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2 text-o2-blue" />
            Product Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">ID: {product.id}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="text-sm text-foreground mt-1">{product.description}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Price:</span>
                <span className="text-lg font-semibold text-foreground">£{product.price}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Type:</span>
                <Badge variant="outline">{product.type}</Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Source Partner:</span>
                <span className="text-sm text-foreground">{product.sourcePartner}</span>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="border-t border-border pt-4">
            <h4 className="text-md font-semibold text-foreground mb-3">Status & Progress</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-muted-foreground">Current Status:</span>
                <StatusBadge status={product.status} />
              </div>
              
              {product.status === 'syncing' && product.syncProgress !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sync Progress:</span>
                    <span className="text-foreground">{product.syncProgress}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-o2-blue h-2 rounded-full transition-all duration-300"
                      style={{ width: `${product.syncProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="border-t border-border pt-4">
            <h4 className="text-md font-semibold text-foreground mb-3">Timeline</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p className="text-sm text-foreground">{formatDate(product.createdAt)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-sm text-foreground">{formatDate(product.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* System Integration Info */}
          <div className="border-t border-border pt-4">
            <h4 className="text-md font-semibold text-foreground mb-3">System Integration</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Herakles Sync:</span>
                <StatusBadge 
                  status={product.status === 'synced' ? 'synced' : product.status === 'syncing' ? 'syncing' : 'pending'} 
                />
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Partner API:</span>
                <StatusBadge status="synced" />
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">BSS Integration:</span>
                <StatusBadge status="synced" />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}