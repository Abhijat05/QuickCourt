import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import InputField from '../components/InputField';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Verify2FA() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const email = location.state?.email;
  
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

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

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Two-Factor Authentication</h2>
      <p className="mb-4 text-gray-600 text-center">
        We've sent a 6-digit OTP to {email}. Please enter it below to complete login.
      </p>
      
      <form onSubmit={handleSubmit}>
        <InputField
          label="OTP Code"
          type="text"
          id="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP"
          error={error}
          required
        />
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
    </div>
  );
}