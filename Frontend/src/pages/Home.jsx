import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import BadgeButton from '../components/ui/badge-button';
import { motion } from 'framer-motion';
import { ExpandedTabs } from '../components/ui/expanded-tabs';
import { ChevronRight, Calendar, MapPin, Star, Shield, Clock, Filter, Globe, Search } from 'lucide-react';
import { WrapButton } from "../components/ui/wrap-button";

export default function Home() {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tabs for sport categories
  const sportTabs = [
    { icon: MapPin, title: "All Sports", path: "/" },
    { type: "separator" },
    { icon: Calendar, title: "Indoor", path: "/indoor" },
    { icon: Star, title: "Outdoor", path: "/outdoor" },
  ];

  // Card entrance animation
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <>
      {/* Hero Section with Parallax Effect */}
      <div className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Add a subtle pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 z-5"></div>
        
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-background/70 to-background z-10"></div>
        
        {/* Higher quality background with better contrast */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1628891890467-b79f2c8ba9dc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=85')] bg-cover bg-center opacity-30"></div>

        {/* More distinct glowing orbs */}
        <div
          className="absolute w-72 h-72 bg-primary/20 rounded-full top-1/4 left-1/4 blur-3xl animate-pulse"
          style={{ animationDuration: '8s' }}
        ></div>
        <div
          className="absolute w-96 h-96 bg-accent/20 rounded-full bottom-1/4 right-1/4 blur-3xl animate-pulse"
          style={{ animationDuration: '12s' }}
        ></div>
        <div
          className="absolute w-64 h-64 bg-success/20 rounded-full bottom-1/3 left-1/3 blur-3xl animate-pulse"
          style={{ animationDuration: '10s' }}
        ></div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              className="mb-8 inline-block"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
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
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              Play Without Limits
            </motion.h1>
            <motion.p
              className="text-lg text-foreground/90 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Find and book sports courts near you with ease! QuickCourt is the simplest way
              to discover and reserve tennis, basketball, badminton courts and more.
            </motion.p>

            {!user ? (
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                {/* Using WrapButton for main CTA */}
                <WrapButton
                  href="/signup"
                  color="primary"
                >
                  Get Started
                </WrapButton>

                <Button size="lg" variant="outline" asChild className="hover:bg-accent/10 border-accent/50 text-base px-8 py-6">
                  <Link to="/login">Sign In</Link>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="flex justify-center"
              >
                {/* Using WrapButton for dashboard navigation */}
                <WrapButton
                  href="/dashboard"
                  color="success"
                  variant="globe"
                  className="shadow-glow-success"
                >
                  Go to Dashboard
                </WrapButton>
              </motion.div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1, repeat: Infinity, repeatType: "reverse" }}
        >
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Statistics with enhanced design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
          {[
            { number: "500+", text: "Courts Available", color: "primary" },
            { number: "10K+", text: "Happy Players", color: "accent" },
            { number: "50+", text: "Cities", color: "success" }
          ].map((stat, i) => (
            <motion.div
              key={stat.text}
              className="bg-card border border-border/50 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className={`text-4xl font-bold text-${stat.color} mb-2`}>{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.text}</div>
            </motion.div>
          ))}
        </div>

        {/* Add this after your statistics section */}
        <motion.div 
          className="relative mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-5xl mx-auto">
            <motion.div 
              className="bg-card border border-border/50 rounded-2xl p-6 shadow-lg overflow-hidden relative"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-success"></div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2">Real-time Court Availability</h3>
                  <p className="text-muted-foreground mb-4 max-w-md">Our system updates availability in real-time, ensuring you always see accurate information.</p>
                  <BadgeButton 
                    icon={Calendar}
                    text="Check Available Courts"
                    variant="default"
                    className="hover:bg-primary/90"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-primary mb-1">98%</div>
                    <div className="text-xs text-muted-foreground">Booking Success Rate</div>
                  </div>
                  <div className="bg-accent/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-accent mb-1">30s</div>
                    <div className="text-xs text-muted-foreground">Average Booking Time</div>
                  </div>
                  <div className="bg-success/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-success mb-1">24/7</div>
                    <div className="text-xs text-muted-foreground">Support Available</div>
                  </div>
                  <div className="bg-warning/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-warning mb-1">4.9/5</div>
                    <div className="text-xs text-muted-foreground">User Satisfaction</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Marquee Section for Venues and Reviews */}
        <motion.div
          className="w-full py-10 mb-16 overflow-hidden bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="animate-scroll-left" style={{ animationDuration: '30s' }}>
            <div className="flex gap-8 items-center">
              {[
                "Mumbai Sports Arena 🏏",
                "Delhi Cricket Grounds 🏏",
                "Bengaluru Fitness Hub 💪",
                "Chennai Beach Volleyball 🏐",
                "Kolkata Indoor Soccer ⚽",
                "Hyderabad Badminton Court 🏸",
                "Pune Hiking Trails 🏃‍♂️",
                "Jaipur Poolside Swimming 🏊‍♂️"
              ]
                  .map((venue, i) => (
                  <div
                    key={i}
                    className="flex items-center px-6 py-3 rounded-full bg-card shadow-sm border border-border/30"
                  >
                    <span className="text-base font-medium whitespace-nowrap">{venue}</span>
                  </div>
                ))}
            </div>
          </div>
          <div className="mt-4 animate-scroll-right" style={{ animationDuration: '25s' }}>
            <div className="flex gap-8 items-center">
              {[
                "⭐⭐⭐⭐⭐ Amazing courts! Easy to book.",
                "⭐⭐⭐⭐ Great experience overall!",
                "⭐⭐⭐⭐⭐ Best booking app for sports!",
                "⭐⭐⭐⭐ Clean facilities and professional staff.",
                "⭐⭐⭐⭐⭐ Saved so much time booking through QuickCourt!",
                "⭐⭐⭐⭐ Perfect for last-minute games.",
                "⭐⭐⭐⭐⭐ The interface is so intuitive!"
              ].map((review, i) => (
                <div
                  key={i}
                  className="flex items-center px-6 py-3 rounded-full bg-card shadow-sm border border-border/30"
                >
                  <span className="text-sm whitespace-nowrap">{review}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Features Section with Motion */}
        <motion.div
          className="mb-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Why Choose QuickCourt?
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Discover what makes QuickCourt the best choice for sports enthusiasts
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Lightning Fast Booking",
                description: "Reserve your favorite court in under 30 seconds. Our streamlined process eliminates the hassle of traditional booking.",
                icon: Clock,
                gradient: "from-primary to-green-400",
                hoverEffect: "hover:shadow-glow"
              },
              {
                title: "Smart Location Finder",
                description: "AI-powered location search finds the perfect courts near you. Filter by distance, amenities, and real-time availability.",
                icon: MapPin,
                gradient: "from-accent to-info",
                hoverEffect: "hover:shadow-glow-accent"
              },
              {
                title: "Community Reviews",
                description: "Real reviews from verified players. Make informed decisions with detailed ratings and authentic feedback.",
                icon: Star,
                gradient: "from-success to-emerald-400",
                hoverEffect: "hover:shadow-success"
              }
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Card className={`${feature.hoverEffect} transition-all duration-300 hover:-translate-y-2 border-border/50 relative overflow-hidden h-full`}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full"></div>
                  <Card.Header>
                    <div className={`rounded-full bg-gradient-to-br ${feature.gradient} w-16 h-16 flex items-center justify-center mb-4 mx-auto shadow-lg`}>
                      <feature.icon size={28} className="text-white" />
                    </div>
                    <Card.Title className="text-center text-xl">{feature.title}</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <p className="text-center text-muted-foreground">
                      {feature.description}
                    </p>
                  </Card.Content>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Live Activity Feed */}
        <motion.div
          className="py-16 bg-card/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Live Activity</h2>
              <p className="text-muted-foreground">See what's happening right now on QuickCourt</p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="space-y-4">
                {[
                  { user: "Rajesh K.", action: "booked a Tennis court", location: "Mumbai Sports Complex", time: "2 minutes ago", sport: "🎾" },
                  { user: "Priya S.", action: "completed a Badminton session", location: "Delhi Indoor Arena", time: "5 minutes ago", sport: "🏸" },
                  { user: "Arjun M.", action: "rated a Basketball court", location: "Bangalore Sports Hub", time: "8 minutes ago", sport: "🏀", rating: 5 },
                  { user: "Sneha R.", action: "joined a Football match", location: "Chennai Ground", time: "12 minutes ago", sport: "⚽" }
                ].map((activity, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-4 p-4 bg-background rounded-lg border hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-medium">
                      {activity.user.split(' ')[0][0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.action} at{' '}
                        <span className="text-primary">{activity.location}</span>
                        {activity.rating && (
                          <span className="ml-2">
                            {'⭐'.repeat(activity.rating)}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <div className="text-2xl">{activity.sport}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sports Section with Tabs and Dynamic Content */}
        <motion.div
          className="mb-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-success to-primary bg-clip-text text-transparent">
            Popular Sports
          </h2>
          <p className="text-center text-muted-foreground mb-6 max-w-2xl mx-auto">
            Book courts for your favorite sports and discover new ones
          </p>

          {/* Sport Category Tabs */}
          <div className="flex justify-center mb-10">
            <ExpandedTabs
              tabs={sportTabs}
              onChange={(index) => setActiveTab(index)}
              className="bg-card/50 backdrop-blur-sm"
              activeColor="text-primary font-semibold"
              tabStyle="data-[selected=true]:bg-primary/10"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { name: 'Tennis', icon: '🎾', color: 'from-emerald-400 to-teal-500', popular: true },
              { name: 'Basketball', icon: '🏀', color: 'from-orange-400 to-red-500', popular: true },
              { name: 'Badminton', icon: '🏸', color: 'from-purple-400 to-pink-500', popular: false },
              { name: 'Football', icon: '⚽', color: 'from-green-400 to-blue-500', popular: true },
              { name: 'Volleyball', icon: '🏐', color: 'from-yellow-400 to-orange-500', popular: false },
              { name: 'Swimming', icon: '🏊‍♂️', color: 'from-blue-400 to-cyan-500', popular: false },
              { name: 'Squash', icon: '🥍', color: 'from-red-400 to-pink-500', popular: false },
              { name: 'Table Tennis', icon: '🏓', color: 'from-indigo-400 to-purple-500', popular: false }
            ].map((sport, i) => (
              <motion.div
                key={sport.name}
                className="group cursor-pointer relative"
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link to="/find" className="flex flex-col items-center">
                  {sport.popular && (
                    <Badge variant="success" className="absolute -top-2 -right-2 z-10 text-xs">
                      Popular
                    </Badge>
                  )}
                  <div className={`h-32 w-full rounded-2xl bg-gradient-to-br ${sport.color} flex flex-col items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/10 rounded-2xl"></div>
                    <div className="flex flex-col items-center relative z-10">
                      <span className="text-4xl mb-2">{sport.icon}</span>
                      <span className="text-sm font-medium text-white/90">{sport.name}</span>
                    </div>
                  </div>
                  <span className="font-medium text-center text-sm">{sport.name}</span>
                  <Badge variant="outline" className="mt-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 text-xs">
                    Book Now
                  </Badge>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced CTA Section with Interactive Elements */}
        <motion.div
          className="relative rounded-3xl overflow-hidden shadow-2xl mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Modernized background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-success opacity-90"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Animated shapes */}
          <motion.div
            className="absolute top-10 left-10 w-24 h-24 rounded-full border border-white/20 backdrop-blur-sm"
            animate={{ y: [0, 15, 0], rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          ></motion.div>
          <motion.div
            className="absolute bottom-10 right-10 w-20 h-20 rounded-full border border-white/20 backdrop-blur-sm"
            animate={{ y: [0, -15, 0], rotate: -360, scale: [1, 0.9, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          ></motion.div>
          <motion.div
            className="absolute top-40 right-20 w-16 h-16 rounded-full border border-white/20 backdrop-blur-sm"
            animate={{ x: [0, 15, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          ></motion.div>

          {/* Content with improved layout */}
          <div className="relative z-10 text-white p-12 md:p-16 text-center">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-block mb-6"
              >
                <Badge variant="outline" className="border-white/30 text-white px-4 py-1 text-sm backdrop-blur-sm">
                  Limited Time Offer
                </Badge>
              </motion.div>
              
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Ready to Transform Your Game?
              </motion.h2>
              
              <motion.p
                className="text-xl mb-8 opacity-90 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Join thousands of sports enthusiasts who use QuickCourt to find and book courts.
                Sign up today and get your first booking at <span className="font-bold text-white">20% off!</span>
              </motion.p>

              {/* Add this before the "Create Free Account" button in the CTA section */}
              <div className="flex justify-center mb-8">
                <BadgeButton 
                  icon={Star}
                  text="Featured Promotion"
                  variant="default"
                  className="bg-white text-primary"
                />
              </div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* Using WrapButton for signup CTA in footer */}
                <WrapButton
                  href="/signup"
                  color="secondary"
                  className="bg-white/90 backdrop-blur-sm"
                >
                  Create Free Account
                </WrapButton>

                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-base px-8 py-6"
                >
                  <Link to="/login">Already a Member?</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Hero Section */}
      <div className="relative h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Add success indicators */}
        <div className="absolute top-8 left-8 z-30 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20"
          >
            <div className="flex items-center gap-2 text-white">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">500+ Courts Available</span>
            </div>
          </motion.div>
        </div>
            
        <div className="absolute top-8 right-8 z-30 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20"
          >
            <div className="flex items-center gap-2 text-white">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm">4.9/5 Rating</span>
            </div>
          </motion.div>
        </div>

        {/* Enhanced main content */}
        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Add trust indicator */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                🏆 Trusted by 10,000+ Players
              </Badge>
            </motion.div>

            {/* Improved headline with value proposition */}
            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-green-100 bg-clip-text text-transparent leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              Book Courts in
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-success bg-clip-text">30 Seconds</span>
            </motion.h1>

            <motion.p
              className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Find, book, and play at premium sports facilities near you. 
              <strong> No calls, no queues, just instant bookings.</strong>
            </motion.p>

            {/* Enhanced CTA section */}
            {!user ? (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <WrapButton
                    href="/signup"
                    color="primary"
                    className="text-lg px-8 py-4 shadow-2xl"
                  >
                    Start Playing Today
                  </WrapButton>

                  <Button 
                    size="lg" 
                    variant="outline" 
                    asChild 
                    className="hover:bg-white/10 border-white/30 text-white text-lg px-8 py-4 backdrop-blur-sm"
                  >
                    <Link to="/find">Browse Courts</Link>
                  </Button>
                </div>

                {/* Add social proof */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="flex items-center justify-center gap-6 text-white/70 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Secure Payments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Instant Confirmation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <span>24/7 Support</span>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              // Enhanced logged-in user experience
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 max-w-md mx-auto">
                  <p className="text-white/90 mb-4">Welcome back, {user.fullName}!</p>
                  <div className="flex flex-col gap-3">
                    <WrapButton
                      href="/dashboard"
                      color="success"
                      variant="globe"
                      className="shadow-2xl"
                    >
                      Go to Dashboard
                    </WrapButton>
                    <Button variant="outline" asChild className="border-white/30 text-white hover:bg-white/10">
                      <Link to="/find">Find New Courts</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <style jsx="true" global="true">{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-scroll-left {
          animation: scroll-left linear infinite;
        }

        .animate-scroll-right {
          animation: scroll-right linear infinite;
        }

        /* Previous styles remain the same */
  
        .bg-grid-pattern {
          background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
          background-size: 30px 30px;
        }
  
        /* Enhanced glass morphism effect */
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
  
        /* Improved dark mode glass effect */
        .dark .glass-card {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </>
  );
}