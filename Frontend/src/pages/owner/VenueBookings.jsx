import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ownerService } from '../../services/api';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Calendar, Clock, MapPin, User, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OwnerVenueBookings() {
  const { venueId } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await ownerService.getVenueBookings(venueId);
        const data = Array.isArray(res.data) ? res.data : [];
        // Backend returns { booking, user, court }
        const flat = data.map(item => ({
          id: item.booking.id,
          date: item.booking.date,
          startTime: item.booking.startTime,
          endTime: item.booking.endTime,
          status: item.booking.status,
          userName: item.user?.fullName,
          userEmail: item.user?.email,
          courtName: item.court?.name,
          sportType: item.court?.sportType,
        }));
        setBookings(flat);
      } catch (err) {
        console.error('Error fetching venue bookings:', err);
        toast.error('Failed to load venue bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [venueId]);

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
          <Link to="/owner/venues">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Venues
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Venue Bookings</h1>
        <div />
      </div>

      {bookings.length === 0 ? (
        <Card className="p-8 text-center">
          <Calendar className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-medium mb-1">No bookings yet</h3>
          <p className="text-sm text-muted-foreground">Bookings will appear here once customers start booking your courts.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map(b => (
            <Card key={b.id} className="p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <div className="font-semibold">{b.courtName} {b.sportType ? `• ${b.sportType}` : ''}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{new Date(b.date).toLocaleDateString()}</span>
                    <Clock size={14} />
                    <span>{b.startTime} - {b.endTime}</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <User size={14} />
                  <span>{b.userName || 'User'}</span>
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