import { useState } from 'react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Mail, 
  Database, 
  Server, 
  Shield,
  Globe,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleToggleMaintenance = () => {
    setMaintenanceMode(!maintenanceMode);
    toast.success(`Maintenance mode ${!maintenanceMode ? 'enabled' : 'disabled'}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 mt-16"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">System Settings</h1>
          <p className="text-muted-foreground">Configure application settings and preferences</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                General Settings
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Site Name</label>
                  <input 
                    type="text"
                    defaultValue="QuickCourt"
                    className="w-full p-2 border rounded-md bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Email</label>
                  <input 
                    type="email"
                    defaultValue="support@quickcourt.com"
                    className="w-full p-2 border rounded-md bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Site Description</label>
                <textarea 
                  rows={3}
                  defaultValue="Book sports courts quickly and easily with QuickCourt"
                  className="w-full p-2 border rounded-md bg-background"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <Button>Save Settings</Button>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Notification Settings
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <h3 className="text-sm font-medium">Booking Confirmations</h3>
                    <p className="text-xs text-muted-foreground">Send email notifications when bookings are confirmed</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-primary peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <h3 className="text-sm font-medium">Venue Approvals</h3>
                    <p className="text-xs text-muted-foreground">Send notifications for new venue approval requests</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-primary peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <h3 className="text-sm font-medium">System Alerts</h3>
                    <p className="text-xs text-muted-foreground">Receive notifications for system issues</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-primary peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </Card.Content>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                System Status
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Server Status</span>
                  <Badge variant="success">Online</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database</span>
                  <Badge variant="success">Connected</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">API Health</span>
                  <Badge variant="success">100%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Storage</span>
                  <span className="text-sm font-medium">156.2GB / 500GB</span>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Maintenance Mode
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Enabling maintenance mode will make the site unavailable to regular users while you perform updates.
              </p>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant={maintenanceMode ? "destructive" : "default"}
                  className="flex-1"
                  onClick={handleToggleMaintenance}
                >
                  {maintenanceMode ? "Disable" : "Enable"} Maintenance Mode
                </Button>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Status</span>
                {maintenanceMode ? (
                  <Badge variant="destructive">Maintenance Active</Badge>
                ) : (
                  <Badge variant="success">Site Online</Badge>
                )}
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Cache & Performance
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-3">
              <Button variant="outline" className="w-full">Clear Cache</Button>
              <Button variant="outline" className="w-full">Optimize Database</Button>
              <Button variant="outline" className="w-full">Rebuild Indexes</Button>
            </Card.Content>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}