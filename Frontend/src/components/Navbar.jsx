import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import ThemeToggleButton from './ui/theme-toggle-button';
import { Avatar, AvatarFallback } from './ui/Avatar';
import Button from './ui/Button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from './ui/Sheet';
import { Menu, X, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  
  // Handle navbar appearance on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileOpen && !event.target.closest('.profile-menu')) {
        setProfileOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  // Check if a link is active
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled 
        ? "bg-background/80 backdrop-blur-lg border-b shadow-sm" 
        : "bg-transparent",
      "lg:px-8"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="font-bold text-xl flex items-center gap-2 group">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110",
              scrolled ? "bg-primary/10" : "bg-white/10 backdrop-blur-sm"
            )}>
              <img src="https://www.svgrepo.com/show/219526/basketball-court-playground.svg" alt="Logo" className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "font-bold transition-all duration-300",
                scrolled ? "text-foreground" : "bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent"
              )}>
                QuickCourt
              </span>
              <span className={cn(
                "text-xs font-normal -mt-1 transition-opacity duration-300",
                scrolled ? "text-muted-foreground" : "text-white/70"
              )}>
                Book courts instantly
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Main Navigation Links */}
            <div className="mr-2 flex items-center bg-background/20 backdrop-blur-md rounded-full p-1 border border-border/30">
              {[
                { path: '/', label: 'Home' },
                { path: '/dashboard', label: 'Dashboard', protected: true },
                { path: '/about', label: 'About' },
              ].map(link => !link.protected || user ? (
                <Link 
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200",
                    isActive(link.path)
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-primary/10"
                  )}
                >
                  {link.label}
                </Link>
              ) : null)}
            </div>
            
            <ThemeToggleButton variant="circle-blur" start="top-right" />
            
            {user ? (
              <div className="relative profile-menu">
                <Button 
                  variant="ghost" 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-full hover:bg-background/30 p-1.5 pl-1"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-200">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-sm">
                      {user.token.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    profileOpen && "rotate-180"
                  )} />
                </Button>
                
                {/* Profile Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg bg-card shadow-lg ring-1 ring-black/5 border border-border/50 overflow-hidden">
                    <div className="p-2 border-b border-border/50">
                      <p className="text-sm font-semibold">My Account</p>
                      <p className="text-xs text-muted-foreground">User</p>
                    </div>
                    <div className="p-1">
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
                        onClick={() => setProfileOpen(false)}
                      >
                        Profile Settings
                      </Link>
                      <Link 
                        to="/bookings" 
                        className="block px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
                        onClick={() => setProfileOpen(false)}
                      >
                        My Bookings
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setProfileOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-destructive rounded-md hover:bg-destructive/10"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild className="hover:bg-background/20">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link to="/signup">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
          
          {/* Mobile menu */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggleButton variant="circle" start="top-right" />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={cn(
                    "border-primary/20 p-2 rounded-full",
                    scrolled ? "bg-background/50" : "bg-white/10 text-white"
                  )}
                >
                  {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] border-l border-border/50 p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile menu header */}
                  <div className="border-b border-border/50 p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <img src="https://www.svgrepo.com/show/219526/basketball-court-playground.svg" alt="Logo" className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="font-semibold">QuickCourt</h3>
                        <p className="text-xs text-muted-foreground">Find and book sports courts</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile menu links */}
                  <div className="p-6 flex-1">
                    <div className="space-y-1 mb-6">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2 px-2">Navigation</h4>
                      <Link 
                        to="/" 
                        className={cn(
                          "block px-3 py-2 rounded-lg text-sm transition-colors",
                          isActive("/") 
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted"
                        )}
                        onClick={() => setOpen(false)}
                      >
                        Home
                      </Link>
                      
                      {user && (
                        <Link 
                          to="/dashboard" 
                          className={cn(
                            "block px-3 py-2 rounded-lg text-sm transition-colors",
                            isActive("/dashboard") 
                              ? "bg-primary/10 text-primary font-medium"
                              : "hover:bg-muted"
                          )}
                          onClick={() => setOpen(false)}
                        >
                          Dashboard
                        </Link>
                      )}
                      
                      <Link 
                        to="/about" 
                        className={cn(
                          "block px-3 py-2 rounded-lg text-sm transition-colors",
                          isActive("/about") 
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted"
                        )}
                        onClick={() => setOpen(false)}
                      >
                        About
                      </Link>
                    </div>
                    
                    {user && (
                      <div className="space-y-1 mb-6">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2 px-2">Account</h4>
                        <Link 
                          to="/profile" 
                          className="block px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          Profile Settings
                        </Link>
                        <Link 
                          to="/bookings" 
                          className="block px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          My Bookings
                        </Link>
                      </div>
                    )}
                  </div>
                  
                  {/* Mobile menu footer */}
                  <div className="p-6 border-t border-border/50">
                    {user ? (
                      <Button 
                        onClick={() => {
                          logout();
                          setOpen(false);
                        }}
                        variant="outline"
                        className="w-full justify-center"
                      >
                        Logout
                      </Button>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" asChild>
                          <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
                        </Button>
                        <Button asChild>
                          <Link to="/signup" onClick={() => setOpen(false)}>Sign up</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}