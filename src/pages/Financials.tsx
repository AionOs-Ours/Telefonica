import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DollarSign, TrendingUp, Receipt, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { mockFinancialReports } from '@/data/mockData';
import { FinancialReport } from '@/types/partner';

const partnerPayoutHistory = [
  { period: 'January 2024', amount: 3894.00, status: 'paid', date: '2024-01-15' },
  { period: 'December 2023', amount: 4200.50, status: 'paid', date: '2023-12-15' },
  { period: 'November 2023', amount: 3650.25, status: 'paid', date: '2023-11-15' },
  { period: 'October 2023', amount: 3120.75, status: 'paid', date: '2023-10-15' }
];

export default function Financials() {
  const { user } = useAuth();
  const [reports, setReports] = useState<FinancialReport[]>(mockFinancialReports);

  if (!user) return null;

  const isO2SuperAdmin = user.role === 'O2 Super Admin';
  const isPartnerAdmin = user.role === 'Partner Admin';

  const markAsPaid = (partnerId: string) => {
    setReports(prev => prev.map(report => 
      report.partnerId === partnerId 
        ? { ...report, payoutStatus: 'paid' as const, lastPayoutDate: new Date().toISOString().split('T')[0] }
        : report
    ));
  };

  const totalPendingPayouts = reports
    .filter(r => r.payoutStatus === 'pending')
    .reduce((sum, r) => sum + r.commissionOwed, 0);

  const totalRevenue = reports.reduce((sum, r) => sum + r.revenue, 0);
  const totalCommission = reports.reduce((sum, r) => sum + r.commissionOwed, 0);

  if (isPartnerAdmin) {
    const partnerReport = reports.find(r => r.partnerName === user.companyName);
    
    return (
      <MainLayout>
        <div className="p-6 space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-o2-blue" />
                My Financial Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              {partnerReport && (
                <div className="space-y-6">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-o2-blue-subtle p-4 rounded-lg">
                      <div className="flex items-center">
                        <Receipt className="w-5 h-5 text-o2-blue mr-2" />
                        <div>
                          <p className="text-sm text-muted-foreground">Total Orders</p>
                          <p className="text-2xl font-bold text-foreground">{partnerReport.orders}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-success-subtle p-4 rounded-lg">
                      <div className="flex items-center">
                        <TrendingUp className="w-5 h-5 text-success mr-2" />
                        <div>
                          <p className="text-sm text-muted-foreground">Total Revenue</p>
                          <p className="text-2xl font-bold text-foreground">£{partnerReport.revenue.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-warning-subtle p-4 rounded-lg">
                      <div className="flex items-center">
                        <DollarSign className="w-5 h-5 text-warning mr-2" />
                        <div>
                          <p className="text-sm text-muted-foreground">Commission Owed</p>
                          <p className="text-2xl font-bold text-foreground">£{partnerReport.commissionOwed.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payout History */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Payout History</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Period</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Payout Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {partnerPayoutHistory.map((payout, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{payout.period}</TableCell>
                            <TableCell>£{payout.amount.toLocaleString()}</TableCell>
                            <TableCell>
                              <StatusBadge status={payout.status} />
                            </TableCell>
                            <TableCell>{payout.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground">£{totalRevenue.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Commission</p>
                  <p className="text-2xl font-bold text-foreground">£{totalCommission.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-o2-blue" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Payouts</p>
                  <p className="text-2xl font-bold text-warning">£{totalPendingPayouts.toLocaleString()}</p>
                </div>
                <Calendar className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Financials */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Platform Financials</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Commission Payout</TableHead>
                  <TableHead>Payout Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.partnerId}>
                    <TableCell className="font-medium">{report.partnerName}</TableCell>
                    <TableCell>{report.orders}</TableCell>
                    <TableCell>£{report.revenue.toLocaleString()}</TableCell>
                    <TableCell>£{report.commissionOwed.toLocaleString()}</TableCell>
                    <TableCell>
                      <StatusBadge status={report.payoutStatus} />
                    </TableCell>
                    <TableCell>
                      {report.payoutStatus === 'pending' && (
                        <Button 
                          size="sm"
                          onClick={() => markAsPaid(report.partnerId)}
                          className="bg-success hover:bg-success/90"
                        >
                          Mark as Paid
                        </Button>
                      )}
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