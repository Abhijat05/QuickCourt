import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { venueService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from '../components/ui/Breadcrumb';
import { ChevronLeft, Calendar, Clock, DollarSign, Info, MapPin } from 'lucide-react';

export default function Booking() {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [venue, setVenue] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch venue details when component loads
  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        const response = await venueService.getVenueById(venueId);
        setVenue(response.data);
        if (response.data.courts && response.data.courts.length > 0) {
          setSelectedCourt(response.data.courts[0]);
        }
      } catch (err) {
        setError('Failed to load venue details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVenueDetails();
  }, [venueId]);
  
  // Fetch available time slots when court or date changes
  useEffect(() => {
    const fetchAvailableTimeSlots = async () => {
      if (!selectedCourt || !selectedDate) return;
      
      try {
        setLoading(true);
        // Typically you'd call an API endpoint like:
        // const response = await bookingService.getAvailableTimeSlots(selectedCourt.id, selectedDate);
        
        // For this example, we'll generate mock time slots
        const openingHour = parseInt(selectedCourt.openingTime?.split(':')[0] || 8);
        const closingHour = parseInt(selectedCourt.closingTime?.split(':')[0] || 22);
        
        const mockTimeSlots = [];
        for (let hour = openingHour; hour < closingHour; hour++) {
          // Generate time in 24-hour format
          const startTime = `${hour.toString().padStart(2, '0')}:00`;
          const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
          
          // Randomly determine if the slot is available (80% chance)
          const available = Math.random() > 0.2;
          
          mockTimeSlots.push({
            id: `${hour}`,
            startTime,
            endTime,
            available
          });
        }
        
        setAvailableTimeSlots(mockTimeSlots);
      } catch (err) {
        toast.error('Failed to load available time slots');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAvailableTimeSlots();
  }, [selectedCourt, selectedDate]);
  
  const handleCourtSelection = (court) => {
    setSelectedCourt(court);
    setSelectedTimeSlot(null);
  };
  
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTimeSlot(null);
  };
  
  const handleTimeSlotSelection = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };
  
  const handleBooking = async () => {
    if (!selectedCourt || !selectedDate || !selectedTimeSlot) {
      toast.error('Please select a court, date, and time slot');
      return;
    }
    
    setBookingLoading(true);
    try {
      const bookingData = {
        courtId: selectedCourt.id,
        date: selectedDate,
        startTime: selectedTimeSlot.startTime,
        endTime: selectedTimeSlot.endTime,
      };
      
      const response = await bookingService.createBooking(bookingData);
      
      toast.success('Booking confirmed successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create booking');
      console.error(err);
    } finally {
      setBookingLoading(false);
    }
  };
  
  if (loading && !venue) {
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
            <BreadcrumbLink as={Link} to={`/venues/${venue.id}`}>{venue.name}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span className="font-medium">Book</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Main content - booking form */}
        <div className="w-full md:w-2/3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Venue
            </Button>
            
            <h1 className="text-3xl font-bold mb-2">{venue.name}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <MapPin className="h-4 w-4" />
              <span>{venue.address}</span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <Card.Header>
                <Card.Title>Book a Court</Card.Title>
                <Card.Description>Select court, date and time slot to make a reservation</Card.Description>
              </Card.Header>
              
              <Card.Content className="space-y-6">
                {/* Court selection */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Select a Court</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {venue.courts && venue.courts.map(court => (
                      <button
                        key={court.id}
                        onClick={() => handleCourtSelection(court)}
                        className={`p-4 border rounded-lg text-left hover:border-primary transition-colors ${
                          selectedCourt?.id === court.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border'
                        }`}
                      >
                        <div className="font-medium">{court.name}</div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-muted-foreground">{court.sportType}</span>
                          <span className="text-sm font-medium">${court.pricePerHour}/hr</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Date selection */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Select Date</h3>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                
                {/* Time slots */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Select Time Slot</h3>
                  {loading ? (
                    <div className="flex justify-center p-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {availableTimeSlots.map(slot => (
                        <button
                          key={slot.id}
                          disabled={!slot.available}
                          onClick={() => handleTimeSlotSelection(slot)}
                          className={`p-2 text-sm text-center border rounded-md transition-colors ${
                            !slot.available 
                              ? 'bg-muted/50 text-muted-foreground cursor-not-allowed opacity-60' 
                              : selectedTimeSlot?.id === slot.id
                                ? 'bg-primary/10 border-primary text-primary'
                                : 'hover:border-primary/50 hover:bg-primary/5'
                          }`}
                        >
                          {slot.startTime} - {slot.endTime}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        </div>
        
        {/* Sidebar - booking summary */}
        <div className="w-full md:w-1/3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="sticky top-24">
              <Card.Header>
                <Card.Title>Booking Summary</Card.Title>
              </Card.Header>
              
              <Card.Content className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Venue</span>
                    <span className="font-medium">{venue.name}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Court</span>
                    <span className="font-medium">{selectedCourt?.name || 'Not selected'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Sport</span>
                    <span className="font-medium">{selectedCourt?.sportType || '-'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Date</span>
                    <span className="font-medium">{selectedDate ? format(new Date(selectedDate), 'MMMM d, yyyy') : '-'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Time</span>
                    <span className="font-medium">
                      {selectedTimeSlot ? `${selectedTimeSlot.startTime} - ${selectedTimeSlot.endTime}` : '-'}
                    </span>
                  </div>
                </div>
                
                <hr className="border-border/50" />
                
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span className="text-lg">
                    ${selectedTimeSlot && selectedCourt ? selectedCourt.pricePerHour : '0.00'}
                  </span>
                </div>
                
                <div className="pt-3">
                  <Button
                    className="w-full"
                    disabled={!selectedCourt || !selectedDate || !selectedTimeSlot || bookingLoading}
                    onClick={handleBooking}
                  >
                    {bookingLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                        Processing...
                      </div>
                    ) : (
                      'Confirm Booking'
                    )}
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground text-center">
                  By confirming, you agree to our booking terms and conditions
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}