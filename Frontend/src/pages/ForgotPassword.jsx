import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/api';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    setIsLoading(true);
    try {
      await authService.forgotPassword({ email });
      setIsSubmitted(true);
      toast.success('Reset link sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process request');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-background/80">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-4">
              <Mail className="w-14 h-14 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Check Your Email</h1>
            <p className="text-muted-foreground">Password reset instructions have been sent</p>
          </div>

          <Card className="border-border/40 shadow-lg animate-fade-in-up">
            <Card.Content className="p-6 pt-6">
              <div className="text-center mb-6">
                <p className="mb-6">
                  We've sent password reset instructions to <strong>{email}</strong>. Check your inbox and follow the link to reset your password.
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  If you don't see the email, check your spam folder or request another reset link.
                </p>
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full py-2.5 h-auto text-base shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Back to Login
                </Button>
              </div>
              
              <div className="relative flex items-center justify-center mt-4">
                <div className="border-t border-border flex-grow"></div>
                <span className="mx-4 text-xs text-muted-foreground">OR</span>
                <div className="border-t border-border flex-grow"></div>
              </div>
              
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="w-full mt-4"
              >
                Try a different email
              </Button>
            </Card.Content>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-background/80">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-4">
            <KeyRound className="w-14 h-14 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Forgot your password?</h1>
          <p className="text-muted-foreground">No problem, we'll send you a reset link</p>
        </div>

        <Card className="border-border/40 shadow-lg animate-fade-in-up">
          <Card.Content className="p-6 pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Email address"
                  className={`w-full pl-10 pr-3 py-2 rounded-lg border ${error ? 'border-destructive' : 'border-input'} bg-background focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  required
                />
                {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 h-auto text-base shadow-md hover:shadow-lg transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending reset link...
                  </div>
                ) : 'Send Reset Link'}
              </Button>
            </form>
          </Card.Content>
        </Card>
        
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            <Link to="/login" className="flex items-center justify-center font-medium text-primary hover:underline">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}