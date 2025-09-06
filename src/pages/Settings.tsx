import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Settings as SettingsIcon, User, Building2, Key, Copy, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { mockApiActivities } from '@/data/mockData';

export default function Settings() {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  if (!user) return null;

  const isO2SuperAdmin = user.role === 'O2 Super Admin';
  const isPartnerAdmin = user.role === 'Partner Admin';

  const generateApiKey = () => {
    const newKey = `pk_${Math.random().toString(36).substr(2, 9)}_${Math.random().toString(36).substr(2, 16)}`;
    setApiKey(newKey);
  };

  const copyApiKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
    }
  };

  const revokeApiKey = () => {
    setApiKey(null);
    setShowApiKey(false);
  };

  const displayApiKey = (key: string) => {
    if (showApiKey) return key;
    return `${key.slice(0, 8)}${'*'.repeat(20)}${key.slice(-4)}`;
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Profile Settings */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-o2-blue" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input defaultValue={user.name} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input defaultValue={user.email} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Input value={user.role} disabled />
              </div>
              {user.companyName && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company</label>
                  <Input value={user.companyName} disabled />
                </div>
              )}
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Company & Users - Partner Admin */}
        {isPartnerAdmin && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-o2-blue" />
                Company & Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name</label>
                  <Input defaultValue={user.companyName} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Address</label>
                  <Input placeholder="Enter company address" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input placeholder="Enter phone number" />
                </div>
                <Button>Update Company Info</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* API & Automation - Partner Admin */}
        {isPartnerAdmin && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="w-5 h-5 mr-2 text-o2-blue" />
                API & Automation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* API Access Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Partner API Access</h3>
                
                {!apiKey ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Generate an API key to access the O2 Partner API programmatically.
                    </p>
                    <Button onClick={generateApiKey}>
                      <Key className="w-4 h-4 mr-2" />
                      Generate API Key
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Input 
                        value={displayApiKey(apiKey)} 
                        readOnly 
                        className="font-mono text-sm"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" size="icon" onClick={copyApiKey}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" onClick={revokeApiKey}>
                        Revoke
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Keep your API key secure and don't share it publicly.
                    </p>
                  </div>
                )}
                
                <div className="pt-2">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-o2-blue"
                    onClick={() => window.open('/api-docs', '_blank')}
                  >
                    View API Documentation →
                  </Button>
                </div>
              </div>

              {/* API Activity Log */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recent API Activity</h3>
                <div className="space-y-2">
                  {mockApiActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        API
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* System Management - O2 Super Admin */}
        {isO2SuperAdmin && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="w-5 h-5 mr-2 text-o2-blue" />
                System Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Internal Users</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Sarah Johnson</TableCell>
                      <TableCell>sarah.johnson@o2.com</TableCell>
                      <TableCell>O2 Admin</TableCell>
                      <TableCell>
                        <Badge className="bg-success text-success-foreground">Active</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">David Rodriguez</TableCell>
                      <TableCell>david.rodriguez@o2.com</TableCell>
                      <TableCell>O2 Partner Manager</TableCell>
                      <TableCell>
                        <Badge className="bg-success text-success-foreground">Active</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Button>
                  <User className="w-4 h-4 mr-2" />
                  Add New User
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}