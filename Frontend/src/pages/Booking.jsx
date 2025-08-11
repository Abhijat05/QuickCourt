import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { venueService, bookingService, availabilityService, ownerService } from '../services/api';
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
  const [courtLoading, setCourtLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch venue details when component loads
  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        setLoading(true);
        const response = await venueService.getVenueById(venueId);
        console.log("Venue data:", response.data);
        setVenue(response.data);
        
        // Check if courts exist and log them
        if (response.data.courts && response.data.courts.length > 0) {
          console.log("Courts found:", response.data.courts);
          // Only set the first court as selected initially
          // We'll fetch its detailed information separately
          setSelectedCourt(response.data.courts[0]);
        } else {
          console.warn("No courts found for this venue");
        }
      } catch (err) {
        console.error("Error fetching venue:", err);
        setError('Failed to load venue details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVenueDetails();
  }, [venueId]);
  
  // Fetch available time slots when court or date changes
  useEffect(() => {
    const fetchAvailableTimeSlots = async () => {
      if (!selectedCourt || !selectedDate) {
        console.log("Missing court or date, not fetching time slots");
        return;
      }
      
      try {
        setCourtLoading(true);
        console.log(`Fetching time slots for court ${selectedCourt.id} on ${selectedDate}`);
        const response = await availabilityService.getCourtAvailability(selectedCourt.id, selectedDate);
        console.log("Time slots received:", response.data);
        setAvailableTimeSlots(response.data);
      } catch (err) {
        console.error("Error fetching time slots:", err);
        toast.error('Failed to load available time slots');
      } finally {
        setCourtLoading(false);
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
      navigate('/bookings');
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
                  {venue && venue.courts && venue.courts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {venue.courts.map(court => (
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
                  ) : (
                    <p>No courts available for this venue</p>
                  )}
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
                  {courtLoading ? (
                    <div className="flex justify-center p-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {availableTimeSlots.map((slot, index) => (
                        <button
                          key={index}
                          disabled={!slot.available}
                          onClick={() => handleTimeSlotSelection(slot)}
                          className={`p-2 text-sm text-center border rounded-md transition-colors ${
                            !slot.available 
                              ? 'bg-muted/50 text-muted-foreground cursor-not-allowed opacity-60' 
                              : selectedTimeSlot?.startTime === slot.startTime
                                ? 'bg-primary/10 border-primary text-primary'
                                : 'hover:border-primary/50 hover:bg-primary/5'
                          }`}
                        >
                          {slot.startTime} - {slot.endTime}
                        </button>
                      ))}
                    </div>
                  )}
                  {!courtLoading && availableTimeSlots.length === 0 && selectedCourt && (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No time slots available for this date</p>
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
                    ${selectedTimeSlot && selectedCourt 
                      ? (selectedCourt.pricePerHour * 
                         (parseInt(selectedTimeSlot.endTime) - 
                          parseInt(selectedTimeSlot.startTime))).toFixed(2) 
                      : '0.00'}
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