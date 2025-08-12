import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/Alert';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [redirectUrl, setRedirectUrl] = useState('/dashboard');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Check if there's a redirect URL in the location state
  useEffect(() => {
    if (location.state?.from) {
      setRedirectUrl(location.state.from);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear errors when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password.trim()) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await authService.login({
        ...formData,
        rememberMe
      });

      if (response.data.token) {
        // Regular login successful
        login(response.data.token, response.data.user);
        toast.success(`Welcome back, ${response.data.user.fullName || 'User'}!`);
        navigate(redirectUrl);
      } else {
        // 2FA is enabled, navigate to 2FA verification
        toast.success('Please enter your verification code');
        navigate('/verify-2fa', { state: { email: formData.email } });
      }
    } catch (error) {
      setLoginAttempts(prevAttempts => prevAttempts + 1);
      
      if (error.response?.status === 401) {
        toast.error('Invalid email or password');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Login failed. Please try again.');
      }
      
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-background/80"
    >
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-4">
            <img src="https://www.svgrepo.com/show/219526/basketball-court-playground.svg" alt="QuickCourt Logo" className="w-14 h-14" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to continue to QuickCourt</p>
        </motion.div>

        <Card className="border-border/40 shadow-lg animate-fade-in-up">
          <Card.Content className="p-6 pt-6">
            {loginAttempts >= 3 && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Authentication Problem</AlertTitle>
                <AlertDescription>
                  Too many failed login attempts. Consider resetting your password or try again later.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border ${errors.email ? 'border-destructive' : 'border-input'} bg-background focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    required
                  />
                  {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className={`w-full pl-10 pr-10 py-2 rounded-lg border ${errors.password ? 'border-destructive' : 'border-input'} bg-background focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  {errors.password && <p className="mt-1 text-sm text-destructive">{errors.password}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="rounded border-gray-300 text-primary focus:ring-primary/50 h-4 w-4" 
                  />
                  <span className="ml-2 text-sm text-muted-foreground">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 h-auto text-base shadow-md hover:shadow-lg transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Signing in...
                  </div>
                ) : 'Sign in'}
              </Button>
            </form>
          </Card.Content>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}