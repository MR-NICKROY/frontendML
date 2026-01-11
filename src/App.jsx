import React, { useState, useEffect } from 'react';
import MainLayout from './components/MainLayout'; 
import Preloader from './components/Preloader'; // Make sure you have this component created

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set a timer for 5 seconds (5000 milliseconds)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      {isLoading ? <Preloader /> : <MainLayout />}
    </div>
  );
}

export default App;