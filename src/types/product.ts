export type ProductStatus = 
  | 'pending-review' 
  | 'approved' 
  | 'rejected' 
  | 'syncing' 
  | 'synced' 
  | 'sync-failed';

export type ProductType = 'Service' | 'Hardware' | 'Software' | 'Subscription';

export interface Product {
  id: string;
  name: string;
  description: string;
  type: ProductType;
  price: number;
  status: ProductStatus;
  sourcePartner: string;
  createdAt: string;
  updatedAt: string;
  syncProgress?: number;
}

export interface ProductSyncStatus {
  productId: string;
  status: ProductStatus;
  lastSyncAt?: string;
  syncError?: string;
}