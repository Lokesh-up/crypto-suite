import { Sun, Moon, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <Shield className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Crypto Suite
          </span>
        </Link>

        <nav className="flex items-center space-x-6">
          <Link 
            to="/morse" 
            className={`text-sm font-medium transition-colors hover:text-crypto-cyan ${
              location.pathname === '/morse' ? 'text-crypto-cyan' : 'text-muted-foreground'
            }`}
          >
            Morse Code
          </Link>
          <Link 
            to="/symmetric" 
            className={`text-sm font-medium transition-colors hover:text-crypto-purple ${
              location.pathname === '/symmetric' ? 'text-crypto-purple' : 'text-muted-foreground'
            }`}
          >
            Symmetric
          </Link>
          <Link 
            to="/asymmetric" 
            className={`text-sm font-medium transition-colors hover:text-crypto-green ${
              location.pathname === '/asymmetric' ? 'text-crypto-green' : 'text-muted-foreground'
            }`}
          >
            Asymmetric
          </Link>

          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-foreground" />
            ) : (
              <Moon className="h-5 w-5 text-foreground" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}