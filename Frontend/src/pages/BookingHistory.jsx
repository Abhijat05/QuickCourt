import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '../components/ui/Breadcrumb';
import { Calendar, Clock, MapPin, Download, ChevronDown } from 'lucide-react';

export default function BookingHistory() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [bookingsByMonth, setBookingsByMonth] = useState({});
  const [expandedMonths, setExpandedMonths] = useState({});

  useEffect(() => {
    // Simulate loading bookings data
    setTimeout(() => {
      // Mock bookings data grouped by month
      const mockBookingsByMonth = {
        'May 2023': [
          {
            id: 1,
            courtName: "Downtown Tennis Club - Court 2",
            venueName: "Downtown Tennis Club",
            date: "2023-05-15",
            startTime: "10:00",
            endTime: "12:00",
            sport: "Tennis",
            price: 25.00,
            status: "completed"
          },
          {
            id: 2,
            courtName: "Sportsville Badminton - Court 4",
            venueName: "Sportsville",
            date: "2023-05-22",
            startTime: "14:00",
            endTime: "16:00",
            sport: "Badminton",
            price: 20.00,
            status: "completed"
          }
        ],
        'April 2023': [
          {
            id: 3,
            courtName: "City Basketball Arena - Court A",
            venueName: "City Basketball Arena",
            date: "2023-04-18",
            startTime: "16:00",
            endTime: "18:00",
            sport: "Basketball",
            price: 30.00,
            status: "completed"
          },
          {
            id: 4,
            courtName: "Riverside Courts - Tennis Court 1",
            venueName: "Riverside Courts",
            date: "2023-04-05",
            startTime: "09:00",
            endTime: "11:00",
            sport: "Tennis",
            price: 28.00,
            status: "cancelled"
          }
        ],
        'March 2023': [
          {
            id: 5,
            courtName: "Ocean View Pool - Lane 3",
            venueName: "Ocean View Sports Center",
            date: "2023-03-25",
            startTime: "15:00",
            endTime: "17:00",
            sport: "Swimming",
            price: 15.00,
            status: "completed"
          }
        ]
      };
      
      setBookingsByMonth(mockBookingsByMonth);
      
      // Expand the most recent month by default
      const initialExpanded = {};
      Object.keys(mockBookingsByMonth).forEach((month, index) => {
        initialExpanded[month] = index === 0;
      });
      setExpandedMonths(initialExpanded);
      
      setIsLoading(false);
    }, 1000);

    // In a real app, you would fetch the user's booking history
    // Example: userService.getBookingHistory().then(data => setBookingsByMonth(data.groupedBookings));
  }, []);

  const toggleMonth = (month) => {
    setExpandedMonths({
      ...expandedMonths,
      [month]: !expandedMonths[month]
    });
  };

  const getSportIcon = (sport) => {
    switch(sport) {
      case 'Tennis': return '🎾';
      case 'Basketball': return '🏀';
      case 'Badminton': return '🏸';
      case 'Football': return '⚽';
      case 'Volleyball': return '🏐';
      case 'Swimming': return '🏊‍♂️';
      default: return '🏆';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return <Badge>Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
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
            <span className="font-medium text-foreground">Booking History</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Booking History</h1>
          <p className="text-muted-foreground">View your past court reservations</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download size={16} />
          <span>Export History</span>
        </Button>
      </div>

      {Object.keys(bookingsByMonth).length > 0 ? (
        <div className="space-y-6">
          {Object.keys(bookingsByMonth).map((month) => (
            <div key={month} className="border border-border rounded-lg overflow-hidden">
              <div 
                className="bg-muted/50 py-4 px-6 flex items-center justify-between cursor-pointer"
                onClick={() => toggleMonth(month)}
              >
                <h3 className="text-lg font-medium">{month}</h3>
                <ChevronDown size={20} className={`transition-transform ${expandedMonths[month] ? 'rotate-180' : ''}`} />
              </div>
              
              {expandedMonths[month] && (
                <div className="p-4 space-y-4">
                  {bookingsByMonth[month].map((booking) => (
                    <Card key={booking.id} className="overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-1/6 bg-muted p-4 flex items-center justify-center">
                          <div className="text-3xl">{getSportIcon(booking.sport)}</div>
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                            <h4 className="font-medium mb-1 sm:mb-0">{booking.courtName}</h4>
                            {getStatusBadge(booking.status)}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar size={14} />
                              <span>{formatDate(booking.date)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock size={14} />
                              <span>{booking.startTime} - {booking.endTime}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin size={14} />
                              <span>{booking.venueName}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3 pt-2 border-t text-sm">
                            <div className="font-medium">
                              ${booking.price.toFixed(2)}
                            </div>
                            <Button variant="ghost" size="sm">View Details</Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/30 rounded-lg border border-dashed">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No booking history</h3>
          <p className="text-muted-foreground mb-6">You don't have any past bookings</p>
        </div>
      )}
    </motion.div>
  );
}