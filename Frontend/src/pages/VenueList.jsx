import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { venueService } from '../services/api';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { MapPin, Search, Filter, Star, DollarSign, Calendar } from 'lucide-react';

export default function VenueList() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState('');

  const sportTypes = ['All', 'Tennis', 'Basketball', 'Football', 'Badminton', 'Volleyball', 'Swimming'];

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await venueService.getAllVenues();
        setVenues(response.data);
      } catch (err) {
        setError('Failed to load venues');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         venue.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSport = sportFilter === '' || 
                         sportFilter === 'All' || 
                         venue.sportTypes.includes(sportFilter);
    
    return matchesSearch && matchesSport;
  });

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

  if (loading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 mt-16 text-center">
        <h2 className="text-2xl font-bold mb-2">Error</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Find Courts</h1>
          <p className="text-muted-foreground">Discover and book sports venues near you</p>
        </div>

        <div className="w-full md:w-auto flex gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search venues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-input"
            />
          </div>
          <Button variant="outline" className="shrink-0">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
        {sportTypes.map(sport => (
          <Button
            key={sport}
            variant={sportFilter === sport ? "default" : "outline"}
            className="px-4 py-1 h-auto"
            onClick={() => setSportFilter(sport === 'All' ? '' : sport)}
          >
            {sport}
          </Button>
        ))}
      </div>

      {filteredVenues.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-1">No venues found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredVenues.map(venue => (
            <motion.div key={venue.id} variants={itemVariants}>
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                <Link to={`/venues/${venue.id}`} className="block">
                  <div className="relative h-48">
                    {venue.images && venue.images.length > 0 ? (
                      <img 
                        src={venue.images[0]} 
                        alt={venue.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <MapPin className="h-12 w-12 text-muted-foreground opacity-20" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-accent text-white">
                        {venue.sportTypes[0]}
                      </Badge>
                    </div>
                  </div>
                </Link>
                
                <Card.Content className="p-4">
                  <Link to={`/venues/${venue.id}`} className="block">
                    <h3 className="text-lg font-semibold mb-1 hover:text-primary transition-colors">
                      {venue.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center gap-1 mb-2 text-sm">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground truncate">{venue.address}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{venue.averageRating?.toFixed(1) || 'New'}</span>
                      <span className="text-muted-foreground text-sm">({venue.reviewCount || 0})</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-success" />
                      <span className="font-medium">${venue.pricePerHour}/hr</span>
                    </div>
                  </div>
                  
                  <Button className="w-full gap-2">
                    <Calendar className="h-4 w-4" />
                    Book Now
                  </Button>
                </Card.Content>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}