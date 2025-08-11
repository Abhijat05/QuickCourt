import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { KeyRound, ArrowLeft, Mail } from 'lucide-react';

export default function Verify2FA() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const email = location.state?.email;
  
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  
  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp) {
      setError('OTP is required');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await authService.verify2FA({ email, otp });
      login(response.data.token);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await authService.login({ email, password: '' });
      toast.success('New OTP has been sent to your email');
      setTimeLeft(600); // Reset timer to 10 minutes
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-background/80">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-4">
            <KeyRound className="w-14 h-14 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Two-Factor Authentication</h1>
          <p className="text-muted-foreground">Please enter the verification code sent to your email</p>
        </div>

        <Card className="border-border/40 shadow-lg animate-fade-in-up">
          <Card.Content className="p-6 pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-center justify-center mb-3">
                <div className="flex gap-2">
                  {[...Array(6)].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength="1"
                      value={otp[i] || ''}
                      className="w-12 h-14 text-center text-xl font-semibold border rounded-md focus:border-primary focus:ring-1 focus:ring-primary"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (!/^[0-9]*$/.test(value)) return;
                        
                        const newOtp = otp.split('');
                        newOtp[i] = value;
                        setOtp(newOtp.join(''));
                        
                        // Auto-focus next input
                        if (value && i < 5) {
                          const nextInput = e.target.parentNode.childNodes[i + 1];
                          if (nextInput) nextInput.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        // Handle backspace to go to previous input
                        if (e.key === 'Backspace' && !otp[i] && i > 0) {
                          const prevInput = e.target.parentNode.childNodes[i - 1];
                          if (prevInput) prevInput.focus();
                        }
                      }}
                    />
                  ))}
                </div>
              </div>

              {error && <p className="text-destructive text-sm text-center">{error}</p>}
              
              <div className="text-center text-sm">
                <p className="text-muted-foreground">
                  Code expires in <span className="font-medium">{formatTime(timeLeft)}</span>
                </p>
              </div>
              
              <Button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full py-2.5 h-auto text-base shadow-md hover:shadow-lg transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </div>
                ) : 'Verify & Login'}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Didn't receive a code?{" "}
                <button 
                  onClick={handleResendOTP}
                  className="text-primary hover:underline focus:outline-none"
                  disabled={timeLeft > 540} // Only allow resend after 1 minute
                >
                  Resend OTP
                </button>
              </p>
            </div>
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