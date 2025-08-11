import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import InputField from '../components/InputField';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Alert, AlertDescription } from '../components/ui/Alert';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

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
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const response = await authService.login(formData);
      
      if (response.data.token) {
        // Regular login successful
        login(response.data.token);
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        // 2FA is enabled, navigate to 2FA verification
        toast.success('Please enter your 2FA code');
        navigate('/verify-2fa', { state: { email: formData.email } });
      }
    } catch (error) {
      setLoginAttempts(prevAttempts => prevAttempts + 1);
      toast.error(error.response?.data?.message || 'Failed to login');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 px-4">
      <Card>
        <Card.Header>
          <div className="flex justify-center mb-2">
            <img src="/QuickCourt.png" alt="Logo" className="w-12 h-12" />
          </div>
          <Card.Title className="text-center">Login to Your Account</Card.Title>
          <Card.Description className="text-center">
            Enter your email and password to access your account
          </Card.Description>
        </Card.Header>
        <Card.Content>
          {loginAttempts >= 3 && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                Too many failed login attempts. Consider resetting your password.
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <InputField
              label="Email"
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              error={errors.email}
              required
            />
            
            <InputField
              label="Password"
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              error={errors.password}
              required
            />
            
            <div className="flex justify-end mb-4">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot Password?
              </Link>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : 'Login'}
            </Button>
          </form>
        </Card.Content>
        <Card.Footer className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
          </p>
        </Card.Footer>
      </Card>
    </div>
  );
}