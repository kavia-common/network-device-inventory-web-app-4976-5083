import React, { useEffect, useState } from 'react';
import './App.css';
import DevicesPage from './pages/DevicesPage';

/**
 * App entry point with theme toggle and main routing to DevicesPage.
 */
// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-brand">Network Device Inventory</div>
        <div className="navbar-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </nav>
      <main>
        <DevicesPage />
      </main>
      <footer className="footer">
        <span className="muted">© {new Date().getFullYear()} Network Device Inventory</span>
      </footer>
    </div>
  );
}

export default App;
