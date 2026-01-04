import React, { useState } from 'react'; // Removed unused 'useEffect'
import Navbar from './components/Navbar.jsx';
import Auth from './components/Auth.jsx';

function App() {
  // Initialize state based on whether 'user' exists in localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Function to handle successful login updates
  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  return (
    <div>
      {/* If user exists, show Navbar, otherwise show Auth */}
      {user ? <Navbar /> : <Auth onLoginSuccess={handleLoginSuccess} />}
    </div>
  );
}

export default App;