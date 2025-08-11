import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { Building, Plus, Search, Users } from 'lucide-react';

export function DashboardHeader({ user }) {
  const isAdmin = user?.role === 'admin';

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold mb-1">
          Welcome back, {user?.fullName || (isAdmin ? 'Admin' : 'User')}!
        </h1>
        <p className="text-muted-foreground">
          {isAdmin 
            ? 'Manage users, venues, and system settings' 
            : 'Manage your bookings and account settings'}
        </p>
      </div>
      
      {isAdmin ? (
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2" asChild>
            <Link to="/admin/users">
              <Users size={16} />
              <span>Manage Users</span>
            </Link>
          </Button>
          <Button className="flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow" asChild>
            <Link to="/admin/venues">
              <Building size={16} />
              <span>Review Venues</span>
            </Link>
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2" asChild>
            <Link to="/find">
              <Search size={16} />
              <span>Find Courts</span>
            </Link>
          </Button>
          <Button className="flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow" asChild>
            <Link to="/find">
              <Plus size={16} />
              <span>New Booking</span>
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}