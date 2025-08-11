import { useState } from 'react';
import { Card } from '../../ui/Card';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import { Calendar, CalendarCheck, MapPin, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export function BookingsPanel({ 
  upcomingBookings, 
  pastBookings, 
  activeTab, 
  setActiveTab, 
  onCancelBooking,
  getBookingStatus,
  getStatusBadge,
  getStatusIcon
}) {
  const [isConfirming, setIsConfirming] = useState(null);
  
  const renderBookingCard = (booking) => {
    const status = booking.status || 'confirmed';
    const isUpcoming = getBookingStatus(booking) === 'upcoming';
    
    return (
      <motion.div 
        key={booking.id}
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="border border-border rounded-lg p-4 mb-4 last:mb-0"
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium text-lg">{booking.courtName}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin size={14} />
              {booking.venueName}
            </p>
          </div>
          {getStatusBadge(getBookingStatus(booking))}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Calendar size={12} /> Date
            </span>
            <span className="text-sm font-medium">
              {format(new Date(booking.date), 'MMMM d, yyyy')}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Clock size={12} /> Time
            </span>
            <span className="text-sm font-medium">
              {booking.startTime} - {booking.endTime}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <CalendarCheck size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">
              {isUpcoming ? 'Upcoming' : 'Past booking'}
            </span>
          </div>
          
          {isUpcoming && (
            <>
              {isConfirming === booking.id ? (
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => {
                      onCancelBooking(booking.id);
                      setIsConfirming(null);
                    }}
                  >
                    Confirm
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setIsConfirming(null)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsConfirming(booking.id)}
                >
                  Cancel Booking
                </Button>
              )}
            </>
          )}
        </div>
      </motion.div>
    );
  };
  
  return (
    <Card>
      <Card.Header>
        <Card.Title className="flex items-center gap-2">
          <CalendarCheck className="h-5 w-5 text-primary" />
          Your Bookings
        </Card.Title>
        <Card.Description>Manage your court reservations</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="flex border-b mb-4">
          <button
            className={`pb-2 px-4 text-sm font-medium ${activeTab === 'upcoming' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming ({upcomingBookings.length})
          </button>
          <button
            className={`pb-2 px-4 text-sm font-medium ${activeTab === 'past' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('past')}
          >
            Past ({pastBookings.length})
          </button>
        </div>
        
        <AnimatePresence mode="wait">
          <div className="space-y-4">
            {activeTab === 'upcoming' && (
              <>
                {upcomingBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                      <Calendar className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-lg mb-1">No upcoming bookings</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      You don't have any upcoming court reservations
                    </p>
                    <Button>Book a Court</Button>
                  </div>
                ) : (
                  upcomingBookings.map(renderBookingCard)
                )}
              </>
            )}
            
            {activeTab === 'past' && (
              <>
                {pastBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                      <Clock className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-lg mb-1">No past bookings</h3>
                    <p className="text-sm text-muted-foreground">
                      You haven't made any bookings yet
                    </p>
                  </div>
                ) : (
                  pastBookings.map(renderBookingCard)
                )}
              </>
            )}
          </div>
        </AnimatePresence>
      </Card.Content>
    </Card>
  );
}