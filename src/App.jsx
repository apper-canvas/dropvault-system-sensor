import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import History from './pages/History';
import NotFound from './pages/NotFound';
import getIcon from './utils/iconUtils';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Check if we're on the home page
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const appTitle = "DropVault";

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-50 transition-colors duration-200">
      <header className="sticky top-0 z-10 bg-white dark:bg-surface-800 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-primary dark:text-primary-light font-bold text-xl md:text-2xl tracking-tight">
              {appTitle}
            </div>
            <nav className="hidden md:flex ml-8 space-x-4">
              <a href="/" className={`py-1 px-2 font-medium text-surface-600 dark:text-surface-300 hover:text-primary dark:hover:text-primary-light ${location.pathname === '/' ? 'text-primary dark:text-primary-light' : ''}`}>
                Home
              </a>
              <a href="/history" className={`py-1 px-2 font-medium text-surface-600 dark:text-surface-300 hover:text-primary dark:hover:text-primary-light ${location.pathname === '/history' ? 'text-primary dark:text-primary-light' : ''}`}>
                History
              </a>
            </nav>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <span className="text-yellow-400">
                <SunIcon />
              </span>
            ) : (
              <span className="text-primary">
                <MoonIcon />
              </span>
            )}
          </button>
        </div>
      </header>

      <main className={`container mx-auto px-4 py-8 ${!isHomePage ? 'max-w-6xl' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="bg-white dark:bg-surface-800 py-6 border-t border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 text-center text-surface-500 dark:text-surface-400 text-sm">
          <p>© {new Date().getFullYear()} DropVault. All rights reserved.</p>
        </div>
      </footer>

      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        className="md:max-w-md"
      />
    </div>
  );
}

// Icon declarations
const MoonIcon = () => {
  const Icon = getIcon("Moon");
  return <Icon size={20} />;
};

const SunIcon = () => {
  const Icon = getIcon("Sun");
  return <Icon size={20} />;
};

const HistoryIcon = () => {
  const Icon = getIcon("History");
  return <Icon size={20} />;
};

export default App;