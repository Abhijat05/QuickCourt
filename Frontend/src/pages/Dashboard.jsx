import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/api';
import { Card } from '../components/ui/Card';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/Alert';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from '../components/ui/Breadcrumb';

export default function Dashboard() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useAuth();

  useEffect(() => {
    const fetch2FAStatus = async () => {
      try {
        const response = await authService.get2FAStatus();
        setTwoFactorEnabled(response.data.twoFactorEnabled);
      } catch (error) {
        console.error('Failed to fetch 2FA status', error);
        toast.error('Failed to load account settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetch2FAStatus();
  }, []);

  const handleToggle2FA = async () => {
    setIsLoading(true);
    try {
      await authService.toggle2FA(!twoFactorEnabled);
      setTwoFactorEnabled(!twoFactorEnabled);
      toast.success(`Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update 2FA settings');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink to="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span className="font-medium text-foreground">Dashboard</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between my-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Badge variant={theme === 'dark' ? 'outline' : 'secondary'}>
          {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
        </Badge>
      </div>
      
      {twoFactorEnabled && (
        <Alert variant="success" className="mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
          <AlertTitle>Account Secured</AlertTitle>
          <AlertDescription>
            Two-factor authentication is enabled on your account, providing an extra layer of security.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2">
          <Card className="h-full">
            <Card.Header>
              <Card.Title>Account Settings</Card.Title>
              <Card.Description>Manage your account security and preferences</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={twoFactorEnabled}
                      onChange={handleToggle2FA}
                      className="sr-only peer"
                      disabled={isLoading}
                    />
                    <div className={`w-11 h-6 ${twoFactorEnabled ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'} peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive email updates about your account activity
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="font-medium">Change Password</h3>
                    <p className="text-sm text-muted-foreground">
                      Update your password regularly for better security
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Update</Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
        
        <div>
          <Card>
            <Card.Header>
              <Card.Title>Quick Actions</Card.Title>
              <Card.Description>Common tasks and shortcuts</Card.Description>
            </Card.Header>
            <Card.Content className="space-y-3">
              <Button variant="default" className="w-full justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                  <line x1="8" x2="16" y1="12" y2="12"></line>
                  <line x1="12" x2="12" y1="8" y2="16"></line>
                </svg>
                Book a Court
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                  <path d="M12 8v8"></path>
                  <path d="m8.5 12 7 0"></path>
                </svg>
                View My Bookings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                  <path d="M12 12c2-2.96 0-7-1-8 0 3.038-1.773 4.741-3 6-1.226 1.26-2 3.24-2 5a6 6 0 1 0 12 0c0-1.532-1.056-3.94-2-5-1.786 3-2.791 3-4 2z"></path>
                </svg>
                Popular Courts
              </Button>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}