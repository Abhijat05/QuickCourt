// filepath: d:\Code PlayGround\QuickCourt\Frontend\src\pages\Home.jsx
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
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Welcome to QuickCourt
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
          Find and book sports courts near you with ease! QuickCourt is the simplest way to discover and reserve tennis, basketball, badminton courts and more.
        </p>
        
        <div className="mb-8">
          <img 
            src="/QuickCourt.png" 
            alt="QuickCourt Logo" 
            className="w-48 h-48 mx-auto mb-8 animate-pulse"
          />
        </div>
        
        {!user && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        )}
        
        {user && (
          <Button size="lg" asChild>
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        )}
      </div>
      
      {/* Features Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Our Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <Card.Header>
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
                  <path d="M18 14h-8"></path>
                  <path d="M15 18h-5"></path>
                  <path d="M10 6h8v4h-8V6Z"></path>
                </svg>
              </div>
              <Card.Title className="text-center">Easy Booking</Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-center text-muted-foreground">
                Book sports courts in just a few clicks. Our streamlined process makes reservation quick and simple.
              </p>
            </Card.Content>
          </Card>
          
          <Card>
            <Card.Header>
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <Card.Title className="text-center">Find Nearby Courts</Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-center text-muted-foreground">
                Discover sports facilities near your location. Filter by distance, sport type, and availability.
              </p>
            </Card.Content>
          </Card>
          
          <Card>
            <Card.Header>
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path>
                </svg>
              </div>
              <Card.Title className="text-center">Reviews & Ratings</Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-center text-muted-foreground">
                Read authentic reviews from other players. Make informed decisions based on real experiences.
              </p>
            </Card.Content>
          </Card>
        </div>
      </div>
      
      {/* Sports Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-4">Popular Sports</h2>
        <p className="text-center text-muted-foreground mb-10">Book courts for your favorite sports</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Tennis', 'Basketball', 'Badminton', 'Football', 'Volleyball', 'Swimming', 'Squash', 'Table Tennis'].map((sport) => (
            <div key={sport} className="flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center mb-3">
                <span className="text-lg font-medium">{sport.charAt(0)}</span>
              </div>
              <span className="font-medium">{sport}</span>
              <Badge variant="outline" className="mt-2">Book Now</Badge>
            </div>
          ))}
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary to-blue-700 text-white rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Play?</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Join thousands of sports enthusiasts who use QuickCourt to find and book courts. Sign up today and get started in minutes!
        </p>
        <Button size="lg" variant="secondary" asChild>
          <Link to="/signup">Create Account</Link>
        </Button>
      </div>
    </div>
  );
}