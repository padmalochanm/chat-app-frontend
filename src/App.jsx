import './App.css';
import Header from './components/Header';
import Chatspage from './pages/Chatspage';
import Homepage from './pages/Homepage';
import { useEffect, useState } from 'react';

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check for token in localStorage
    const storedToken = localStorage.getItem('authToken');
    setToken(storedToken);
  }, []);

  return (
    <div className="p-3 min-h-screen">
      <Header />
      {token ? <Chatspage /> : <Homepage />}
    </div>
  );
}

export default App;
