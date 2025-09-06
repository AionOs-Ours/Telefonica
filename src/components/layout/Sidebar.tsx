import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Users, 
  Settings,
  LogOut,
  Building2,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import o2Logo from '@/assets/o2-logo.png';

const getNavigationItems = (role: string) => {
  const baseItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/orders', label: 'Orders', icon: ShoppingCart },
  ];

  const roleSpecificItems = {
    'O2 Super Admin': [
      { path: '/financials', label: 'Financials', icon: BarChart3 },
      { path: '/partners', label: 'Partners', icon: Users },
      { path: '/settings', label: 'Settings', icon: Settings },
    ],
    'O2 Partner Manager': [
      { path: '/partners', label: 'Partners', icon: Users },
      { path: '/settings', label: 'Settings', icon: Settings },
    ],
    'O2 Admin': [
      { path: '/settings', label: 'Settings', icon: Settings },
    ],
    'Partner Admin': [
      { path: '/financials', label: 'My Financials', icon: BarChart3 },
      { path: '/sub-partners', label: 'My Sub-partners', icon: Building2 },
      { path: '/settings', label: 'Settings', icon: Settings },
      { path: '/api', label: 'API & Automation', icon: Zap },
    ],
  };

  return [...baseItems, ...(roleSpecificItems[role as keyof typeof roleSpecificItems] || [])];
};

export function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navigationItems = getNavigationItems(user.role);

  return (
    <div className="h-screen w-64 bg-card border-r border-border flex flex-col shadow-soft">
      {/* Logo Section */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <img src={o2Logo} alt="O2" className="w-8 h-8" />
          <h1 className="text-xl font-semibold text-foreground">O₂ Solution Hub</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-o2-blue text-white shadow-medium'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-o2-blue text-white">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.role}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="w-full mt-3 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}