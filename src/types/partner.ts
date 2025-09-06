export interface Partner {
  id: string;
  name: string;
  companyName: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  partnerType: 'umbrella' | 'sub-partner';
  parentPartnerId?: string;
  createdAt: string;
  totalOrders: number;
  totalRevenue: number;
  commissionRate: number;
}

export interface FinancialReport {
  partnerId: string;
  partnerName: string;
  orders: number;
  revenue: number;
  commissionOwed: number;
  payoutStatus: 'pending' | 'paid';
  lastPayoutDate?: string;
}