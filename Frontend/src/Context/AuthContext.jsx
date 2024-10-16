import { createContext, useState, useEffect } from 'react';

// Create the context
export const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  // Check if the user is authenticated on page load (similar to what we did before)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/check-auth', {
          method: 'GET',
          credentials: 'include', // This ensures that cookies are sent with the request
        });

        if (response.ok) {
          const data = await response.json();
          setLoggedIn(data.loggedIn);
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setLoggedIn(false);
      }
    };

    checkAuth(); // Call the auth check on page load
  }, []);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    setLoggedIn(false);
    window.location.href = '/'; // Optional: Redirect to homepage on logout
  };

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
