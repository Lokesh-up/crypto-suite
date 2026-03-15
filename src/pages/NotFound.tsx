import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Shield, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background page-enter">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-r from-primary to-accent mb-6">
          <Shield className="h-12 w-12 text-white" />
        </div>
        
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl font-bold mb-4 text-foreground">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-8">
          The cryptographic page you're looking for doesn't exist in our secure vault.
        </p>
        
        <Link 
          to="/" 
          className="crypto-button inline-flex items-center space-x-2 hover:scale-105 transition-transform"
        >
          <Home className="h-4 w-4" />
          <span>Return to Crypto Suite</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
