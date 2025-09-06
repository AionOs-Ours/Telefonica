import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';
import { useNavigate } from 'react-router-dom';
import o2Logo from '@/assets/o2-logo.png';

const userRoles: { role: UserRole; description: string }[] = [
  { role: 'O2 Admin', description: 'Product and order management' },
  { role: 'Partner Admin', description: 'Partner portal access' },
  { role: 'O2 Super Admin', description: 'Full platform administration' },
  { role: 'O2 Partner Manager', description: 'Partner relationship management' }
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role: UserRole) => {
    login(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-strong">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img src={o2Logo} alt="O2" className="w-16 h-16" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            O₂ Solution Hub
          </CardTitle>
          <p className="text-muted-foreground">
            Select a user role to log in
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {userRoles.map(({ role, description }) => (
            <Button
              key={role}
              variant="outline"
              className="w-full h-auto p-4 text-left justify-start hover:bg-o2-blue-subtle hover:border-o2-blue transition-all duration-200"
              onClick={() => handleLogin(role)}
            >
              <div>
                <div className="font-semibold text-foreground">{role}</div>
                <div className="text-sm text-muted-foreground">{description}</div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}