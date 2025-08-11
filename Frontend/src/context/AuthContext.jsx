import { createContext, useState, useEffect, useContext } from 'react';
import { useTheme } from 'next-themes';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    
    if (token) {
      // Get user data from localStorage
      try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        setUser({ token, ...userData });
        console.log("User authenticated with role:", userData.role); // Add this for debugging
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser({ token });
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(userData || {}));
    setUser({ token, ...userData });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, theme, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);