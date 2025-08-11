import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { venueService, bookingService, availabilityService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from '../components/ui/Breadcrumb';
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  DollarSign, 
  MapPin, 
  Check, 
  Star,
  Users,
  Shield,
  CreditCard,
  ChevronRight,
  Info,
  Zap
} from 'lucide-react';

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
  const [currentStep, setCurrentStep] = useState(1); // Multi-step booking process
  
  // Fetch venue details when component loads
  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        setLoading(true);
        const response = await venueService.getVenueById(venueId);
        setVenue(response.data);
        
        if (response.data.courts && response.data.courts.length > 0) {
          setSelectedCourt(response.data.courts[0]);
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
      if (!selectedCourt || !selectedDate) return;
      
      try {
        setCourtLoading(true);
        const response = await availabilityService.getCourtAvailability(selectedCourt.id, selectedDate);
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
    setCurrentStep(2);
  };
  
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTimeSlot(null);
  };
  
  const handleTimeSlotSelection = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setCurrentStep(3);
  };
  
  const handleBooking = async () => {
    if (!selectedCourt || !selectedDate || !selectedTimeSlot) {
      toast.error('Please complete all booking steps');
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
      
      await bookingService.createBooking(bookingData);
      
      toast.success('Booking confirmed successfully!');
      navigate('/bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!selectedTimeSlot || !selectedCourt) return 0;
    const duration = parseInt(selectedTimeSlot.endTime) - parseInt(selectedTimeSlot.startTime);
    return selectedCourt.pricePerHour * duration;
  };

  const steps = [
    { id: 1, title: 'Choose Court', description: 'Select your preferred court' },
    { id: 2, title: 'Pick Date & Time', description: 'Choose when to play' },
    { id: 3, title: 'Confirm Booking', description: 'Review and confirm' }
  ];

  if (loading && !venue) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading venue details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !venue) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <Card className="max-w-md mx-auto text-center p-8">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-muted-foreground mb-6">{error || 'Venue not found'}</p>
          <Button onClick={() => navigate(-1)}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </Card>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Enhanced Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink as={Link} to="/" className="flex items-center gap-1">
                  Home
                </BreadcrumbLink>
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
                <span className="font-medium text-primary">Book</span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-4 hover:bg-muted/50"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Venue
          </Button>
          
          <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {venue.name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{venue.address}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{venue.averageRating?.toFixed(1) || 'New'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  <Zap className="w-3 h-3 mr-1" />
                  Instant Booking
                </Badge>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  <Shield className="w-3 h-3 mr-1" />
                  Secure Payment
                </Badge>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                    ${currentStep >= step.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                    }
                    ${currentStep === step.id ? 'ring-2 ring-primary ring-offset-2' : ''}
                    transition-all duration-300
                  `}>
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-xs font-medium ${currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-px w-20 mx-4 ${currentStep > step.id ? 'bg-primary' : 'bg-muted'} transition-colors duration-300`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Booking Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Court Selection */}
              {currentStep >= 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="mb-6"
                >
                  <Card className="overflow-hidden">
                    <Card.Header className="bg-gradient-to-r from-primary/5 to-accent/5">
                      <Card.Title className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-primary" />
                        </div>
                        Choose Your Court
                      </Card.Title>
                      <Card.Description>Select from our available courts</Card.Description>
                    </Card.Header>
                    
                    <Card.Content className="p-6">
                      {venue?.courts?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {venue.courts.map(court => (
                            <motion.button
                              key={court.id}
                              onClick={() => handleCourtSelection(court)}
                              className={`
                                p-6 border-2 rounded-xl text-left transition-all duration-300
                                hover:shadow-lg hover:scale-[1.02]
                                ${selectedCourt?.id === court.id 
                                  ? 'border-primary bg-primary/5 shadow-lg ring-1 ring-primary/20' 
                                  : 'border-border hover:border-primary/50'
                                }
                              `}
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <h3 className="font-semibold text-lg">{court.name}</h3>
                                {selectedCourt?.id === court.id && (
                                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-primary-foreground" />
                                  </div>
                                )}
                              </div>
                              
                              <div className="space-y-2">
                                <Badge variant="secondary" className="text-xs">
                                  {court.sportType}
                                </Badge>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">Price per hour</span>
                                  <span className="font-bold text-primary">${court.pricePerHour}</span>
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <p className="text-muted-foreground">No courts available for this venue</p>
                        </div>
                      )}
                    </Card.Content>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Date & Time Selection */}
              {currentStep >= 2 && selectedCourt && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="mb-6"
                >
                  <Card className="overflow-hidden">
                    <Card.Header className="bg-gradient-to-r from-accent/5 to-primary/5">
                      <Card.Title className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-accent" />
                        </div>
                        Pick Date & Time
                      </Card.Title>
                      <Card.Description>Choose your preferred date and time slot</Card.Description>
                    </Card.Header>
                    
                    <Card.Content className="p-6 space-y-6">
                      {/* Date Selection */}
                      <div>
                        <label className="block text-sm font-medium mb-3">Select Date</label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={handleDateChange}
                          min={format(new Date(), 'yyyy-MM-dd')}
                          className="w-full p-3 border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        />
                      </div>

                      {/* Time Slots */}
                      <div>
                        <label className="block text-sm font-medium mb-3">Available Time Slots</label>
                        {courtLoading ? (
                          <div className="flex justify-center p-8">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-2"></div>
                              <p className="text-sm text-muted-foreground">Loading time slots...</p>
                            </div>
                          </div>
                        ) : availableTimeSlots.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {availableTimeSlots.map((slot, index) => (
                              <motion.button
                                key={index}
                                disabled={!slot.available}
                                onClick={() => handleTimeSlotSelection(slot)}
                                className={`
                                  p-3 text-sm text-center border-2 rounded-lg transition-all duration-200
                                  ${!slot.available 
                                    ? 'bg-muted/50 text-muted-foreground cursor-not-allowed opacity-50 border-muted' 
                                    : selectedTimeSlot?.startTime === slot.startTime
                                      ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                                      : 'border-border hover:border-primary hover:bg-primary/5'
                                  }
                                `}
                                whileHover={slot.available ? { scale: 1.05 } : {}}
                                whileTap={slot.available ? { scale: 0.95 } : {}}
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">{slot.startTime}</span>
                                  <span className="text-xs opacity-75">to {slot.endTime}</span>
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-muted/30 rounded-lg">
                            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                            <p className="text-muted-foreground">No time slots available for this date</p>
                          </div>
                        )}
                      </div>
                    </Card.Content>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-24"
            >
              <Card className="overflow-hidden border-2 border-primary/20 shadow-xl">
                <Card.Header className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                  <Card.Title className="flex items-center gap-2 text-white">
                    <CreditCard className="w-5 h-5" />
                    Booking Summary
                  </Card.Title>
                </Card.Header>
                
                <Card.Content className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Venue</span>
                      <span className="font-medium text-right">{venue.name}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Court</span>
                      <span className="font-medium text-right">
                        {selectedCourt?.name || (
                          <span className="text-muted-foreground text-sm">Not selected</span>
                        )}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Sport</span>
                      <span className="font-medium text-right">
                        {selectedCourt?.sportType || (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Date</span>
                      <span className="font-medium text-right">
                        {selectedDate ? format(new Date(selectedDate), 'MMM d, yyyy') : (
                          <span className="text-muted-foreground text-sm">Not selected</span>
                        )}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Time</span>
                      <span className="font-medium text-right">
                        {selectedTimeSlot ? (
                          <span className="text-primary">{selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}</span>
                        ) : (
                          <span className="text-muted-foreground text-sm">Not selected</span>
                        )}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Duration</span>
                      <span className="font-medium">
                        {selectedTimeSlot ? 
                          `${parseInt(selectedTimeSlot.endTime) - parseInt(selectedTimeSlot.startTime)} hour(s)` 
                          : '-'
                        }
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button
                      className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={!selectedCourt || !selectedDate || !selectedTimeSlot || bookingLoading}
                      onClick={handleBooking}
                    >
                      {bookingLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          <span>Confirm Booking</span>
                        </div>
                      )}
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground text-center bg-muted/30 p-3 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Shield className="w-3 h-3" />
                      <span className="font-medium">Secure Payment</span>
                    </div>
                    <p>Your payment information is protected with bank-level security</p>
                  </div>
                </Card.Content>
              </Card>

              {/* Quick Info */}
              <Card className="mt-4">
                <Card.Content className="p-4">
                  <div className="text-center">
                    <h4 className="font-medium mb-2">Need Help?</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Contact our support team for assistance
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Info className="w-4 h-4 mr-2" />
                      Get Support
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}