import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ownerService, adminService } from '../../services/api';
import { bookingService } from '../../services/api'; // ensure this exists in api.js
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Calendar, Clock, User, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function OwnerVenueBookings() {
  const { venueId } = useParams();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const flattenOwnerAdmin = (data) => {
    const arr = Array.isArray(data) ? data : [];
    return arr.map(item => ({
      id: item.booking?.id ?? item.id,
      date: item.booking?.date ?? item.date,
      startTime: item.booking?.startTime ?? item.startTime,
      endTime: item.booking?.endTime ?? item.endTime,
      status: item.booking?.status ?? item.status,
      userName: item.user?.fullName,
      userEmail: item.user?.email,
      courtName: item.court?.name,
      sportType: item.court?.sportType,
    }));
  };

  const flattenUser = (data) => {
    const arr = Array.isArray(data) ? data : [];
    return arr.map(item => ({
      id: item.id,
      date: item.date,
      startTime: item.startTime,
      endTime: item.endTime,
      status: item.status,
      // if API includes joined court/venue fields, map them
      courtName: item.court?.name,
      sportType: item.court?.sportType,
      venueId: item.court?.venueId ?? item.venueId,
    })).filter(b => String(b.venueId) === String(venueId));
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        if (user?.role === 'admin') {
          // Prefer admin route if available, else owner route that allows admin
          const res = await (adminService.getVenueBookings
            ? adminService.getVenueBookings(venueId)
            : ownerService.getVenueBookings(venueId));
          setBookings(flattenOwnerAdmin(res.data));
        } else if (user?.role === 'owner') {
          const res = await ownerService.getVenueBookings(venueId);
          setBookings(flattenOwnerAdmin(res.data));
        } else {
          // Regular user: load your bookings and filter to this venue
          const res = await bookingService.getAllUserBookings();
          setBookings(flattenUser(res.data));
        }
      } catch (err) {
        console.error('Error fetching venue bookings:', err);
        toast.error(err.response?.data?.message || 'Failed to load bookings');
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [venueId, user?.role, refreshKey]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Bookings</h1>
        <Button variant="outline" onClick={() => setRefreshKey(k => k + 1)}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>

      {bookings.length === 0 ? (
        <Card className="p-8 text-center">
          <Calendar className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-medium mb-1">No bookings found</h3>
          <p className="text-sm text-muted-foreground">Bookings will appear here once created.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map(b => (
            <Card key={b.id} className="p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <div className="font-semibold">{b.courtName || 'Court'} {b.sportType ? `• ${b.sportType}` : ''}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{b.date ? new Date(b.date).toLocaleDateString() : '-'}</span>
                    <Clock size={14} />
                    <span>{b.startTime} - {b.endTime}</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <User size={14} />
                  <span>{b.userName || 'You'}</span>
                  {b.userEmail && <span className="hidden sm:inline">• {b.userEmail}</span>}
                </div>
                <div className="text-xs px-2 py-1 rounded bg-muted inline-flex">
                  {b.status}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}