export type OrderStatus = 'new' | 'processing' | 'fulfilled' | 'cancelled';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  fulfillmentData?: {
    shippingAddress?: string;
    activationKey?: string;
    notes?: string;
    [key: string]: any;
  };
  fulfillmentNotes?: string;
  partnerId?: string;
}