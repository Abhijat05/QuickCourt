import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ownerService } from '../../services/api';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
  MapPin, 
  Plus, 
  ChevronRight, 
  Calendar,
  Eye,
  BarChart3,
  Users,
  DollarSign,
  Clock,
  Filter,
  Search,
  Grid3x3,
  List,
  TrendingUp,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function VenueManagement() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'approved', 'pending'

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const response = await ownerService.getOwnerVenues();
        setVenues(response.data || []);
      } catch (err) {
        console.error('Error fetching venues:', err);
        toast.error('Failed to load your venues');
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'approved' && venue.approved) ||
                         (statusFilter === 'pending' && !venue.approved);
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: venues.length,
    approved: venues.filter(v => v.approved).length,
    pending: venues.filter(v => !v.approved).length,
    totalCourts: venues.reduce((sum, venue) => sum + (venue.courts?.length || 0), 0)
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your venues...</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20"
    >
      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                My Venues
              </h1>
              <p className="text-muted-foreground text-lg">Manage your sports venues and track performance</p>
            </div>
            <Button 
              asChild 
              size="lg" 
              className="shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link to="/owner/venues/new">
                <Plus className="mr-2 h-5 w-5" />
                Add New Venue
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <Card.Content className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Venues</p>
                  <p className="text-3xl font-bold text-primary">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Building className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card className="bg-gradient-to-r from-success/10 to-success/5 border-success/20">
            <Card.Content className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-3xl font-bold text-success">{stats.approved}</p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card className="bg-gradient-to-r from-warning/10 to-warning/5 border-warning/20">
            <Card.Content className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold text-warning">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-warning" />
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
            <Card.Content className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Courts</p>
                  <p className="text-3xl font-bold text-accent">{stats.totalCourts}</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-accent" />
                </div>
              </div>
            </Card.Content>
          </Card>
        </motion.div>

        {/* Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search venues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-input focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-input focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="px-3"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="px-3"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Venues Section */}
        <AnimatePresence mode="wait">
          {filteredVenues.length > 0 ? (
            <motion.div
              key={viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              variants={containerVariants}
              className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {filteredVenues.map(venue => (
                <motion.div key={venue.id} variants={itemVariants}>
                  {viewMode === 'grid' ? (
                    // Grid View
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-2 hover:border-primary/20">
                      <div className="relative h-48 bg-muted overflow-hidden">
                        {venue.images && venue.images.length > 0 ? (
                          <img 
                            src={venue.images[0]} 
                            alt={venue.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                            <Building className="h-16 w-16 text-muted-foreground/30" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <Badge className={venue.approved ? 'bg-success shadow-lg' : 'bg-warning shadow-lg'}>
                            {venue.approved ? 'Approved' : 'Pending'}
                          </Badge>
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      </div>
                      
                      <Card.Content className="p-6">
                        <div className="mb-4">
                          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                            {venue.name}
                          </h3>
                          <p className="text-muted-foreground flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4" />
                            {venue.address || venue.location || "No location"}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {typeof venue.sportTypes === 'string' ? 
                            venue.sportTypes.split(',').map((sport, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {sport.trim()}
                              </Badge>
                            )) : 
                            venue.sportTypes?.map((sport, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {sport}
                              </Badge>
                            ))
                          }
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-muted/30 rounded-lg">
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Courts</p>
                            <p className="font-bold text-lg">{venue.courts?.length || 0}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Base Price</p>
                            <p className="font-bold text-lg">${venue.pricePerHour || 0}</p>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-center"
                            asChild
                          >
                            <Link to={`/owner/venues/${venue.id}/bookings`}>
                              <Calendar className="mr-1 h-4 w-4" />
                              Bookings
                            </Link>
                          </Button>
                        </div>
                      </Card.Content>
                    </Card>
                  ) : (
                    // List View
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                      <Card.Content className="p-6">
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            {venue.images && venue.images.length > 0 ? (
                              <img 
                                src={venue.images[0]} 
                                alt={venue.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Building className="h-8 w-8 text-muted-foreground/50" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-xl font-semibold mb-1">{venue.name}</h3>
                                <p className="text-muted-foreground flex items-center gap-1 text-sm">
                                  <MapPin className="h-3 w-3" />
                                  {venue.address || venue.location || "No location"}
                                </p>
                              </div>
                              <Badge className={venue.approved ? 'bg-success' : 'bg-warning'}>
                                {venue.approved ? 'Approved' : 'Pending'}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-3">
                              {typeof venue.sportTypes === 'string' ? 
                                venue.sportTypes.split(',').slice(0, 3).map((sport, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {sport.trim()}
                                  </Badge>
                                )) : 
                                venue.sportTypes?.slice(0, 3).map((sport, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {sport}
                                  </Badge>
                                ))
                              }
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  <span>{venue.courts?.length || 0} courts</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  <span>${venue.pricePerHour || 0}/hr</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" asChild>
                                  <Link to={`/owner/venues/${venue.id}/bookings`}>
                                    <Calendar className="mr-1 h-4 w-4" />
                                    Bookings
                                  </Link>
                                </Button>
                                <Button variant="ghost" size="sm" asChild>
                                  <Link to={`/venues/${venue.id}`}>
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card.Content>
                    </Card>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-2 border-dashed border-muted">
                <Card.Content className="py-16 text-center">
                  {venues.length === 0 ? (
                    <>
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Building className="h-10 w-10 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold mb-3">No Venues Yet</h2>
                      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                        You haven't created any venues yet. Create your first venue to start accepting bookings and grow your business.
                      </p>
                      <Button asChild size="lg" className="shadow-lg">
                        <Link to="/owner/venues/new">
                          <Plus className="mr-2 h-5 w-5" />
                          Add Your First Venue
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">No venues found</h3>
                      <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                    </>
                  )}
                </Card.Content>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}