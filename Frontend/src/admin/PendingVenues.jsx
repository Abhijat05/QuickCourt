import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/api';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { motion } from 'framer-motion';
import { Building, ArrowLeft, CheckCircle, X, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPendingVenues() {
  const [pendingVenues, setPendingVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPendingVenues = async () => {
      try {
        setIsLoading(true);
        const response = await adminService.getPendingVenues();
        setPendingVenues(response.data || []);
      } catch (err) {
        console.error('Error fetching pending venues:', err);
        toast.error('Failed to load pending venues');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingVenues();
  }, []);

  const handleApproveVenue = async (venueId) => {
    try {
      await adminService.approveVenue(venueId);
      setPendingVenues(prev => prev.filter(v => v.id !== venueId));
      toast.success('Venue approved successfully');
    } catch (err) {
      console.error('Error approving venue:', err);
      toast.error('Failed to approve venue');
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
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 mt-16"
    >
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-4" asChild>
          <Link to="/admin/venues">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Venues
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Pending Venues</h1>
      </div>

      {pendingVenues.length > 0 ? (
        <div className="grid gap-6">
          {pendingVenues.map(venue => (
            <Card key={venue.id} className="overflow-hidden">
              <div className="bg-warning/10 p-3 border-b border-warning/20 flex justify-between items-center">
                <Badge variant="warning">Awaiting Approval</Badge>
                <p className="text-sm text-muted-foreground">
                  Submitted: {new Date(venue.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Card.Content className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <h2 className="text-2xl font-bold mb-2">{venue.name}</h2>
                    <p className="text-muted-foreground flex items-center gap-1 mb-4">
                      <MapPin className="h-4 w-4" />
                      {venue.location || venue.address || "No location provided"}
                    </p>
                    
                    <div className="mb-4">
                      <h3 className="text-sm font-medium mb-1">Description</h3>
                      <p className="text-sm text-muted-foreground">
                        {venue.description || "No description provided"}
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-sm font-medium mb-1">Sports</h3>
                      <div className="flex flex-wrap gap-2">
                        {venue.sportTypes?.split(',').map((sport, i) => (
                          <Badge key={i} variant="outline">
                            {sport.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-sm font-medium mb-1">Amenities</h3>
                      <div className="flex flex-wrap gap-2">
                        {venue.amenities?.split(',').map((amenity, i) => (
                          <Badge key={i} variant="outline" className="bg-muted">
                            {amenity.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Card className="mb-4">
                      <Card.Header>
                        <Card.Title className="text-sm">Venue Details</Card.Title>
                      </Card.Header>
                      <Card.Content>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Price per hour:</span>
                            <span className="font-medium">₹{venue.pricePerHour || 'Not set'}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Location:</span>
                            <span className="font-medium">{venue.location || 'Not provided'}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Owner ID:</span>
                            <span className="font-medium">{venue.ownerId}</span>
                          </div>
                        </div>
                      </Card.Content>
                    </Card>
                    
                    <div className="space-y-3">
                      <Button variant="success" className="w-full" onClick={() => handleApproveVenue(venue.id)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve Venue
                      </Button>
                      <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10">
                        <X className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                      <Button variant="ghost" className="w-full" asChild>
                        <Link to={`/venues/${venue.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Card.Content className="py-12 text-center">
            <CheckCircle className="h-12 w-12 mx-auto text-success mb-4" />
            <h2 className="text-2xl font-bold mb-2">All Caught Up!</h2>
            <p className="text-muted-foreground mb-6">
              There are no venues waiting for approval
            </p>
            <Button asChild>
              <Link to="/admin/venues">Back to All Venues</Link>
            </Button>
          </Card.Content>
        </Card>
      )}
    </motion.div>
  );
}