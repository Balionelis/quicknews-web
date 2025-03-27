import React, { useState, useEffect } from 'react';

const ThemeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [canToggleTheme, setCanToggleTheme] = useState<boolean>(true);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isDarkMode, showNotification]);

  const toggleTheme = () => {
    if (canToggleTheme) {
      setIsDarkMode(!isDarkMode);
      setShowNotification(true);
      setCanToggleTheme(false);
      
      setTimeout(() => {
        setCanToggleTheme(true);
      }, 3000);
    }
  };

  return (
    <>
      <button 
        onClick={toggleTheme} 
        className="theme-toggle"
        disabled={!canToggleTheme}
        aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        style={{
          position: 'absolute',
          top: '20px',
          right: '10px',
          border: 'none',
          cursor: canToggleTheme ? 'pointer' : 'default',
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px',
          borderRadius: '50%',
          transition: 'background-color 0.3s ease',
          opacity: canToggleTheme ? 1 : 0.5
        }}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
      
      {showNotification && (
        <div 
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--card-background)',
            color: 'var(--text-color)',
            padding: '10px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 1000,
            animation: 'slideUp 0.3s ease-out, fadeOut 0.3s ease-out 2.7s forwards'
          }}
        >
          Changed preferred theme
        </div>
      )}
      
      <style>
        {`
          @keyframes slideUp {
            from { transform: translate(-50%, 100%); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
          }
          
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; transform: translate(-50%, 20px); }
          }
        `}
      </style>
    </>
  );
};

export default ThemeToggle;