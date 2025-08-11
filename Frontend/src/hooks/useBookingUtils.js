import { createElement } from 'react';
import Badge from '../components/ui/Badge';
import { CheckCircle, XCircle, Clock, CalendarClock } from 'lucide-react'; // added icons

export function useBookingUtils() {
  // Format a booking date to readable format
  const formatBookingDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format time from 24-hour to 12-hour
  const formatTime = (time24) => {
    const [hour, minute] = time24.split(':');
    const hourNum = parseInt(hour);
    const suffix = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12;
    return `${hour12}:${minute} ${suffix}`;
  };

  // Get status badge based on booking status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
      case 'upcoming':
        return createElement(Badge, { variant: "success", className: "text-xs" }, "Confirmed");
      case 'completed':
        return createElement(Badge, { variant: "outline", className: "text-xs" }, "Completed");
      case 'cancelled':
        return createElement(Badge, { variant: "destructive", className: "text-xs" }, "Cancelled");
      default:
        return createElement(Badge, { variant: "secondary", className: "text-xs" }, status);
    }
  };

  // Calculate if a booking is active, upcoming, or past
  const getBookingType = (booking) => {
    const now = new Date();
    const bookingDate = new Date(booking.date);
    const startHour = parseInt(booking.startTime.split(':')[0]);
    const endHour = parseInt(booking.endTime.split(':')[0]);
    
    bookingDate.setHours(startHour);
    const endTime = new Date(bookingDate);
    endTime.setHours(endHour);
    
    if (endTime < now) {
      return 'past';
    } else if (bookingDate > now) {
      return 'upcoming';
    } else {
      return 'active';
    }
  };

  // Filter bookings by type (active, upcoming, past, all)
  const filterBookings = (bookings, type) => {
    if (!bookings || !Array.isArray(bookings)) {
      return [];
    }

    if (type === 'all') {
      return bookings;
    }

    return bookings.filter(booking => {
      const bookingType = getBookingType(booking);
      return bookingType === type;
    });
  };

  // NEW: derive a normalized booking status used by panels
  const getBookingStatus = (booking) => {
    // Prefer explicit backend status if present
    if (booking.status === 'cancelled') return 'cancelled';
    if (booking.status === 'completed') return 'completed';
    if (booking.status === 'confirmed') return 'upcoming';
    // Fallback to time-based classification
    const type = getBookingType(booking); // existing helper
    if (type === 'past') return 'completed';
    if (type === 'active') return 'upcoming';
    return type; // 'upcoming' already or other
  };

  // NEW: status icon helper (optional)
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return createElement(CheckCircle, { className: 'w-4 h-4 text-success' });
      case 'cancelled':
        return createElement(XCircle, { className: 'w-4 h-4 text-destructive' });
      case 'upcoming':
      case 'confirmed':
        return createElement(CalendarClock, { className: 'w-4 h-4 text-primary' });
      default:
        return createElement(Clock, { className: 'w-4 h-4 text-muted-foreground' });
    }
  };

  return {
    formatBookingDate,
    formatTime,
    getStatusBadge,
    getBookingType,
    filterBookings,
    getBookingStatus, // added
    getStatusIcon     // added
  };
}