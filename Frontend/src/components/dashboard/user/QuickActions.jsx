import { Card } from '../../ui/Card';
import { Link } from 'react-router-dom';
import { Plus, Search, Clock, Settings } from 'lucide-react';

export function QuickActions() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Quick Actions</Card.Title>
        <Card.Description>Common tasks you might want to perform</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="grid grid-cols-2 gap-2">
          <Link 
            to="/find"
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-border hover:bg-accent/10 transition-colors"
          >
            <Plus className="h-5 w-5 mb-2 text-primary" />
            <span className="text-sm font-medium">New Booking</span>
          </Link>
          <Link 
            to="/find"
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-border hover:bg-accent/10 transition-colors"
          >
            <Search className="h-5 w-5 mb-2 text-primary" />
            <span className="text-sm font-medium">Find Courts</span>
          </Link>
          <Link 
            to="/history"
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-border hover:bg-accent/10 transition-colors"
          >
            <Clock className="h-5 w-5 mb-2 text-primary" />
            <span className="text-sm font-medium">History</span>
          </Link>
          <Link 
            to="/profile"
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-border hover:bg-accent/10 transition-colors"
          >
            <Settings className="h-5 w-5 mb-2 text-primary" />
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </div>
      </Card.Content>
    </Card>
  );
}