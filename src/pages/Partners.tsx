import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import { PartnerDetailDialog } from '@/components/dialogs/PartnerDetailDialog';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Building2, Users, Eye } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { mockPartners } from '@/data/mockData';
import { Partner } from '@/types/partner';

export default function Partners() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [partners, setPartners] = useState<Partner[]>(mockPartners);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOnboardOpen, setIsOnboardOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [newPartnerForm, setNewPartnerForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    commissionRate: ''
  });

  if (!user) return null;

  const isO2PartnerManager = user.role === 'O2 Partner Manager';
  const isPartnerAdmin = user.role === 'Partner Admin';

  const filteredPartners = partners.filter(partner => {
    if (isPartnerAdmin) {
      // Show sub-partners for this partner
      return partner.parentPartnerId === user.id;
    }
    if (isO2PartnerManager) {
      // Show umbrella partners only
      return partner.partnerType === 'umbrella';
    }
    return partner.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           partner.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleOnboard = () => {
    if (!newPartnerForm.companyName || !newPartnerForm.contactName || !newPartnerForm.email) {
      return;
    }

    const newPartner: Partner = {
      id: `PART-${String(partners.length + 1).padStart(3, '0')}`,
      name: newPartnerForm.contactName,
      companyName: newPartnerForm.companyName,
      email: newPartnerForm.email,
      status: 'pending',
      partnerType: isPartnerAdmin ? 'sub-partner' : 'umbrella',
      parentPartnerId: isPartnerAdmin ? user.id : undefined,
      createdAt: new Date().toISOString(),
      totalOrders: 0,
      totalRevenue: 0,
      commissionRate: parseFloat(newPartnerForm.commissionRate) || (isPartnerAdmin ? 8 : 12)
    };
    
    setPartners(prev => [newPartner, ...prev]);
    addNotification({
      title: 'Partner Onboarded',
      message: `${newPartnerForm.companyName} has been successfully onboarded`,
      type: 'success'
    });
    
    setNewPartnerForm({ companyName: '', contactName: '', email: '', commissionRate: '' });
    setIsOnboardOpen(false);
  };

  const handleViewDetails = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsDetailOpen(true);
  };

  const getPageTitle = () => {
    if (isPartnerAdmin) return 'My Sub-partners';
    if (isO2PartnerManager) return 'Partner Management';
    return 'Partners';
  };

  const getOnboardButtonText = () => {
    return isPartnerAdmin ? 'Onboard New Sub-partner' : 'Onboard New Partner';
  };

  return (
    <MainLayout>
      <div className="p-6">
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                {isPartnerAdmin ? (
                  <Building2 className="w-5 h-5 mr-2 text-o2-blue" />
                ) : (
                  <Users className="w-5 h-5 mr-2 text-o2-blue" />
                )}
                {getPageTitle()}
              </CardTitle>
              <Dialog open={isOnboardOpen} onOpenChange={setIsOnboardOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    {getOnboardButtonText()}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{getOnboardButtonText()}</DialogTitle>
                  </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Company Name</label>
                            <Input 
                              placeholder="Enter company name"
                              value={newPartnerForm.companyName}
                              onChange={(e) => setNewPartnerForm(prev => ({ ...prev, companyName: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Contact Name</label>
                            <Input 
                              placeholder="Enter contact name"
                              value={newPartnerForm.contactName}
                              onChange={(e) => setNewPartnerForm(prev => ({ ...prev, contactName: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <Input 
                              type="email" 
                              placeholder="Enter email address"
                              value={newPartnerForm.email}
                              onChange={(e) => setNewPartnerForm(prev => ({ ...prev, email: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Commission Rate (%)</label>
                            <Input 
                              type="number" 
                              placeholder={isPartnerAdmin ? "8" : "12"}
                              value={newPartnerForm.commissionRate}
                              onChange={(e) => setNewPartnerForm(prev => ({ ...prev, commissionRate: e.target.value }))}
                            />
                          </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsOnboardOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleOnboard}>
                        Onboard Partner
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search partners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Partners Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Partner Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Commission Rate</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{partner.companyName}</div>
                        <div className="text-sm text-muted-foreground">
                          Joined {new Date(partner.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{partner.name}</div>
                        <div className="text-sm text-muted-foreground">{partner.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {partner.partnerType === 'umbrella' ? (
                          <Users className="w-4 h-4 mr-1 text-o2-blue" />
                        ) : (
                          <Building2 className="w-4 h-4 mr-1 text-muted-foreground" />
                        )}
                        <span className="capitalize">{partner.partnerType}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={partner.status} />
                    </TableCell>
                    <TableCell>{partner.totalOrders}</TableCell>
                    <TableCell>£{partner.totalRevenue.toLocaleString()}</TableCell>
                    <TableCell>{partner.commissionRate}%</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(partner)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Partner Detail Dialog */}
            <PartnerDetailDialog
              partner={selectedPartner}
              open={isDetailOpen}
              onOpenChange={setIsDetailOpen}
            />

            {filteredPartners.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {isPartnerAdmin ? 'No sub-partners found.' : 'No partners found.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}