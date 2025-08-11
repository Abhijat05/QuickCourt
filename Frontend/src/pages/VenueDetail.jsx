import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { venueService, courtService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from '../components/ui/Breadcrumb';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ReviewsList from '../components/ReviewsList';
import ReviewForm from '../components/ReviewForm';
import { 
  MapPin, 
  Clock, 
  Calendar, 
  DollarSign, 
  Info, 
  Star, 
  ChevronLeft, 
  Check,
  User,
  Heart
} from 'lucide-react';

export default function VenueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  
  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        setLoading(true);
        
        // Get venue details
        const venueResponse = await venueService.getVenueById(id);
        console.log("Venue data received:", venueResponse.data);
        
        // Try to fetch courts using the courts service
        let courts = [];
        try {
          // First try the dedicated court service
          const courtsResponse = await courtService.getCourtsByVenue(id);
          courts = courtsResponse.data || [];
          console.log("Courts data from courtService:", courts);
        } catch (courtError) {
          console.warn("Court service failed, falling back to venue data:", courtError);
          
          // If courts data exists directly in venue data, use that
          if (venueResponse.data.courts) {
            courts = venueResponse.data.courts;
            console.log("Using courts from venue data:", courts);
          }
        }
        
        // Combine the data
        setVenue({
          ...venueResponse.data,
          courts: courts
        });
      } catch (err) {
        console.error("Error fetching venue details:", err);
        setError('Failed to load venue details');
      } finally {
        setLoading(false);
      }
    };

    fetchVenueDetails();
    
    // Refresh venue details periodically (less frequently to reduce API calls)
    const refreshInterval = setInterval(fetchVenueDetails, 60000); // Every 60 seconds
    return () => clearInterval(refreshInterval);
  }, [id]);
  
  const handleReviewSubmitted = async () => {
    try {
      // Refresh venue details to get updated rating
      const response = await venueService.getVenueById(id);
      setVenue(response.data);
    } catch (error) {
      console.error('Error refreshing venue details:', error);
    }
  };
  
  const renderCourts = () => {
    if (!venue || !venue.courts || venue.courts.length === 0) {
      return (
        <div className="text-center py-8">
          <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium mb-1">No Courts Available</h3>
          <p className="text-sm text-muted-foreground mb-4">
            This venue doesn't have any courts registered yet.
          </p>
          {user?.role === 'admin' && (
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="mx-auto"
            >
              <Link to={`/admin/venues/${id}/courts/new`}>
                Add Court
              </Link>
            </Button>
          )}
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {venue.courts.map(court => (
          <Card key={court.id} className="overflow-hidden border-border/50 hover:shadow-md transition-shadow">
            <div className="bg-primary/5 p-4">
              <h3 className="font-medium text-lg">{court.name}</h3>
              <Badge variant="outline" className="mt-1">
                {court.sportType}
              </Badge>
            </div>
            <Card.Content className="p-4 pt-3">
              <div className="flex justify-between mt-2">
                <span className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                  ${court.pricePerHour}/hr
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  {court.openingTime || venue.openingTime} - {court.closingTime || venue.closingTime}
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-border/50">
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/booking/${venue.id}?courtId=${court.id}`}>
                    <Calendar className="mr-2 h-4 w-4" /> Book this court
                  </Link>
                </Button>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error || !venue) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-muted-foreground">{error || 'Venue not found'}</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/find">Venues</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span className="font-medium">{venue.name}</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="relative rounded-xl overflow-hidden mb-6">
            {venue.images && venue.images.length > 0 ? (
              <img 
                src={venue.images[0]} 
                alt={venue.name} 
                className="w-full h-64 md:h-80 object-cover"
              />
            ) : (
              <div className="w-full h-64 md:h-80 bg-muted flex items-center justify-center">
                <MapPin className="h-16 w-16 text-muted-foreground opacity-20" />
              </div>
            )}
            <div className="absolute top-4 right-4 flex gap-2">
              <Badge className="bg-accent text-white">
                {Array.isArray(venue.sportTypes) ? venue.sportTypes[0] : venue.sportTypes.split(',')[0]}
              </Badge>
              {(Array.isArray(venue.sportTypes) ? venue.sportTypes.slice(1) : venue.sportTypes.split(',').slice(1)).map((sport, i) => (
                <Badge key={i} variant="outline" className="bg-card/80 backdrop-blur-sm">
                  {sport.trim()}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{venue.name}</h1>
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-bold">{venue.averageRating?.toFixed(1) || 'New'}</span>
              <span className="text-muted-foreground text-sm">({venue.reviewCount || 0} reviews)</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-1.5 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{venue.address}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>{venue.pricePerHour}/hour</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{venue.openingTime} - {venue.closingTime}</span>
            </div>
          </div>

          <div className="border-b mb-6">
            <nav className="flex gap-4">
              <button
                onClick={() => setActiveTab('info')}
                className={`py-2 px-1 border-b-2 text-sm font-medium ${
                  activeTab === 'info'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Information
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-2 px-1 border-b-2 text-sm font-medium ${
                  activeTab === 'reviews'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Reviews
              </button>
            </nav>
          </div>

          {activeTab === 'info' && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">About this venue</h2>
                <p className="text-muted-foreground mb-4">{venue.description}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(Array.isArray(venue.amenities) ? venue.amenities : venue.amenities?.split(',')).map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-success" />
                      <span>{amenity.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Render courts information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Courts</h3>
                {renderCourts()}
              </div>
            </>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {user ? (
                <ReviewForm 
                  venueId={venue.id} 
                  onReviewSubmitted={handleReviewSubmitted} 
                />
              ) : (
                <Card className="bg-muted/30 p-4 text-center">
                  <p>Please <Link to="/login" className="text-primary hover:underline">log in</Link> to leave a review.</p>
                </Card>
              )}
              
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-4">Reviews</h3>
                <ReviewsList venueId={venue.id} />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <Card className="shadow-md mb-6">
            <Card.Header>
              <Card.Title className="text-lg">Book this venue</Card.Title>
              <Card.Description>Check availability and make a reservation</Card.Description>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted/30 rounded p-3">
                  <p className="text-sm font-medium">Price</p>
                  <p className="text-xl font-bold">${venue.pricePerHour}/hr</p>
                </div>
                <div className="bg-muted/30 rounded p-3">
                  <p className="text-sm font-medium">Courts</p>
                  <p className="text-xl font-bold">{venue.courts?.length || 0}</p>
                </div>
              </div>
              
              <Button className="w-full" asChild>
                <Link to={`/booking/${venue.id}`}>
                  <Calendar className="mr-2 h-4 w-4" /> Check Availability
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full">
                <Heart className="mr-2 h-4 w-4" /> Save to Favorites
              </Button>
            </Card.Content>
          </Card>
          
          <Card className="shadow-md">
            <Card.Header>
              <Card.Title className="text-lg">Owner Information</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{venue.ownerName || 'Venue Owner'}</p>
                  <p className="text-sm text-muted-foreground">Member since {new Date(venue.createdAt || Date.now()).getFullYear()}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full">
                  <Info className="mr-2 h-4 w-4" /> Contact Owner
                </Button>
              </div>
            </Card.Content>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}