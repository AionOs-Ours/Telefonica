import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  Activity,
  TrendingUp
} from 'lucide-react';

const getStatsForRole = (role: string) => {
  if (role === 'Partner Admin') {
    return [
      { title: 'My Sub-partners', value: '12', icon: Users, trend: { value: 8, isPositive: true } },
      { title: 'My Products', value: '34', icon: Package, trend: { value: 12, isPositive: true } },
      { title: 'My New Orders', value: '8', icon: ShoppingCart, trend: { value: 15, isPositive: true } },
      { title: 'My Sales Volume', value: '£24,580', icon: DollarSign, trend: { value: 23, isPositive: true } }
    ];
  }
  
  return [
    { title: 'Total Partners', value: '156', icon: Users, trend: { value: 12, isPositive: true } },
    { title: 'Products Pending Sync', value: '23', icon: Package, trend: { value: -8, isPositive: false } },
    { title: 'New Orders', value: '47', icon: ShoppingCart, trend: { value: 18, isPositive: true } },
    { title: 'Sales Volume', value: '£145,230', icon: DollarSign, trend: { value: 15, isPositive: true } }
  ];
};

const recentActivities = [
  { id: 1, action: 'Product "O2 Business Connect Pro" approved', time: '2 minutes ago', type: 'success' },
  { id: 2, action: 'New order from Acme Corporation', time: '15 minutes ago', type: 'info' },
  { id: 3, action: 'Partner "TechPartner Solutions" updated product catalog', time: '1 hour ago', type: 'info' },
  { id: 4, action: 'Sync failed for "IoT Device Manager"', time: '2 hours ago', type: 'error' },
  { id: 5, action: 'Commission payout processed for CloudTech Partners', time: '3 hours ago', type: 'success' }
];

const topProducts = [
  { name: 'O2 Business Connect Pro', sales: 156, revenue: '£46,800', growth: 23 },
  { name: 'Security Suite Advanced', sales: 89, revenue: '£17,820', growth: 15 },
  { name: 'Business Phone System', sales: 67, revenue: '£5,360', growth: -5 },
  { name: 'Cloud Storage Enterprise', sales: 45, revenue: '£6,750', growth: 31 }
];

export default function Dashboard() {
  const { user } = useAuth();
  
  if (!user) return null;

  const stats = getStatsForRole(user.role);

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
            />
          ))}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-o2-blue" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'success' ? 'bg-success' :
                      activity.type === 'error' ? 'bg-destructive' : 'bg-o2-blue'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Products */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-o2-blue" />
                Top Performing Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.sales} sales • {product.revenue}
                      </p>
                    </div>
                    <Badge 
                      variant="secondary"
                      className={product.growth >= 0 ? 'text-success' : 'text-destructive'}
                    >
                      {product.growth >= 0 ? '+' : ''}{product.growth}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}