import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { initializeSocket, disconnectSocket } from '../services/socketService';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize user from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);

    // Cleanup on unmount
    return () => {
      if (user) {
        disconnectSocket();
      }
    };
  }, [user]); // Add user to dependency array

  const login = async (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Initialize WebSocket connection
    if (userData._id) {
      initializeSocket(userData._id);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    disconnectSocket();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export { AuthContext, AuthProvider };
