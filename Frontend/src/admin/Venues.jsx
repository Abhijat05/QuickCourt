import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService, venueService } from '../services/api';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
  CheckCircle, 
  AlertTriangle, 
  MapPin, 
  ChevronRight,
  Plus,
  Search,
  Filter,
  Users,
  TrendingUp,
  BarChart3,
  Clock,
  Eye,
  Grid3x3,
  List,
  Download,
  RefreshCw,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminVenues() {
  const [venues, setVenues] = useState([]);
  const [pendingVenues, setPendingVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [rejectingId, setRejectingId] = useState(null);
  const [showRejectBox, setShowRejectBox] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      setIsLoading(true);
      const [allVenuesRes, pendingVenuesRes] = await Promise.all([
        venueService.getAllVenues(),
        adminService.getPendingVenues()
      ]);
      setVenues(allVenuesRes.data || []);
      setPendingVenues(pendingVenuesRes.data || []);
    } catch (err) {
      console.error('Error fetching venues:', err);
      toast.error('Failed to load venues');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveVenue = async (venueId) => {
    try {
      await adminService.approveVenue(venueId);
      setPendingVenues(prev => prev.filter(v => v.id !== venueId));
      const approvedVenue = pendingVenues.find(v => v.id === venueId);
      if (approvedVenue) {
        setVenues(prev => [...prev, { ...approvedVenue, approved: true }]);
      }
      toast.success('Venue approved successfully');
    } catch (err) {
      console.error('Error approving venue:', err);
      toast.error('Failed to approve venue');
    }
  };

  const handleRejectVenue = async (venueId) => {
    if (!rejectReason.trim()) {
      toast.error('Enter a reason');
      return;
    }
    try {
      setRejectingId(venueId);
      await adminService.rejectVenue(venueId, rejectReason.trim());
      // remove from pending
      setPendingVenues(prev => prev.filter(v => v.id !== venueId));
      toast.success('Venue rejected');
      setShowRejectBox(null);
      setRejectReason('');
    } catch (e) {
      console.error('Reject failed', e);
      toast.error(e.response?.data?.message || 'Reject failed');
    } finally {
      setRejectingId(null);
    }
  };

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.address?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredPendingVenues = pendingVenues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.address?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    totalVenues: venues.length,
    pendingApproval: pendingVenues.length,
    totalCourts: venues.reduce((sum, venue) => sum + (venue.courts?.length || 0), 0),
    averageRating: venues.length > 0 ? 
      (venues.reduce((sum, venue) => sum + (venue.averageRating || 0), 0) / venues.length).toFixed(1) : 0
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading venues...</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Manage Venues
              </h1>
              <p className="text-muted-foreground text-lg">Approve and manage all venues in the system</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={fetchVenues} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link to="/admin/venues/pending">
                  Pending Venues 
                  {pendingVenues.length > 0 && (
                    <Badge variant="destructive" className="ml-1">{pendingVenues.length}</Badge>
                  )}
                </Link>
              </Button>
              <Button asChild className="gap-2 shadow-lg">
                <Link to="/admin/venues/new">
                  <Plus className="h-4 w-4" />
                  Add Venue
                </Link>
              </Button>
            </div>
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
                  <p className="text-3xl font-bold text-primary">{stats.totalVenues}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Building className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card className="bg-gradient-to-r from-warning/10 to-warning/5 border-warning/20">
            <Card.Content className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
                  <p className="text-3xl font-bold text-warning">{stats.pendingApproval}</p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card className="bg-gradient-to-r from-success/10 to-success/5 border-success/20">
            <Card.Content className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Courts</p>
                  <p className="text-3xl font-bold text-success">{stats.totalCourts}</p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-success" />
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
            <Card.Content className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                  <p className="text-3xl font-bold text-accent">{stats.averageRating}</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
              </div>
            </Card.Content>
          </Card>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
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
          </div>

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

        {/* Pending Venues Section */}
        {pendingVenues.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Card className="border-2 border-warning/20 bg-warning/5">
              <Card.Header>
                <Card.Title className="flex items-center gap-2 text-warning">
                  <AlertTriangle className="h-5 w-5" />
                  Pending Approval ({pendingVenues.length})
                </Card.Title>
                <Card.Description>
                  These venues are waiting for your review and approval
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredPendingVenues.slice(0, 6).map(venue => (
                    <motion.div
                      key={venue.id}
                      variants={itemVariants}
                      className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{venue.name}</h3>
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                          Pending
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {venue.location || venue.address || "No location"}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {venue.sportTypes?.split(',').slice(0, 2).map((sport, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {sport.trim()}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="success" 
                          size="sm" 
                          onClick={() => handleApproveVenue(venue.id)}
                          disabled={rejectingId === venue.id}
                          className="flex-1"
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setShowRejectBox(showRejectBox === venue.id ? null : venue.id);
                            setRejectReason('');
                          }}
                          disabled={rejectingId === venue.id}
                        >
                          <X className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/venues/${venue.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                      {showRejectBox === venue.id && (
                        <div className="mt-3 p-3 border rounded-md bg-muted/40 space-y-2">
                          <textarea
                            rows={2}
                            placeholder="Reason (required)"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="w-full text-sm p-2 rounded-md border border-input"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectVenue(venue.id)}
                              disabled={rejectingId === venue.id}
                              className="flex-1"
                            >
                              {rejectingId === venue.id ? 'Rejecting...' : 'Confirm Reject'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => { setShowRejectBox(null); setRejectReason(''); }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                {filteredPendingVenues.length > 6 && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" asChild>
                      <Link to="/admin/venues/pending">
                        View All Pending ({pendingVenues.length})
                      </Link>
                    </Button>
                  </div>
                )}
              </Card.Content>
            </Card>
          </motion.div>
        )}

        {/* Approved Venues */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                All Venues ({filteredVenues.length})
              </Card.Title>
              <Card.Description>
                Approved venues available for booking
              </Card.Description>
            </Card.Header>
            <Card.Content>
              {filteredVenues.length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className={
                    viewMode === 'grid' 
                      ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                      : "space-y-4"
                  }
                >
                  {filteredVenues.map(venue => (
                    <motion.div key={venue.id} variants={itemVariants}>
                      {viewMode === 'grid' ? (
                        // Grid View
                        <div className="border rounded-lg p-4 hover:shadow-md transition-all duration-300 hover:border-primary/20">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{venue.name}</h3>
                            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                              Approved
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {venue.location || venue.address || "No location"}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {venue.sportTypes?.split(',').slice(0, 3).map((sport, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {sport.trim()}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-muted-foreground">
                              {venue.courts?.length || 0} courts
                            </div>
                            <Button variant="ghost" size="sm" className="gap-1" asChild>
                              <Link to={`/venues/${venue.id}`}>
                                <span>Details</span>
                                <ChevronRight size={16} />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // List View
                        <div className="border rounded-lg p-4 hover:shadow-md transition-all duration-300">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-medium text-lg">{venue.name}</h3>
                                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {venue.location || venue.address || "No location"}
                                  </p>
                                </div>
                                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                  Approved
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-1">
                                  {venue.sportTypes?.split(',').slice(0, 4).map((sport, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {sport.trim()}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>{venue.courts?.length || 0} courts</span>
                                  <Button variant="ghost" size="sm" className="gap-1" asChild>
                                    <Link to={`/venues/${venue.id}`}>
                                      <span>View Details</span>
                                      <ChevronRight size={16} />
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <Building className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-medium mb-1">No Venues Found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {searchTerm ? 'No venues match your search criteria' : 'There are no approved venues in the system'}
                  </p>
                  {!searchTerm && (
                    <Button asChild>
                      <Link to="/admin/venues/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add First Venue
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </Card.Content>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}