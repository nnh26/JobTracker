import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { Toaster } from 'react-hot-toast';

function App() {
  const [view, setView] = useState('landing');
  const [initialLoginMode, setInitialLoginMode] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setView('dashboard');
  }, []);

  const navigateToAuth = (isLoginMode) => {
    setInitialLoginMode(isLoginMode);
    setView('login');
  };

  function App() {
  return (
    <Router>
      {/* 2. Place the Toaster here so it stays on top of every page */}
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '10px',
          },
        }} 
      />
      
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        {/* ... any other routes you have */}
      </Routes>
    </Router>
  );
}
  const handleLogout = () => {
    localStorage.removeItem('token');
    setView('landing');
  };

  return (
    <main>
      {view === 'landing' && (
        <LandingPage 
          onNavigateLogin={() => navigateToAuth(true)} 
          onNavigateRegister={() => navigateToAuth(false)}
          onNavigateHome={() => setView('landing')}
        />
      )}
      
      {view === 'login' && (
        <Login 
          onLogin={() => setView('dashboard')} 
          onBackToHome={() => setView('landing')}
          initialMode={initialLoginMode}
        />
      )}
      
      {view === 'dashboard' && (
        <Dashboard onLogout={handleLogout} />
      )}
    </main>
  );
}
const navigateToAuth = (isLoginMode) => {
  setInitialLoginMode(isLoginMode); // 1. Set the form type
  setView('login');                // 2. Change the screen
};

export default App;