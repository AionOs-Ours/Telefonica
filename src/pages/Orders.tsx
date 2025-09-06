import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Database, Eye } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { mockOrders } from '@/data/mockData';
import { Order, OrderStatus } from '@/types/order';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);
  const [jsonPayload, setJsonPayload] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [fulfillmentNotes, setFulfillmentNotes] = useState('');

  if (!user) return null;

  const isO2Admin = user.role === 'O2 Admin' || user.role === 'O2 Super Admin';

  const handleSimulateOrder = () => {
    try {
      const orderData = JSON.parse(jsonPayload);
      const newOrder: Order = {
        id: `ORD-2024-${String(orders.length + 1).padStart(3, '0')}`,
        customerId: orderData.customerId || 'CUST-NEW',
        customerName: orderData.customerName || 'New Customer',
        productId: orderData.productId || 'PROD-001',
        productName: orderData.productName || 'Default Product',
        quantity: orderData.quantity || 1,
        totalAmount: orderData.totalAmount || 0,
        status: 'new',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fulfillmentData: orderData.fulfillmentData || {}
      };
      
      setOrders(prev => [newOrder, ...prev]);
      setIsSimulateOpen(false);
      setJsonPayload('');
    } catch (error) {
      alert('Invalid JSON payload');
    }
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status, updatedAt: new Date().toISOString() }
        : order
    ));
  };

  const updateFulfillmentNotes = (orderId: string, notes: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, fulfillmentNotes: notes, updatedAt: new Date().toISOString() }
        : order
    ));
  };

  const samplePayload = `{
  "customerId": "CUST-004",
  "customerName": "Innovation Corp",
  "productId": "PROD-001",
  "productName": "O2 Business Connect Pro",
  "quantity": 3,
  "totalAmount": 899.97,
  "fulfillmentData": {
    "shippingAddress": "100 Tech Street, London, UK",
    "activationKey": "WXYZ-9876-MNOP-5432",
    "installationDate": "2024-02-01"
  }
}`;

  return (
    <MainLayout>
      <div className="p-6">
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {isO2Admin ? 'Order Oversight' : 'My Orders'}
              </CardTitle>
              {isO2Admin && (
                <Dialog open={isSimulateOpen} onOpenChange={setIsSimulateOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Database className="w-4 h-4 mr-2" />
                      Simulate BSS Order Ingestion
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Simulate BSS Order Ingestion</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Paste a JSON payload to simulate an inbound API call from BSS:
                      </p>
                      <Textarea
                        placeholder={samplePayload}
                        value={jsonPayload}
                        onChange={(e) => setJsonPayload(e.target.value)}
                        className="min-h-64 font-mono text-sm"
                      />
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsSimulateOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSimulateOrder}>
                          Create Order
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.productName}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[600px] sm:w-[600px]">
                          <SheetHeader>
                            <SheetTitle>Order Details - {order.id}</SheetTitle>
                          </SheetHeader>
                          
                          {selectedOrder && (
                            <div className="mt-6 space-y-6">
                              {/* Basic Order Info */}
                              <div className="space-y-3">
                                <h3 className="text-lg font-semibold">Order Information</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Customer:</span>
                                    <p className="font-medium">{selectedOrder.customerName}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Product:</span>
                                    <p className="font-medium">{selectedOrder.productName}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Quantity:</span>
                                    <p className="font-medium">{selectedOrder.quantity}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Total Amount:</span>
                                    <p className="font-medium">£{selectedOrder.totalAmount}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Status:</span>
                                    <StatusBadge status={selectedOrder.status} />
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Created:</span>
                                    <p className="font-medium">
                                      {new Date(selectedOrder.createdAt).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Fulfillment Data from BSS */}
                              {selectedOrder.fulfillmentData && (
                                <div className="space-y-3">
                                  <h3 className="text-lg font-semibold">Fulfillment Data from BSS</h3>
                                  <div className="bg-muted p-4 rounded-lg space-y-2">
                                    {Object.entries(selectedOrder.fulfillmentData).map(([key, value]) => (
                                      <div key={key} className="flex justify-between">
                                        <span className="text-muted-foreground capitalize">
                                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                                        </span>
                                        <span className="font-medium">{String(value)}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Partner Actions */}
                              <div className="space-y-3">
                                <h3 className="text-lg font-semibold">Partner Actions</h3>
                                <div className="space-y-3">
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                      Update Status
                                    </label>
                                    <Select
                                      value={selectedOrder.status}
                                      onValueChange={(value: OrderStatus) => 
                                        updateOrderStatus(selectedOrder.id, value)
                                      }
                                    >
                                      <SelectTrigger className="mt-1">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="new">New</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="fulfilled">Fulfilled</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                      Fulfillment Notes
                                    </label>
                                    <Textarea
                                      value={fulfillmentNotes || selectedOrder.fulfillmentNotes || ''}
                                      onChange={(e) => setFulfillmentNotes(e.target.value)}
                                      placeholder="Add notes about the fulfillment process..."
                                      className="mt-1"
                                    />
                                    <Button 
                                      size="sm" 
                                      className="mt-2"
                                      onClick={() => {
                                        updateFulfillmentNotes(selectedOrder.id, fulfillmentNotes);
                                        setFulfillmentNotes('');
                                      }}
                                    >
                                      Save Notes
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </SheetContent>
                      </Sheet>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}