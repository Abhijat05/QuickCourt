import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '../components/ui/Breadcrumb';
import { Calendar, Clock, MapPin, ChevronRight, Search, Filter } from 'lucide-react';

export default function UserBookings() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled

  useEffect(() => {
    // Simulate loading bookings data
    setTimeout(() => {
      // Mock bookings data
      const mockBookings = [
        {
          id: 1,
          courtName: "Downtown Tennis Club - Court 2",
          venueName: "Downtown Tennis Club",
          date: "2023-06-15",
          startTime: "10:00",
          endTime: "12:00",
          sport: "Tennis",
          price: 25.00,
          status: "confirmed"
        },
        {
          id: 2,
          courtName: "City Basketball Arena - Court A",
          venueName: "City Basketball Arena",
          date: "2023-06-20",
          startTime: "16:00",
          endTime: "18:00",
          sport: "Basketball",
          price: 30.00,
          status: "confirmed"
        },
        {
          id: 3,
          courtName: "Sportsville Badminton - Court 4",
          venueName: "Sportsville",
          date: "2023-05-30",
          startTime: "14:00",
          endTime: "16:00",
          sport: "Badminton",
          price: 20.00,
          status: "completed"
        },
        {
          id: 4,
          courtName: "Riverside Courts - Tennis Court 1",
          venueName: "Riverside Courts",
          date: "2023-06-02",
          startTime: "09:00",
          endTime: "11:00",
          sport: "Tennis",
          price: 28.00,
          status: "cancelled"
        }
      ];
      
      setBookings(mockBookings);
      setIsLoading(false);
    }, 1000);

    // In a real app, you would fetch the user's bookings
    // Example: bookingService.getUserBookings().then(data => setBookings(data));
  }, []);

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') {
      return booking.status === 'confirmed' && new Date(booking.date) >= new Date();
    }
    if (filter === 'past') {
      return booking.status === 'completed' || new Date(booking.date) < new Date();
    }
    if (filter === 'cancelled') {
      return booking.status === 'cancelled';
    }
    return true;
  });

  const getSportIcon = (sport) => {
    switch(sport) {
      case 'Tennis': return '🎾';
      case 'Basketball': return '🏀';
      case 'Badminton': return '🏸';
      case 'Football': return '⚽';
      case 'Volleyball': return '🏐';
      default: return '🏆';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed':
        return <Badge variant="success">Confirmed</Badge>;
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="container max-w-5xl mx-auto px-4 py-8 mt-16 mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink to="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span className="font-medium text-foreground">My Bookings</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">View and manage all your court reservations</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search bookings" 
              className="pl-9 pr-4 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            <span>Filter</span>
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="inline-flex rounded-md border border-input p-1 bg-background">
          <button 
            className={`px-4 py-2 text-sm rounded-md ${filter === 'all' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`px-4 py-2 text-sm rounded-md ${filter === 'upcoming' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={`px-4 py-2 text-sm rounded-md ${filter === 'past' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            onClick={() => setFilter('past')}
          >
            Past
          </button>
          <button 
            className={`px-4 py-2 text-sm rounded-md ${filter === 'cancelled' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>
      </div>

      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/5 bg-muted p-6 flex items-center justify-center">
                  <div className="text-4xl">{getSportIcon(booking.sport)}</div>
                </div>
                <div className="flex-1 p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                    <h3 className="text-lg font-medium mb-1 md:mb-0">{booking.courtName}</h3>
                    {getStatusBadge(booking.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar size={16} />
                      <span>{formatDate(booking.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock size={16} />
                      <span>{booking.startTime} - {booking.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin size={16} />
                      <span>{booking.venueName}</span>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-3 border-t">
                    <div className="text-lg font-medium mb-3 md:mb-0">
                      ${booking.price.toFixed(2)}
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      {booking.status === 'confirmed' && (
                        <Button variant="destructive" size="sm" className="w-full md:w-auto">Cancel</Button>
                      )}
                      <Button variant="outline" size="sm" className="gap-1 w-full md:w-auto">
                        Details
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/30 rounded-lg border border-dashed">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No bookings found</h3>
          <p className="text-muted-foreground mb-6">You don't have any {filter !== 'all' ? filter : ''} bookings yet</p>
          <Button asChild>
            <Link to="/find">Find Courts to Book</Link>
          </Button>
        </div>
      )}
    </motion.div>
  );
}