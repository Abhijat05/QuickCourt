import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/api';
import { Card } from '../components/ui/Card';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/Alert';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from '../components/ui/Breadcrumb';
import {
  Shield,
  Bell,
  Key,
  Calendar,
  Clock,
  MapPin,
  User,
  ChevronRight,
  Plus,
  Settings,
  Search
} from 'lucide-react';

export default function Dashboard() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, theme } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');

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
      <div className="flex justify-center items-center min-h-[70vh] pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Mock data for upcoming and past bookings
  const upcomingBookings = [
    { id: 1, court: "Downtown Tennis Club", date: "Tomorrow", time: "10:00 AM", sport: "Tennis" },
    { id: 2, court: "City Basketball Arena", date: "May 24, 2023", time: "4:30 PM", sport: "Basketball" },
  ];

  const pastBookings = [
    { id: 3, court: "Westside Sports Center", date: "May 15, 2023", time: "2:00 PM", sport: "Badminton" },
    { id: 4, court: "Downtown Tennis Club", date: "May 10, 2023", time: "9:30 AM", sport: "Tennis" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 mt-16" // Added mt-16 to create space below navbar
    >
      <Breadcrumb className="mb-4 pt-2"> {/* Added padding-top for extra spacing */}
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

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome back, {user?.name || 'Player'}</h1>
          <p className="text-muted-foreground">Manage your bookings and account settings</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Search size={16} />
            <span>Find Courts</span>
          </Button>
          <Button className="flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow">
            <Plus size={16} />
            <span>New Booking</span>
          </Button>
        </div>
      </div>
      
      {/* Rest of your component remains unchanged */}
      {twoFactorEnabled && (
        <Alert variant="success" className="mb-6 animate-fade-in-up">
          <Shield className="h-4 w-4" />
          <AlertTitle>Account Secured</AlertTitle>
          <AlertDescription>
            Two-factor authentication is enabled on your account, providing an extra layer of security.
          </AlertDescription>
        </Alert>
      )}
      
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Content Area - 2/3 width */}
        <motion.div 
          variants={itemVariants} 
          className="col-span-1 lg:col-span-2 space-y-6"
        >
          {/* Booking Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <Card.Content className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="success" className="bg-primary/20 text-primary">Active</Badge>
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">{upcomingBookings.length}</h3>
                <p className="text-sm text-muted-foreground">Upcoming Bookings</p>
              </Card.Content>
            </Card>
            
            <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <Card.Content className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="border-accent/30 text-accent">History</Badge>
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-2xl font-bold">{pastBookings.length}</h3>
                <p className="text-sm text-muted-foreground">Past Bookings</p>
              </Card.Content>
            </Card>
            
            <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
              <Card.Content className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="border-success/30 text-success">Available</Badge>
                  <MapPin className="h-5 w-5 text-success" />
                </div>
                <h3 className="text-2xl font-bold">24</h3>
                <p className="text-sm text-muted-foreground">Courts Near You</p>
              </Card.Content>
            </Card>
          </div>

          {/* Bookings Tab Panel */}
          <Card>
            <Card.Header className="pb-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Card.Title>My Bookings</Card.Title>
                <div className="flex bg-muted/50 rounded-lg p-1">
                  <Button 
                    variant={activeTab === 'upcoming' ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => setActiveTab('upcoming')}
                    className="text-sm"
                  >
                    Upcoming
                  </Button>
                  <Button 
                    variant={activeTab === 'past' ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => setActiveTab('past')}
                    className="text-sm"
                  >
                    Past
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Content className="pt-6">
              {activeTab === 'upcoming' ? (
                <>
                  {upcomingBookings.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 bg-card/50 border rounded-lg hover:bg-accent/5 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              {booking.sport === 'Tennis' && '🎾'}
                              {booking.sport === 'Basketball' && '🏀'}
                              {booking.sport === 'Badminton' && '🏸'}
                            </div>
                            <div>
                              <h4 className="font-medium">{booking.court}</h4>
                              <p className="text-sm text-muted-foreground">{booking.date} • {booking.time}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <span>Details</span>
                            <ChevronRight size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-medium mb-1">No Upcoming Bookings</h3>
                      <p className="text-sm text-muted-foreground mb-4">You don't have any upcoming court reservations</p>
                      <Button>Book a Court</Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  {pastBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-muted/30 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center opacity-70">
                          {booking.sport === 'Tennis' && '🎾'}
                          {booking.sport === 'Basketball' && '🏀'}
                          {booking.sport === 'Badminton' && '🏸'}
                        </div>
                        <div>
                          <h4 className="font-medium">{booking.court}</h4>
                          <p className="text-sm text-muted-foreground">{booking.date} • {booking.time}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">Rebook</Button>
                        <Button variant="outline" size="sm">Review</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Content>
            <Card.Footer className="flex justify-center border-t pt-4">
              <Button variant="outline" className="w-full sm:w-auto">
                View All Bookings
              </Button>
            </Card.Footer>
          </Card>
        </motion.div>

        {/* Sidebar - 1/3 width */}
        <motion.div variants={itemVariants} className="col-span-1 space-y-6">
          {/* User Profile Card */}
          <Card className="overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-primary to-accent"></div>
            <div className="px-6 pb-6 pt-0 relative">
              <div className="w-16 h-16 rounded-full bg-background p-1 absolute -top-8 left-6 shadow-md">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </div>
              <div className="pt-10">
                <h3 className="font-bold text-lg">Account Settings</h3>
                <p className="text-sm text-muted-foreground mb-4">Manage your preferences</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <div>
                        <h3 className="text-sm font-medium">Two-Factor Auth</h3>
                      </div>
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
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-accent" />
                      <div>
                        <h3 className="text-sm font-medium">Notifications</h3>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      Configure
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-success" />
                      <div>
                        <h3 className="text-sm font-medium">Password</h3>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <Card.Header>
              <Card.Title className="text-lg">Quick Actions</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-2">
              <Button variant="default" className="w-full justify-between group hover:shadow-sm transition-shadow">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Book a Court
                </span>
                <ChevronRight size={16} className="opacity-70 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button variant="outline" className="w-full justify-between group">
                <span className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Find Courts
                </span>
                <ChevronRight size={16} className="opacity-70 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button variant="outline" className="w-full justify-between group">
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Edit Profile
                </span>
                <ChevronRight size={16} className="opacity-70 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button variant="outline" className="w-full justify-between group">
                <span className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Preferences
                </span>
                <ChevronRight size={16} className="opacity-70 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card.Content>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}