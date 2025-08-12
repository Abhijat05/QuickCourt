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
  Shield,
  Check,
  AlertCircle,
  Building,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    unverified: 0,
    admins: 0,
    owners: 0,
    users: 0
  });
  const [userToEditRole, setUserToEditRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  
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

  useEffect(() => {
    // Update stats whenever users changes
    if (users.length > 0) {
      setStats({
        total: users.length,
        verified: users.filter(u => u.isVerified).length,
        unverified: users.filter(u => !u.isVerified).length,
        admins: users.filter(u => u.role === 'admin').length,
        owners: users.filter(u => u.role === 'owner').length,
        users: users.filter(u => u.role === 'user').length
      });
    }
  }, [users]);

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

  const openRoleModal = (user) => {
    setUserToEditRole(user);
    setSelectedRole(user.role);
  };

  const confirmRoleChange = async () => {
    if (!userToEditRole || selectedRole === userToEditRole.role) {
      setUserToEditRole(null);
      return;
    }
    
    try {
      setIsUpdatingRole(true);
      await adminService.changeUserRole({ userId: userToEditRole.id, role: selectedRole });
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userToEditRole.id ? { ...user, role: selectedRole } : user
        )
      );
      toast.success('User role updated successfully');
      setUserToEditRole(null);
    } catch (err) {
      console.error('Error changing user role:', err);
      toast.error('Failed to update user role');
    } finally {
      setIsUpdatingRole(false);
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

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6"
      >
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <Card.Content className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total</p>
                <p className="text-xl font-bold text-primary">{stats.total}</p>
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <UsersIcon className="w-4 h-4 text-primary" />
              </div>
            </div>
          </Card.Content>
        </Card>
        
        <Card className="bg-gradient-to-r from-success/10 to-success/5 border-success/20">
          <Card.Content className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Verified</p>
                <p className="text-xl font-bold text-success">{stats.verified}</p>
              </div>
              <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-success" />
              </div>
            </div>
          </Card.Content>
        </Card>
        
        <Card className="bg-gradient-to-r from-warning/10 to-warning/5 border-warning/20">
          <Card.Content className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Unverified</p>
                <p className="text-xl font-bold text-warning">{stats.unverified}</p>
              </div>
              <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-warning" />
              </div>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Admins</p>
                <p className="text-xl font-bold">{stats.admins}</p>
              </div>
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-success" />
              </div>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Owners</p>
                <p className="text-xl font-bold">{stats.owners}</p>
              </div>
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <Building className="w-4 h-4 text-warning" />
              </div>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Users</p>
                <p className="text-xl font-bold">{stats.users}</p>
              </div>
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </Card.Content>
        </Card>
      </motion.div>

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
                          onClick={() => openRoleModal(user)}
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

      {/* Role Management Modal */}
      {userToEditRole && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background rounded-lg shadow-xl max-w-md w-full mx-4"
          >
            <div className="p-5 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Change User Role</h3>
              </div>
            </div>
            <div className="p-5">
              <p className="mb-4">
                Update role for <strong>{userToEditRole.fullName || userToEditRole.email}</strong>
              </p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {['user', 'owner', 'admin'].map(role => (
                    <div 
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`p-4 border rounded-lg flex flex-col items-center justify-center cursor-pointer ${
                        selectedRole === role ? 'border-primary bg-primary/5 ring-2 ring-primary/30' : 'hover:bg-muted/50'
                      }`}
                    >
                      <Shield className={`h-6 w-6 mb-2 ${
                        role === 'admin' ? 'text-success' : 
                        role === 'owner' ? 'text-warning' : 
                        'text-muted-foreground'
                      }`} />
                      <span className="text-sm font-medium capitalize">{role}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2 mt-2">
                  <h4 className="text-sm font-medium">Role Permissions:</h4>
                  <div className="bg-muted/30 p-3 rounded-md text-sm">
                    {selectedRole === 'admin' && 'Full access to all system features and user management.'}
                    {selectedRole === 'owner' && 'Can create and manage venues, courts, and bookings.'}
                    {selectedRole === 'user' && 'Can book courts and manage their own profile.'}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button 
                  variant="outline" 
                  disabled={isUpdatingRole} 
                  onClick={() => setUserToEditRole(null)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  disabled={isUpdatingRole || selectedRole === userToEditRole.role} 
                  onClick={confirmRoleChange}
                >
                  {isUpdatingRole ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    'Update Role'
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}