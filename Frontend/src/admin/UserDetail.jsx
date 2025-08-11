import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminService } from '../services/api';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Calendar, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setIsLoading(true);
        const response = await adminService.getUserById(userId);
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to load user details');
        toast.error('Failed to load user details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
          <p>{error || "User not found"}</p>
          <Button className="mt-4" asChild>
            <Link to="/admin/users">Back to Users</Link>
          </Button>
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
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-4" asChild>
          <Link to="/admin/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">User Details</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <Card.Header>
            <Card.Title>User Information</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-3xl font-medium text-primary">
                  {user.fullName?.charAt(0) || user.email?.charAt(0)}
                </span>
              </div>
              <h2 className="text-xl font-bold">{user.fullName || "Unnamed User"}</h2>
              <Badge className="mt-2">{user.role}</Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span>Role: <strong>{user.role}</strong></span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Card.Content>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <Card.Header>
              <Card.Title>Account Actions</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">Reset Password</Button>
                <Button variant="destructive" className="flex-1">Delete Account</Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button>Verify Account</Button>
                <Button variant="outline">Change Role</Button>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>User Activity</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="text-center py-8 text-muted-foreground">
                User activity data will be shown here
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}