import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/api';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Eye, EyeOff, Lock, AlertCircle, ShieldCheck } from 'lucide-react';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Get token from URL query params
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      navigate('/forgot-password');
    }
  }, [location.search, navigate]);

  const handleChange = (e, field) => {
    const { value } = e.target;
    if (field === 'newPassword') {
      setNewPassword(value);
    } else {
      setConfirmPassword(value);
    }
    
    // Clear errors when user types
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await authService.resetPassword({ token, newPassword });
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { text: '', class: '' };
    
    if (password.length < 8) return { text: 'Too short', class: 'bg-red-500' };
    
    let strength = 0;
    if (password.match(/[a-z]+/)) strength += 1;
    if (password.match(/[A-Z]+/)) strength += 1;
    if (password.match(/[0-9]+/)) strength += 1;
    if (password.match(/[^a-zA-Z0-9]+/)) strength += 1;
    
    if (strength === 1) return { text: 'Weak', class: 'bg-red-500' };
    if (strength === 2) return { text: 'Fair', class: 'bg-yellow-500' };
    if (strength === 3) return { text: 'Good', class: 'bg-green-500' };
    return { text: 'Strong', class: 'bg-green-600' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-background/80">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-4">
            <ShieldCheck className="w-14 h-14 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Reset your password</h1>
          <p className="text-muted-foreground">Create a new strong password for your account</p>
        </div>

        <Card className="border-border/40 shadow-lg animate-fade-in-up">
          <Card.Content className="p-6 pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => handleChange(e, 'newPassword')}
                    placeholder="New password"
                    className={`w-full pl-10 pr-10 py-2 rounded-lg border ${errors.newPassword ? 'border-destructive' : 'border-input'} bg-background focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  {errors.newPassword && <p className="mt-1 text-sm text-destructive">{errors.newPassword}</p>}
                </div>

                {newPassword && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Password strength:</span>
                      <span>{passwordStrength.text}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1">
                      <div className={`h-1 rounded-full ${passwordStrength.class}`} style={{ width: `${(getPasswordStrength(newPassword).text === 'Strong' ? 100 : getPasswordStrength(newPassword).text === 'Good' ? 75 : getPasswordStrength(newPassword).text === 'Fair' ? 50 : 25)}%` }}></div>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                      <li className={`flex items-center gap-1 ${newPassword.length >= 8 ? 'text-green-500' : ''}`}>
                        <span className={`inline-block w-1 h-1 rounded-full ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-muted-foreground'}`}></span>
                        At least 8 characters
                      </li>
                      <li className={`flex items-center gap-1 ${/[A-Z]/.test(newPassword) ? 'text-green-500' : ''}`}>
                        <span className={`inline-block w-1 h-1 rounded-full ${/[A-Z]/.test(newPassword) ? 'bg-green-500' : 'bg-muted-foreground'}`}></span>
                        At least 1 uppercase letter
                      </li>
                      <li className={`flex items-center gap-1 ${/[0-9]/.test(newPassword) ? 'text-green-500' : ''}`}>
                        <span className={`inline-block w-1 h-1 rounded-full ${/[0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-muted-foreground'}`}></span>
                        At least 1 number
                      </li>
                      <li className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(newPassword) ? 'text-green-500' : ''}`}>
                        <span className={`inline-block w-1 h-1 rounded-full ${/[^A-Za-z0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-muted-foreground'}`}></span>
                        At least 1 special character
                      </li>
                    </ul>
                  </div>
                )}

                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => handleChange(e, 'confirmPassword')}
                    placeholder="Confirm new password"
                    className={`w-full pl-10 pr-10 py-2 rounded-lg border ${errors.confirmPassword ? 'border-destructive' : 'border-input'} bg-background focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  {errors.confirmPassword && <p className="mt-1 text-sm text-destructive">{errors.confirmPassword}</p>}
                </div>
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
                    Resetting password...
                  </div>
                ) : 'Reset password'}
              </Button>
            </form>
          </Card.Content>
        </Card>
        
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}