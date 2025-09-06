import { Product, ProductStatus } from '@/types/product';
import { Order } from '@/types/order';
import { Partner, FinancialReport } from '@/types/partner';

export const mockProducts: Product[] = [
  {
    id: 'PROD-001',
    name: 'O2 Business Connect Pro',
    description: 'Enterprise connectivity solution with advanced security features',
    type: 'Service',
    price: 299.99,
    status: 'synced',
    sourcePartner: 'TechPartner Solutions',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z'
  },
  {
    id: 'PROD-002',
    name: 'Cloud Storage Enterprise',
    description: 'Scalable cloud storage solution for businesses',
    type: 'Service',
    price: 149.99,
    status: 'pending-review',
    sourcePartner: 'CloudTech Partners',
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-20T09:15:00Z'
  },
  {
    id: 'PROD-003',
    name: 'Security Suite Advanced',
    description: 'Comprehensive cybersecurity package',
    type: 'Software',
    price: 199.99,
    status: 'syncing',
    sourcePartner: 'SecureNet Solutions',
    createdAt: '2024-01-18T11:45:00Z',
    updatedAt: '2024-01-21T16:30:00Z',
    syncProgress: 45
  },
  {
    id: 'PROD-004',
    name: 'IoT Device Manager',
    description: 'Centralized IoT device management platform',
    type: 'Software',
    price: 89.99,
    status: 'sync-failed',
    sourcePartner: 'IoT Innovations Ltd',
    createdAt: '2024-01-19T13:20:00Z',
    updatedAt: '2024-01-21T08:45:00Z'
  },
  {
    id: 'PROD-005',
    name: 'Business Phone System',
    description: 'VoIP phone system for small to medium businesses',
    type: 'Service',
    price: 79.99,
    status: 'approved',
    sourcePartner: 'CommTech Partners',
    createdAt: '2024-01-17T15:10:00Z',
    updatedAt: '2024-01-20T10:25:00Z'
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    customerId: 'CUST-001',
    customerName: 'Acme Corporation',
    productId: 'PROD-001',
    productName: 'O2 Business Connect Pro',
    quantity: 5,
    totalAmount: 1499.95,
    status: 'fulfilled',
    createdAt: '2024-01-21T10:30:00Z',
    updatedAt: '2024-01-22T14:20:00Z',
    fulfillmentData: {
      shippingAddress: '123 Business Park, London, UK',
      activationKey: 'ABCD-1234-EFGH-5678',
      serviceStartDate: '2024-01-25'
    },
    fulfillmentNotes: 'Installation completed successfully'
  },
  {
    id: 'ORD-2024-002',
    customerId: 'CUST-002',
    customerName: 'Tech Innovations Ltd',
    productId: 'PROD-003',
    productName: 'Security Suite Advanced',
    quantity: 2,
    totalAmount: 399.98,
    status: 'processing',
    createdAt: '2024-01-22T09:15:00Z',
    updatedAt: '2024-01-22T11:30:00Z',
    fulfillmentData: {
      shippingAddress: '456 Innovation Avenue, Manchester, UK',
      licenseKeys: ['SEC-2024-001', 'SEC-2024-002']
    }
  },
  {
    id: 'ORD-2024-003',
    customerId: 'CUST-003',
    customerName: 'Global Enterprises',
    productId: 'PROD-005',
    productName: 'Business Phone System',
    quantity: 10,
    totalAmount: 799.90,
    status: 'new',
    createdAt: '2024-01-22T16:45:00Z',
    updatedAt: '2024-01-22T16:45:00Z',
    fulfillmentData: {
      shippingAddress: '789 Enterprise Plaza, Birmingham, UK',
      installationDate: '2024-01-30'
    }
  }
];

export const mockPartners: Partner[] = [
  {
    id: 'PART-001',
    name: 'Michael Chen',
    companyName: 'TechPartner Solutions',
    email: 'michael.chen@techpartner.com',
    status: 'active',
    partnerType: 'umbrella',
    createdAt: '2023-06-15T10:00:00Z',
    totalOrders: 125,
    totalRevenue: 45670.00,
    commissionRate: 15
  },
  {
    id: 'PART-002',
    name: 'Sarah Mitchell',
    companyName: 'CloudTech Partners',
    email: 'sarah.mitchell@cloudtech.com',
    status: 'active',
    partnerType: 'umbrella',
    createdAt: '2023-08-20T14:30:00Z',
    totalOrders: 89,
    totalRevenue: 32450.00,
    commissionRate: 12
  },
  {
    id: 'PART-003',
    name: 'Alex Thompson',
    companyName: 'SecureNet Solutions',
    email: 'alex.thompson@securenet.com',
    status: 'active',
    partnerType: 'sub-partner',
    parentPartnerId: 'PART-001',
    createdAt: '2023-09-10T11:15:00Z',
    totalOrders: 34,
    totalRevenue: 12890.00,
    commissionRate: 8
  }
];

export const mockFinancialReports: FinancialReport[] = [
  {
    partnerId: 'PART-001',
    partnerName: 'TechPartner Solutions',
    orders: 125,
    revenue: 45670.00,
    commissionOwed: 6850.50,
    payoutStatus: 'pending',
    lastPayoutDate: '2023-12-15'
  },
  {
    partnerId: 'PART-002',
    partnerName: 'CloudTech Partners',
    orders: 89,
    revenue: 32450.00,
    commissionOwed: 3894.00,
    payoutStatus: 'paid',
    lastPayoutDate: '2024-01-15'
  },
  {
    partnerId: 'PART-003',
    partnerName: 'SecureNet Solutions',
    orders: 34,
    revenue: 12890.00,
    commissionOwed: 1031.20,
    payoutStatus: 'pending',
    lastPayoutDate: '2023-12-15'
  }
];

export const mockApiActivities = [
  { timestamp: '2024-01-22T14:30:00Z', action: "Product 'PROD-123' created via API" },
  { timestamp: '2024-01-22T13:15:00Z', action: "Order 'ORD-456' updated via API" },
  { timestamp: '2024-01-22T11:45:00Z', action: "Product 'PROD-789' synced via API" },
  { timestamp: '2024-01-22T10:20:00Z', action: "New partner 'PART-101' registered via API" },
  { timestamp: '2024-01-22T09:30:00Z', action: "Bulk product import completed via API" }
];