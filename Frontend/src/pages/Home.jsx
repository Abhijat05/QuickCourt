import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16 animate-fade-in-up">
        <div className="mb-8">
          {/* Geometric Pattern Instead of Logo */}
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full animate-spin-slow opacity-20"></div>
              <div className="absolute inset-2 bg-gradient-to-l from-accent to-success rounded-full animate-pulse"></div>
              <div className="absolute inset-4 bg-gradient-to-r from-success to-primary rounded-full animate-bounce-slow"></div>
              <div className="absolute inset-6 bg-background rounded-full flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" x2="9.01" y1="9" y2="9"></line>
                  <line x1="15" x2="15.01" y1="9" y2="9"></line>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent leading-tight">
          Welcome to QuickCourt
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
          Find and book sports courts near you with ease! QuickCourt is the simplest way to discover and reserve tennis, basketball, badminton courts and more.
        </p>
        
        {/* Interactive Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <div className="text-sm text-muted-foreground">Courts Available</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">10K+</div>
            <div className="text-sm text-muted-foreground">Happy Players</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-success mb-2">50+</div>
            <div className="text-sm text-muted-foreground">Cities</div>
          </div>
        </div>
        
        {!user && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="shadow-glow hover:shadow-glow-accent transition-all duration-300">
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="hover:bg-accent hover:text-accent-foreground border-accent/50">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        )}
        
        {user && (
          <Button size="lg" asChild className="shadow-glow animate-pulse-success">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        )}
      </div>
      
      {/* Features Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Why Choose QuickCourt?
        </h2>
        <p className="text-center text-muted-foreground mb-10">Discover what makes QuickCourt the best choice for sports enthusiasts</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover:shadow-glow transition-all duration-300 hover:-translate-y-2 border-border/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full"></div>
            <Card.Header>
              <div className="rounded-full bg-gradient-primary w-16 h-16 flex items-center justify-center mb-4 mx-auto shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
                  <path d="M18 14h-8"></path>
                  <path d="M15 18h-5"></path>
                  <path d="M10 6h8v4h-8V6Z"></path>
                </svg>
              </div>
              <Card.Title className="text-center text-xl">Lightning Fast Booking</Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-center text-muted-foreground">
                Reserve your favorite court in under 30 seconds. Our streamlined process eliminates the hassle of traditional booking.
              </p>
            </Card.Content>
          </Card>
          
          <Card className="hover:shadow-glow-accent transition-all duration-300 hover:-translate-y-2 border-border/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-full"></div>
            <Card.Header>
              <div className="rounded-full bg-gradient-to-br from-accent to-info w-16 h-16 flex items-center justify-center mb-4 mx-auto shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <Card.Title className="text-center text-xl">Smart Location Finder</Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-center text-muted-foreground">
                AI-powered location search finds the perfect courts near you. Filter by distance, amenities, and real-time availability.
              </p>
            </Card.Content>
          </Card>
          
          <Card className="hover:shadow-success transition-all duration-300 hover:-translate-y-2 border-border/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-success/10 to-transparent rounded-bl-full"></div>
            <Card.Header>
              <div className="rounded-full bg-gradient-success w-16 h-16 flex items-center justify-center mb-4 mx-auto shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path>
                </svg>
              </div>
              <Card.Title className="text-center text-xl">Community Reviews</Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-center text-muted-foreground">
                Real reviews from verified players. Make informed decisions with detailed ratings and authentic feedback.
              </p>
            </Card.Content>
          </Card>
        </div>
      </div>
      
      {/* Sports Section with Enhanced Design */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-success to-primary bg-clip-text text-transparent">Popular Sports</h2>
        <p className="text-center text-muted-foreground mb-10">Book courts for your favorite sports and discover new ones</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'Tennis', icon: '🎾', color: 'from-emerald-400 to-teal-500', popular: true },
            { name: 'Basketball', icon: '🏀', color: 'from-orange-400 to-red-500', popular: true },
            { name: 'Badminton', icon: '🏸', color: 'from-purple-400 to-pink-500', popular: false },
            { name: 'Football', icon: '⚽', color: 'from-green-400 to-blue-500', popular: true },
            { name: 'Volleyball', icon: '🏐', color: 'from-yellow-400 to-orange-500', popular: false },
            { name: 'Swimming', icon: '🏊‍♂️', color: 'from-blue-400 to-cyan-500', popular: false },
            { name: 'Squash', icon: '🥍', color: 'from-red-400 to-pink-500', popular: false },
            { name: 'Table Tennis', icon: '🏓', color: 'from-indigo-400 to-purple-500', popular: false }
          ].map((sport) => (
            <div key={sport.name} className="flex flex-col items-center group cursor-pointer relative">
              {sport.popular && (
                <Badge variant="success" className="absolute -top-2 -right-2 z-10 text-xs">
                  Popular
                </Badge>
              )}
              <div className={`h-28 w-28 rounded-2xl bg-gradient-to-br ${sport.color} flex flex-col items-center justify-center mb-3 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/10 rounded-2xl"></div>
                <span className="text-3xl mb-1">{sport.icon}</span>
                <span className="text-xs font-medium text-white/80">{sport.name}</span>
              </div>
              <span className="font-medium text-center text-sm">{sport.name}</span>
              <Badge variant="outline" className="mt-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 text-xs">
                Book Now
              </Badge>
            </div>
          ))}
        </div>
      </div>
      
      {/* Enhanced CTA Section */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-success opacity-90"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-white p-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Play?</h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Join thousands of sports enthusiasts who use QuickCourt to find and book courts. 
              Sign up today and get your first booking at 20% off!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300">
                <Link to="/signup">Create Free Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                <Link to="/login">Already a Member?</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}