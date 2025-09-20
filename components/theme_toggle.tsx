"use client";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check system preference on mount
    if (typeof window !== 'undefined') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(systemPrefersDark);
      
      // Always set the data-theme attribute to override system preferences
      if (systemPrefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (typeof document !== 'undefined') {
      // Always set explicit theme to override system preferences
      if (newTheme) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }
  };

  // Don't render anything until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="w-12 h-12 rounded-xl bg-card border border-card-border flex items-center justify-center">
        <span className="text-xl">⚪</span>
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-12 h-12 rounded-xl bg-card border border-card-border hover:bg-muted transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
      aria-label="Toggle theme"
    >
      <span className="text-xl">
        {isDark ? '☀️' : '🌙'}
      </span>
    </button>
  );
}