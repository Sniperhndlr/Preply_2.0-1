import React, { createContext, useContext, useState, useEffect, useLayoutEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        try {
            // Check localStorage for saved preference
            const saved = localStorage.getItem('darkMode');
            if (saved !== null) {
                return JSON.parse(saved);
            }
            // Check system preference
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        } catch (error) {
            console.error('Error reading theme from localStorage:', error);
            return false;
        }
    });

    useLayoutEffect(() => {
        try {
            // Save to localStorage
            localStorage.setItem('darkMode', JSON.stringify(darkMode));

            // Apply dark class to document
            const root = window.document.documentElement;
            if (darkMode) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        } catch (error) {
            console.error('Error applying theme:', error);
        }
    }, [darkMode]);

    // Listen for system preference changes if no user override (optional, but good UX)
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            if (localStorage.getItem('darkMode') === null) {
                setDarkMode(e.matches);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{ darkMode, setDarkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};
