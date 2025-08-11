import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/api';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { motion } from 'framer-motion';
import { 
  Users as UsersIcon, 
  ChevronRight, 
  Trash2, 
  Edit, 
  Shield 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await adminService.getAllUsers();
        setUsers(response.data || []);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
        toast.error('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChangeRole = async (userId, newRole) => {
    try {
      await adminService.changeUserRole({ userId, role: newRole });
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      toast.success('User role updated successfully');
    } catch (err) {
      console.error('Error changing user role:', err);
      toast.error('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await adminService.deleteUser(userId);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Failed to delete user');
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <Badge variant="success">Admin</Badge>;
      case 'owner':
        return <Badge variant="warning">Owner</Badge>;
      default:
        return <Badge variant="outline">User</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
          <p>{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 mt-16"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Manage Users</h1>
          <p className="text-muted-foreground">View and manage all users in the system</p>
        </div>
        <div>
          <Button variant="outline">Export Users</Button>
        </div>
      </div>

      <Card>
        <Card.Header>
          <div className="flex justify-between items-center">
            <Card.Title className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5" />
              <span>All Users ({users.length})</span>
            </Card.Title>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Search users..." 
                className="px-3 py-1 text-sm rounded-md border border-border bg-background"
              />
            </div>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">User</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Created</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b hover:bg-muted/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-medium text-primary">{user.fullName?.charAt(0) || user.email?.charAt(0)}</span>
                        </div>
                        <span className="font-medium">{user.fullName || 'Unnamed User'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                    <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                    <td className="py-3 px-4">
                      {user.isVerified ? (
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">Verified</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Unverified</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                          <Link to={`/admin/users/${user.id}`}>
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-warning"
                          onClick={() => {
                            // Cycle through roles: user -> owner -> admin -> user
                            const roles = ['user', 'owner', 'admin'];
                            const currentIndex = roles.indexOf(user.role);
                            const nextRole = roles[(currentIndex + 1) % roles.length];
                            handleChangeRole(user.id, nextRole);
                          }}
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <UsersIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium mb-1">No Users Found</h3>
              <p className="text-sm text-muted-foreground">
                There are no users registered in the system yet
              </p>
            </div>
          )}
        </Card.Content>
      </Card>
    </motion.div>
  );
}