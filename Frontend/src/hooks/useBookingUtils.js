import { createElement } from 'react';
import Badge from '../components/ui/Badge';

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

  return {
    formatBookingDate,
    formatTime,
    getStatusBadge,
    getBookingType,
    filterBookings
  };
}