import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-background/80">
      <motion.div 
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 relative">
          <div className="text-[150px] font-bold text-primary/10">404</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Oops!
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved to another URL.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link to="/">
              <Home size={18} />
              Return to Home
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}