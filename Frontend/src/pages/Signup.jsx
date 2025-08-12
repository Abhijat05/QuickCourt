import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/api';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Alert, AlertDescription } from '../components/ui/Alert';
import { Eye, EyeOff, User, Mail, Lock, AlertCircle, Shield, Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Signup() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

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
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least 1 uppercase letter';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least 1 number';
    } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least 1 special character';
    }
    
    if (!acceptTerms) {
      newErrors.terms = 'You must agree to the Terms of Service and Privacy Policy';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = (password) => {
    if (!password) return { text: 'Weak', class: 'bg-destructive w-[25%]' };
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    if (strength === 4) return { text: 'Strong', class: 'bg-success w-[100%]' };
    if (strength === 3) return { text: 'Good', class: 'bg-warning w-[75%]' };
    if (strength === 2) return { text: 'Fair', class: 'bg-primary w-[50%]' };
    return { text: 'Weak', class: 'bg-destructive w-[25%]' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await authService.signup(formData);
      toast.success('Signup successful! Please check your email for verification OTP');
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to sign up');
      console.error('Signup error:', error);
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
          <h1 className="text-2xl font-bold text-foreground mb-1">Create an account</h1>
          <p className="text-muted-foreground">Sign up to get started with QuickCourt</p>
        </motion.div>

        <Card className="border-border/40 shadow-lg animate-fade-in-up">
          <Card.Content className="p-6 pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full name"
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border ${errors.fullName ? 'border-destructive' : 'border-input'} bg-background focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    required
                  />
                  {errors.fullName && <p className="mt-1 text-sm text-destructive">{errors.fullName}</p>}
                </div>

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

                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Password strength:</span>
                      <span>{passwordStrength.text}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1">
                      <div className={`h-1 rounded-full ${passwordStrength.class}`}></div>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                      <li className={`flex items-center gap-1 ${formData.password.length >= 8 ? 'text-green-500' : ''}`}>
                        <span className={`inline-flex ${formData.password.length >= 8 ? 'text-green-500' : ''}`}>
                          {formData.password.length >= 8 ? <Check size={12} /> : "•"}
                        </span>
                        At least 8 characters
                      </li>
                      <li className={`flex items-center gap-1 ${/[A-Z]/.test(formData.password) ? 'text-green-500' : ''}`}>
                        <span className={`inline-flex ${/[A-Z]/.test(formData.password) ? 'text-green-500' : ''}`}>
                          {/[A-Z]/.test(formData.password) ? <Check size={12} /> : "•"}
                        </span>
                        At least 1 uppercase letter
                      </li>
                      <li className={`flex items-center gap-1 ${/[0-9]/.test(formData.password) ? 'text-green-500' : ''}`}>
                        <span className={`inline-flex ${/[0-9]/.test(formData.password) ? 'text-green-500' : ''}`}>
                          {/[0-9]/.test(formData.password) ? <Check size={12} /> : "•"}
                        </span>
                        At least 1 number
                      </li>
                      <li className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-500' : ''}`}>
                        <span className={`inline-flex ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-500' : ''}`}>
                          {/[^A-Za-z0-9]/.test(formData.password) ? <Check size={12} /> : "•"}
                        </span>
                        At least 1 special character
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="terms" 
                  checked={acceptTerms}
                  onChange={() => setAcceptTerms(!acceptTerms)}
                  className="rounded border-gray-300 text-primary focus:ring-primary/50 h-4 w-4" 
                />
                <label htmlFor="terms" className="ml-2 text-sm text-muted-foreground">
                  I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                </label>
              </div>
              {errors.terms && <p className="mt-1 text-sm text-destructive">{errors.terms}</p>}

              <div className="flex items-center justify-center mt-2 mb-1">
                <div className="flex items-center text-xs text-muted-foreground gap-1">
                  <Shield className="h-3 w-3" />
                  <span>Your data is protected and secure</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 h-auto text-base shadow-md hover:shadow-lg transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Creating account...
                  </div>
                ) : 'Sign up'}
              </Button>
            </form>
          </Card.Content>
        </Card>
        
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}