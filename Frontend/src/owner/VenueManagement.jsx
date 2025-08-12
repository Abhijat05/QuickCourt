import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ownerService } from '../services/api';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { motion } from 'framer-motion';
import { Building, MapPin, Plus, Settings, ChevronRight, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VenueManagement() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick create state
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [quickVenue, setQuickVenue] = useState({
    name: '',
    address: '',
    location: '',
    sportTypes: '',
    description: '',
    pricePerHour: '',
  });
  const [quickCourt, setQuickCourt] = useState({
    name: '',
    sportType: '',
    pricePerHour: '',
    openingTime: '08:00',
    closingTime: '22:00',
  });

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const response = await ownerService.getOwnerVenues();
        setVenues(response.data || []);
      } catch (err) {
        console.error('Error fetching venues:', err);
        toast.error('Failed to load your venues');
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const handleQuickCreate = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!quickVenue.name || !quickVenue.address || !quickVenue.location || !quickVenue.sportTypes || !quickVenue.description || !quickVenue.pricePerHour) {
      toast.error('Fill all venue fields');
      return;
    }
    if (!quickCourt.name || !quickCourt.sportType || !quickCourt.pricePerHour) {
      toast.error('Fill all court fields');
      return;
    }

    setCreating(true);
    try {
      // 1) Create venue
      const venueRes = await ownerService.createVenue({
        name: quickVenue.name,
        description: quickVenue.description,
        address: quickVenue.address,
        location: quickVenue.location,
        // strings, not arrays
        sportTypes: quickVenue.sportTypes,
        amenities: '', // optional
        pricePerHour: parseFloat(quickVenue.pricePerHour),
      });
      const venueId =
        venueRes?.data?.venue?.[0]?.id ??
        venueRes?.data?.venue?.id ??
        venueRes?.data?.id;
      if (!venueId) {
        console.error('No venue id in response:', venueRes?.data);
        throw new Error('Failed to create venue');
      }

     // 2) Redirect to add courts
     toast.success('Venue created. Now add courts.');
     navigate(`/owner/venues/${venueId}/courts/new`);
      setShowQuickCreate(false);
      setQuickVenue({ name: '', address: '', location: '', sportTypes: '', description: '', pricePerHour: '' });
      setQuickCourt({ name: '', sportType: '', pricePerHour: '', openingTime: '08:00', closingTime: '22:00' });

      // Refresh list
      const refreshed = await ownerService.getOwnerVenues();
      setVenues(refreshed.data || []);
    } catch (err) {
      console.error('Quick create failed:', err);
      toast.error(err.response?.data?.message || 'Failed to create venue/court');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-8 mt-16">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">My Venues</h1>
          <p className="text-muted-foreground">Manage your sports venues</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/owner/venues/new">
              <Plus className="mr-2 h-4 w-4" />
              Add New Venue
            </Link>
          </Button>
          <Button variant="outline" onClick={() => setShowQuickCreate((s) => !s)}>
            <Plus className="mr-2 h-4 w-4" />
            Quick Add Venue + Court
          </Button>
        </div>
      </div>

      {showQuickCreate && (
        <Card className="mb-6">
          <Card.Content className="p-4">
            <form onSubmit={handleQuickCreate} className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">Venue</h3>
                <div className="grid gap-2">
                  <input placeholder="Venue Name" className="p-2 border rounded-md w-full" value={quickVenue.name} onChange={(e) => setQuickVenue({ ...quickVenue, name: e.target.value })} />
                  <input placeholder="Address" className="p-2 border rounded-md w-full" value={quickVenue.address} onChange={(e) => setQuickVenue({ ...quickVenue, address: e.target.value })} />
                  <input placeholder="Location (City/Area)" className="p-2 border rounded-md w-full" value={quickVenue.location} onChange={(e) => setQuickVenue({ ...quickVenue, location: e.target.value })} />
                  <input placeholder="Sport Types (comma-separated)" className="p-2 border rounded-md w-full" value={quickVenue.sportTypes} onChange={(e) => setQuickVenue({ ...quickVenue, sportTypes: e.target.value })} />
                  <input type="number" step="0.01" placeholder="Base Price Per Hour" className="p-2 border rounded-md w-full" value={quickVenue.pricePerHour} onChange={(e) => setQuickVenue({ ...quickVenue, pricePerHour: e.target.value })} />
                  <textarea placeholder="Description" rows="2" className="p-2 border rounded-md w-full" value={quickVenue.description} onChange={(e) => setQuickVenue({ ...quickVenue, description: e.target.value })} />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Court</h3>
                <div className="grid gap-2">
                  <input placeholder="Court Name" className="p-2 border rounded-md w-full" value={quickCourt.name} onChange={(e) => setQuickCourt({ ...quickCourt, name: e.target.value })} />
                  <input placeholder="Sport Type" className="p-2 border rounded-md w-full" value={quickCourt.sportType} onChange={(e) => setQuickCourt({ ...quickCourt, sportType: e.target.value })} />
                  <input type="number" step="0.01" placeholder="Price Per Hour" className="p-2 border rounded-md w-full" value={quickCourt.pricePerHour} onChange={(e) => setQuickCourt({ ...quickCourt, pricePerHour: e.target.value })} />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="time" className="p-2 border rounded-md w-full" value={quickCourt.openingTime} onChange={(e) => setQuickCourt({ ...quickCourt, openingTime: e.target.value })} />
                    <input type="time" className="p-2 border rounded-md w-full" value={quickCourt.closingTime} onChange={(e) => setQuickCourt({ ...quickCourt, closingTime: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowQuickCreate(false)}>Cancel</Button>
                <Button type="submit" disabled={creating}>{creating ? 'Creating...' : 'Create Venue + Court'}</Button>
              </div>
            </form>
          </Card.Content>
        </Card>
      )}
      
      {venues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map(venue => (
            <Card key={venue.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48 bg-muted">
                {venue.images && venue.images.length > 0 ? (
                  <img 
                    src={venue.images[0]} 
                    alt={venue.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building className="h-12 w-12 text-muted-foreground opacity-20" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge className={venue.approved ? 'bg-success' : 'bg-warning'}>
                    {venue.approved ? 'Approved' : 'Pending Approval'}
                  </Badge>
                </div>
              </div>
              
              <Card.Content className="p-4">
                <h3 className="text-lg font-semibold mb-1">{venue.name}</h3>
                <p className="text-muted-foreground flex items-center gap-1 mb-4">
                  <MapPin className="h-3.5 w-3.5" />
                  {venue.address || venue.location || "No location"}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {typeof venue.sportTypes === 'string' ? 
                    venue.sportTypes.split(',').map((sport, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {sport.trim()}
                      </Badge>
                    )) : 
                    venue.sportTypes?.map((sport, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {sport}
                      </Badge>
                    ))
                  }
                </div>
                
                <div className="flex justify-between gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link to={`/owner/venues/${venue.id}`}>
                      <Settings className="mr-1 h-4 w-4" />
                      Manage
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link to={`/owner/venues/${venue.id}/bookings`}>
                      <Calendar className="mr-1 h-4 w-4" />
                      Bookings
                    </Link>
                  </Button>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Card.Content className="py-12 text-center">
            <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Venues Yet</h2>
            <p className="text-muted-foreground mb-6">
              You haven't created any venues yet. Create your first venue to start accepting bookings.
            </p>
            <Button asChild>
              <Link to="/owner/venues/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Venue
              </Link>
            </Button>
          </Card.Content>
        </Card>
      )}
    </motion.div>
  );
}