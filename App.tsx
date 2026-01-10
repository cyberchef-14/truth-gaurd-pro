
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Auth from './components/Auth';
import FactChecker from './components/FactChecker';
import Dashboard from './components/Dashboard';
import History from './components/History';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('check');
  const [isInitializing, setIsInitializing] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedUser = localStorage.getItem('tg_user');
    const savedTheme = localStorage.getItem('tg_theme') as 'dark' | 'light';
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedTheme) setTheme(savedTheme);
    setIsInitializing(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('tg_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('tg_user');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('tg_theme', newTheme);
  };

  if (isInitializing) return null;

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'check': return <FactChecker />;
      case 'dashboard': return <Dashboard />;
      case 'history': return <History />;
      default: return <FactChecker />;
    }
  };

  return (
    <div className={theme}>
      <Layout 
        user={user} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      >
        {renderContent()}
      </Layout>
    </div>
  );
};

export default App;
