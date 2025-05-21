
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { Button } from '@/components/design-system';
import { ChevronRight, Database, Users, BarChart2, Home } from 'lucide-react';

const NavigationBar: React.FC = () => {
  const location = useLocation();
  const { setLastVisitedRoute } = useAppContext();
  
  // Track route changes
  React.useEffect(() => {
    setLastVisitedRoute(location.pathname);
  }, [location.pathname, setLastVisitedRoute]);
  
  // Navigation items
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home className="h-4 w-4" /> },
    { path: '/genai', label: 'GenAI Accelerators', icon: <Database className="h-4 w-4" /> },
    { path: '/team', label: 'Team Configuration', icon: <Users className="h-4 w-4" /> },
    { path: '/simulation', label: 'Simulation', icon: <BarChart2 className="h-4 w-4" /> },
  ];
  
  const getCurrentPageIndex = () => {
    const currentPath = location.pathname;
    return navItems.findIndex(item => 
      currentPath === item.path || 
      (item.path !== '/' && currentPath.startsWith(item.path))
    );
  };
  
  const currentIndex = getCurrentPageIndex();
  
  return (
    <div className="bg-background/60 backdrop-blur-lg border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center space-x-2">
          {navItems.map((item, index) => (
            <React.Fragment key={item.path}>
              {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              <Link 
                to={item.path}
                className={`flex items-center space-x-1 text-sm rounded-md px-3 py-2 transition-colors ${
                  (currentIndex === index) 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-muted'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
