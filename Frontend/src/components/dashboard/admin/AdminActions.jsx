import { Card } from '../../ui/Card';
import { Link } from 'react-router-dom';
import { Users, Building, FileText, Settings } from 'lucide-react';

export function AdminActions() {
  const actions = [
    { name: 'Manage Users', icon: Users, path: '/admin/users' },
    { name: 'Review Venues', icon: Building, path: '/admin/venues' },
    { name: 'Reports', icon: FileText, path: '/admin/reports' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];
  
  return (
    <Card>
      <Card.Header>
        <Card.Title>Admin Actions</Card.Title>
        <Card.Description>Manage your platform</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="grid grid-cols-2 gap-2">
          {actions.map(action => (
            <Link 
              key={action.name}
              to={action.path}
              className="flex flex-col items-center justify-center p-3 rounded-lg border border-border hover:bg-accent/10 transition-colors"
            >
              <action.icon className="h-5 w-5 mb-2 text-primary" />
              <span className="text-sm font-medium">{action.name}</span>
            </Link>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
}