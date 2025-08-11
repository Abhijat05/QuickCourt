import { UserStats } from "./UserStats";
import { BookingsPanel } from "./BookingsPanel";
import { useBookingUtils } from "../../../hooks/useBookingUtils";

export function UserMainContent({ 
  dashboardData, 
  userBookings, 
  activeTab, 
  setActiveTab,
  onCancelBooking 
}) {
  const { filterBookings, getBookingStatus, getStatusBadge, getStatusIcon } = useBookingUtils();

  // Get filtered bookings based on status
  const upcomingBookings = filterBookings(userBookings, 'upcoming');
  const pastBookings = [
    ...filterBookings(userBookings, 'completed'), 
    ...filterBookings(userBookings, 'cancelled')
  ];

  return (
    <>
      <UserStats data={dashboardData} />
      <BookingsPanel
        upcomingBookings={upcomingBookings}
        pastBookings={pastBookings}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onCancelBooking={onCancelBooking}
        getBookingStatus={getBookingStatus}
        getStatusBadge={getStatusBadge}
        getStatusIcon={getStatusIcon}
      />
    </>
  );
}