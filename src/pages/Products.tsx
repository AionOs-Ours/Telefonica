import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { ProductFormDialog } from '@/components/forms/ProductFormDialog';
import { ProductDetailDialog } from '@/components/dialogs/ProductDetailDialog';
import { BulkImportDialog } from '@/components/dialogs/BulkImportDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Upload, Search, Eye, Check, X, Filter } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { mockProducts } from '@/data/mockData';
import { Product, ProductStatus, ProductType } from '@/types/product';

export default function Products() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  if (!user) return null;

  const isO2Admin = user.role === 'O2 Admin' || user.role === 'O2 Super Admin';
  const isPartnerAdmin = user.role === 'Partner Admin';

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sourcePartner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesType = typeFilter === 'all' || product.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const pendingProducts = products.filter(p => p.status === 'pending-review');

  const handleCreateProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const handleBulkImport = (newProducts: Product[]) => {
    setProducts(prev => [...newProducts, ...prev]);
  };

  const handleApprove = (productId: string) => {
    setProducts(prev => prev.map(p => 
      p.id === productId 
        ? { ...p, status: 'syncing' as ProductStatus, syncProgress: 0 }
        : p
    ));

    addNotification({
      title: 'Product Approved',
      message: 'Product sync with Herakles initiated',
      type: 'success'
    });

    // Simulate sync progression
    setTimeout(() => {
      setProducts(prev => prev.map(p => 
        p.id === productId 
          ? { ...p, status: 'synced' as ProductStatus, syncProgress: 100 }
          : p
      ));
      
      addNotification({
        title: 'Sync Complete',
        message: 'Product successfully synced to Herakles',
        type: 'success'
      });
    }, 3000);
  };

  const handleReject = (productId: string) => {
    setProducts(prev => prev.map(p => 
      p.id === productId 
        ? { ...p, status: 'rejected' as ProductStatus }
        : p
    ));

    addNotification({
      title: 'Product Rejected',
      message: 'Product has been rejected and returned to partner',
      type: 'warning'
    });
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const getMyProducts = () => {
    if (isPartnerAdmin) {
      return filteredProducts.filter(p => p.sourcePartner === user.companyName);
    }
    return filteredProducts;
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Products Pending Approval - O2 Admin only */}
        {isO2Admin && pendingProducts.length > 0 && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-warning">Products Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Source Partner</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.sourcePartner}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.type}</Badge>
                      </TableCell>
                      <TableCell>£{product.price}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(product.id)}
                            className="bg-success hover:bg-success/90"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(product.id)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Main Product Catalog */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {isO2Admin ? 'Master Product Catalog' : 'My Products'}
              </CardTitle>
              <div className="flex items-center space-x-2">
                {isPartnerAdmin && (
                  <>
                    <BulkImportDialog
                      open={isImportOpen}
                      onOpenChange={setIsImportOpen}
                      onImport={handleBulkImport}
                    />
                    <Button variant="outline" onClick={() => setIsImportOpen(true)}>
                      <Upload className="w-4 h-4 mr-2" />
                      Bulk Import
                    </Button>
                    <ProductFormDialog
                      open={isCreateOpen}
                      onOpenChange={setIsCreateOpen}
                      onSubmit={handleCreateProduct}
                    />
                    <Button onClick={() => setIsCreateOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Product
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending-review">Pending Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="syncing">Syncing</SelectItem>
                  <SelectItem value="synced">Synced</SelectItem>
                  <SelectItem value="sync-failed">Sync Failed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Service">Service</SelectItem>
                  <SelectItem value="Hardware">Hardware</SelectItem>
                  <SelectItem value="Software">Software</SelectItem>
                  <SelectItem value="Subscription">Subscription</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="justify-center">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>

            {/* Products Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Source Partner</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(isPartnerAdmin ? getMyProducts() : filteredProducts).map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {product.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.sourcePartner}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.type}</Badge>
                    </TableCell>
                    <TableCell>£{product.price}</TableCell>
                    <TableCell>
                      <StatusBadge status={product.status} />
                      {product.status === 'syncing' && product.syncProgress !== undefined && (
                        <div className="mt-1 w-20 bg-secondary rounded-full h-1">
                          <div 
                            className="bg-o2-blue h-1 rounded-full transition-all duration-300"
                            style={{ width: `${product.syncProgress}%` }}
                          />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(product)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Product Detail Dialog */}
            <ProductDetailDialog
              product={selectedProduct}
              open={isDetailOpen}
              onOpenChange={setIsDetailOpen}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}