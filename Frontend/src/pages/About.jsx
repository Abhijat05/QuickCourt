import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '../components/ui/Breadcrumb';
import { Calendar, Users, Award, Clock, Globe, Heart, Shield, Star, Code } from 'lucide-react';

export default function About() {
  return (
    <motion.div
      className="container mx-auto px-4 py-8 mt-16 mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span className="font-medium text-foreground">About Us</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-10">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          About QuickCourt
        </motion.h1>
        <motion.p 
          className="text-lg text-muted-foreground mb-6 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          QuickCourt is a comprehensive sports court booking platform that allows users to find, book, and manage sports courts for various activities including tennis, basketball, badminton, and more.
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <Clock className="h-3.5 w-3.5 mr-1" />
            Fast Booking
          </Badge>
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            Real-time Availability
          </Badge>
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            <Shield className="h-3.5 w-3.5 mr-1" />
            Secure Payments
          </Badge>
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
            <Star className="h-3.5 w-3.5 mr-1" />
            User Reviews
          </Badge>
        </motion.div>
      </div>

      {/* Our Mission Section */}
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-lg">
              At QuickCourt, we're on a mission to make sports court booking seamless, efficient, and accessible to everyone. We believe that playing sports should be about the game, not about the hassle of finding and booking a place to play.
            </p>
            <p>
              Our platform streamlines the entire booking process, allowing sports enthusiasts to find available courts in their area, view real-time availability, and secure bookings in seconds. We're committed to promoting an active lifestyle by removing the barriers that prevent people from engaging in sports activities.
            </p>
            <div className="pt-4">
              <Button asChild>
                <Link to="/find">Find Courts Near You</Link>
              </Button>
            </div>
          </div>
          <div className="relative rounded-xl overflow-hidden h-64 md:h-auto bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1628891890467-b79f2c8ba9dc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=85')] bg-cover bg-center opacity-30"></div>
            <div className="relative z-10 text-center p-6">
              <h3 className="text-2xl font-bold mb-2 text-white">Making Sports Accessible</h3>
              <p className="text-white/90">Our vision is to create a world where anyone can play their favorite sport anytime, anywhere.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Core Values */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-4">Our Core Values</h2>
        <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
          The principles that guide everything we do at QuickCourt
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Simplicity",
              description: "We believe in making the complex simple. Our platform is designed to be intuitive and easy to use, eliminating unnecessary steps and complications.",
              icon: Clock,
              gradient: "from-primary to-blue-500"
            },
            {
              title: "Reliability",
              description: "Users count on our platform for accurate information and seamless booking experiences. We maintain high standards of reliability in all our operations.",
              icon: Shield,
              gradient: "from-accent to-purple-500"
            },
            {
              title: "Community",
              description: "We're building more than just a booking platform—we're creating a community of sports enthusiasts who share a passion for active lifestyles.",
              icon: Heart,
              gradient: "from-success to-green-500"
            }
          ].map((value, i) => (
            <motion.div
              key={value.title}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="border-border/40 h-full overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${value.gradient}`}></div>
                <Card.Header>
                  <div className="rounded-full bg-gradient-to-br p-2.5 w-12 h-12 flex items-center justify-center mb-4 shadow-lg">
                    <value.icon size={24} className="text-white" />
                  </div>
                  <Card.Title>{value.title}</Card.Title>
                </Card.Header>
                <Card.Content>
                  <p className="text-muted-foreground">
                    {value.description}
                  </p>
                </Card.Content>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Team Section */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-4">Meet Our Team</h2>
        <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
          The passionate people behind QuickCourt
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              name: "Abhijat Sinha",
              role: "Co-Founder & Developer",
              bio: "Passionate about creating intuitive user experiences and solving complex problems through elegant code solutions.",
              initial: "A"
            },
            {
              name: "Garv Khatri",
              role: "Co-Founder & Designer",
              bio: "Focused on creating beautiful, functional designs that enhance user experience and engagement across all platforms.",
              initial: "G"
            }
          ].map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="overflow-hidden h-full">
                <Card.Content className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold">
                      {member.initial}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1 text-center sm:text-left">{member.name}</h3>
                      <p className="text-accent mb-3 text-center sm:text-left">{member.role}</p>
                      <p className="text-muted-foreground text-center sm:text-left">{member.bio}</p>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tech Stack */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-4">Our Technology</h2>
        <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
          Built with modern technologies for performance and reliability
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            "React", "TailwindCSS", "Node.js", "Express", 
            "PostgreSQL", "TypeScript", "Framer Motion", "JWT"
          ].map((tech, i) => (
            <motion.div
              key={tech}
              className="bg-card border border-border/40 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              whileHover={{ y: -2 }}
            >
              <Code className="h-5 w-5 mb-2 mx-auto text-primary" />
              <span className="font-medium text-sm">{tech}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Contact CTA */}
      <motion.div
        className="rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-accent text-white shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8 md:p-12 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4 text-center">Ready to Get Started?</h2>
            <p className="text-white/90 mb-8 text-center max-w-2xl mx-auto">
              Join thousands of users already enjoying the seamless court booking experience on QuickCourt
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                <Link to="/signup">Create Free Account</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}