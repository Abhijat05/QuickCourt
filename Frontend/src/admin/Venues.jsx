import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService, venueService } from '../services/api';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { motion } from 'framer-motion';
import { Building, CheckCircle, AlertTriangle, MapPin, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminVenues() {
  const [venues, setVenues] = useState([]);
  const [pendingVenues, setPendingVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setIsLoading(true);
        const [allVenuesRes, pendingVenuesRes] = await Promise.all([
          venueService.getAllVenues(),
          adminService.getPendingVenues()
        ]);
        setVenues(allVenuesRes.data || []);
        setPendingVenues(pendingVenuesRes.data || []);
      } catch (err) {
        console.error('Error fetching venues:', err);
        toast.error('Failed to load venues');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const handleApproveVenue = async (venueId) => {
    try {
      await adminService.approveVenue(venueId);
      // Update the lists
      setPendingVenues(prev => prev.filter(v => v.id !== venueId));
      const approvedVenue = pendingVenues.find(v => v.id === venueId);
      if (approvedVenue) {
        setVenues(prev => [...prev, { ...approvedVenue, approved: true }]);
      }
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Manage Venues</h1>
          <p className="text-muted-foreground">Approve and manage all venues</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/admin/venues/pending">
              Pending Venues 
              {pendingVenues.length > 0 && (
                <Badge variant="destructive" className="ml-2">{pendingVenues.length}</Badge>
              )}
            </Link>
          </Button>
        </div>
      </div>

      {/* All Venues */}
      <Card className="mb-6">
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            <span>All Venues ({venues.length})</span>
          </Card.Title>
        </Card.Header>
        <Card.Content>
          {venues.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {venues.map(venue => (
                <div key={venue.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{venue.name}</h3>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      Approved
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {venue.location || venue.address || "No location"}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {venue.sportTypes?.split(',').map((sport, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {sport.trim()}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" className="gap-1" asChild>
                      <Link to={`/venues/${venue.id}`}>
                        <span>Details</span>
                        <ChevronRight size={16} />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium mb-1">No Venues Found</h3>
              <p className="text-sm text-muted-foreground">
                There are no approved venues in the system
              </p>
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Pending Venues */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <span>Pending Approval ({pendingVenues.length})</span>
          </Card.Title>
        </Card.Header>
        <Card.Content>
          {pendingVenues.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {pendingVenues.map(venue => (
                <div key={venue.id} className="border rounded-lg p-4 bg-warning/5 border-warning/20">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{venue.name}</h3>
                    <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                      Pending
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {venue.location || venue.address || "No location"}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {venue.sportTypes?.split(',').map((sport, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {sport.trim()}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="success" 
                      size="sm"
                      onClick={() => handleApproveVenue(venue.id)}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1" asChild>
                      <Link to={`/venues/${venue.id}`}>
                        <span>Details</span>
                        <ChevronRight size={16} />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto text-success mb-4" />
              <h3 className="font-medium mb-1">No Pending Venues</h3>
              <p className="text-sm text-muted-foreground">
                All venues have been reviewed
              </p>
            </div>
          )}
        </Card.Content>
      </Card>
    </motion.div>
  );
}