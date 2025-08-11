import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '../components/ui/Breadcrumb';
import { User, Mail, Phone, MapPin, Calendar, Edit, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Alert, AlertDescription } from '../components/ui/Alert';
import { authService } from '../services/api';

export default function Profile() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isToggling2FA, setIsToggling2FA] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    joinDate: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get the API base URL from your api.js file
        const response = await fetch('http://localhost:5000/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        
        const data = await response.json();
        
        // Format the date
        const joinDate = new Date(data.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        
        setProfileData({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone || '', // Backend might not have these fields yet
          address: data.address || '',
          joinDate: joinDate
        });
        
        setTwoFactorEnabled(data.twoFactorEnabled); // Assuming your API provides this field
        
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load your profile. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          fullName: profileData.fullName
          // Add other fields if your backend supports updating them
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      toast.success('Profile updated successfully');
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle2FA = async () => {
    setIsToggling2FA(true);
    try {
      // Use 'enable' as the property name, not 'enabled'
      await authService.toggle2FA(!twoFactorEnabled);
      setTwoFactorEnabled(!twoFactorEnabled);
      toast.success(`Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error("Error toggling 2FA:", error);
      toast.error('Failed to update 2FA settings');
    } finally {
      setIsToggling2FA(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="container max-w-4xl mx-auto px-4 py-8 mt-16 mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span className="font-medium text-foreground">Profile</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account details and preferences</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1">
          <Card className="overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary to-accent"></div>
            <div className="px-6 pb-6 pt-0 relative">
              <div className="w-20 h-20 rounded-full bg-background p-1 absolute -top-10 left-1/2 transform -translate-x-1/2 shadow-md">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-2xl">
                  {profileData.fullName.charAt(0)}
                </div>
              </div>
              <div className="pt-12 text-center">
                <h3 className="font-bold text-xl mb-1">{profileData.fullName}</h3>
                <p className="text-sm text-muted-foreground mb-4">{profileData.email}</p>
                <Button variant="outline" size="sm" className="w-full flex justify-center gap-2">
                  <Edit size={14} />
                  Edit Photo
                </Button>
              </div>
              <div className="mt-6 pt-4 border-t">
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <Calendar size={14} />
                  <span>Member since {profileData.joinDate}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-span-2">
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <div>
                  <Card.Title>Personal Information</Card.Title>
                  <Card.Description>Update your personal details</Card.Description>
                </div>
                <Button 
                  variant={editMode ? "outline" : "default"} 
                  size="sm" 
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
            </Card.Header>
            <Card.Content className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="fullName">Full Name</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted">
                      <User size={16} className="text-muted-foreground" />
                    </span>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      className={`flex-1 rounded-r-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${!editMode && 'bg-muted'}`}
                      value={profileData.fullName}
                      onChange={handleChange}
                      readOnly={!editMode}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="email">Email</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted">
                      <Mail size={16} className="text-muted-foreground" />
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="flex-1 rounded-r-md border border-input bg-muted px-3 py-2 text-sm focus:outline-none"
                      value={profileData.email}
                      readOnly
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Email address cannot be changed</p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="phone">Phone</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted">
                      <Phone size={16} className="text-muted-foreground" />
                    </span>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className={`flex-1 rounded-r-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${!editMode && 'bg-muted'}`}
                      value={profileData.phone}
                      onChange={handleChange}
                      readOnly={!editMode}
                      placeholder="Add your phone number"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="address">Address</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted">
                      <MapPin size={16} className="text-muted-foreground" />
                    </span>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      className={`flex-1 rounded-r-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${!editMode && 'bg-muted'}`}
                      value={profileData.address}
                      onChange={handleChange}
                      readOnly={!editMode}
                      placeholder="Add your address"
                    />
                  </div>
                </div>
              </div>
            </Card.Content>
            {editMode && (
              <Card.Footer className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </div>
                  ) : 'Save Changes'}
                </Button>
              </Card.Footer>
            )}
          </Card>
          
          <Card className="mt-6">
            <Card.Header>
              <Card.Title>Security Settings</Card.Title>
              <Card.Description>Manage your account security</Card.Description>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h4 className="font-medium">Password</h4>
                  <p className="text-sm text-muted-foreground">Change your account password</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/forgot-password">Change Password</Link>
                </Button>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Button 
                  variant={twoFactorEnabled ? "default" : "outline"} 
                  size="sm" 
                  onClick={handleToggle2FA}
                  disabled={isToggling2FA}
                >
                  {isToggling2FA ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </div>
                  ) : twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                </Button>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}