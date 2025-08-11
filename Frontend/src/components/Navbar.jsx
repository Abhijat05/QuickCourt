import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import ThemeToggleButton from './ui/theme-toggle-button';
import { Avatar, AvatarFallback } from './ui/Avatar';
import Button from './ui/Button';
import { ExpandedTabs } from './ui/expanded-tabs';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from './ui/Sheet';
import { 
  Menu, X, ChevronDown, Bell, Search, Calendar, User, 
  Settings, LogOut, Home, Info, MapPin, Trophy, Clock 
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  
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
      if (profileOpen && profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  // Check if a link is active
  const isActive = (path) => location.pathname === path;
  
  // Define tabs for ExpandedTabs component
  const navTabs = [
    { icon: Home, title: "Home", path: "/" },
    { type: "separator" },
    ...(user ? [{ icon: Calendar, title: "Dashboard", path: "/dashboard" }] : []),
    { icon: MapPin, title: "Find Courts", path: "/find" },
    { type: "separator" },
    { icon: Info, title: "About", path: "/about" },
  ];
  
  const handleTabChange = (index) => {
    if (index !== null && navTabs[index].path) {
      navigate(navTabs[index].path);
    }
  };
  
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
          <Link 
            to="/" 
            className="font-bold text-xl flex items-center gap-2 group"
            aria-label="QuickCourt Home"
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110",
              scrolled ? "bg-primary/10" : "bg-white/10 backdrop-blur-sm"
            )}>
              <img src="https://www.svgrepo.com/show/219526/basketball-court-playground.svg" alt="" className="w-6 h-6" />
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
          <div className="hidden md:flex items-center space-x-3">
            {/* Main Navigation Links - Using ExpandedTabs */}
            <ExpandedTabs 
              tabs={navTabs}
              onChange={handleTabChange}
              className={cn(
                "mr-3",
                scrolled ? "bg-background/20" : "bg-white/10"
              )}
              activeColor={scrolled ? "text-primary" : "text-white"}
            />
            
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "rounded-full hover:bg-background/30",
                scrolled ? "text-foreground" : "text-white hover:text-white"
              )}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
            
            <ThemeToggleButton variant="circle-blur" start="top-right" />
            
            {user ? (
              <div className="relative profile-menu" ref={profileMenuRef}>
                <Button 
                  variant="ghost" 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={cn(
                    "flex items-center gap-2 rounded-full p-1.5 pl-1 transition-colors",
                    profileOpen ? "bg-accent/20" : "hover:bg-background/30",
                    scrolled ? "text-foreground" : "text-white hover:text-white"
                  )}
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-200">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-sm">
                      {user.token.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    scrolled ? "text-muted-foreground" : "text-white/70",
                    profileOpen && "rotate-180"
                  )} />
                </Button>
                
                {/* Profile Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-lg bg-card shadow-lg ring-1 ring-black/5 border border-border/50 overflow-hidden animate-fade-in-up">
                    <div className="p-4 border-b border-border/50">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                            {user.token.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">My Account</p>
                          <p className="text-xs text-muted-foreground">Manage your settings</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <User size={16} />
                        <span>Profile Settings</span>
                      </Link>
                      <Link 
                        to="/bookings" 
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Calendar size={16} />
                        <span>My Bookings</span>
                      </Link>
                      <Link 
                        to="/history" 
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Clock size={16} />
                        <span>Booking History</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setProfileOpen(false);
                        }}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-destructive rounded-md hover:bg-destructive/10 transition-colors mt-2 border-t border-border/50 pt-3"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  asChild 
                  className={cn(
                    "hover:bg-background/20",
                    !scrolled && "text-white hover:text-white"
                  )}
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-shadow">
                  <Link to="/signup">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
          
          {/* Mobile menu */}
          <div className="md:hidden flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "rounded-full",
                scrolled ? "text-foreground" : "text-white"
              )}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
            
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
                  <div className="p-6 flex-1 overflow-y-auto">
                    <div className="space-y-1 mb-6">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2 px-2">Navigation</h4>
                      <Link 
                        to="/" 
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                          isActive("/") 
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted"
                        )}
                        onClick={() => setOpen(false)}
                      >
                        <Home size={16} />
                        Home
                      </Link>
                      
                      {user && (
                        <Link 
                          to="/dashboard" 
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                            isActive("/dashboard") 
                              ? "bg-primary/10 text-primary font-medium"
                              : "hover:bg-muted"
                          )}
                          onClick={() => setOpen(false)}
                        >
                          <Calendar size={16} />
                          Dashboard
                        </Link>
                      )}
                      
                      <Link 
                        to="/find" 
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                          isActive("/find") 
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted"
                        )}
                        onClick={() => setOpen(false)}
                      >
                        <MapPin size={16} />
                        Find Courts
                      </Link>
                      
                      <Link 
                        to="/about" 
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                          isActive("/about") 
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted"
                        )}
                        onClick={() => setOpen(false)}
                      >
                        <Info size={16} />
                        About
                      </Link>
                    </div>
                    
                    {user && (
                      <div className="space-y-1 mb-6">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2 px-2">Account</h4>
                        <Link 
                          to="/profile" 
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          <User size={16} />
                          Profile Settings
                        </Link>
                        <Link 
                          to="/bookings" 
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          <Calendar size={16} />
                          My Bookings
                        </Link>
                        <Link 
                          to="/history" 
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          <Clock size={16} />
                          Booking History
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
                        className="w-full justify-center gap-2"
                      >
                        <LogOut size={16} />
                        Logout
                      </Button>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" asChild>
                          <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
                        </Button>
                        <Button asChild className="shadow-sm">
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