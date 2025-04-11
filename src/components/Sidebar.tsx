
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { 
  Home, 
  BarChart, 
  CalendarClock, 
  Leaf, 
  Award, 
  Settings, 
  UserCircle, 
  LogOut,
  MenuIcon,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';
import { UserAgeGroup } from '@/types';
import { cn } from '@/lib/utils';

const getAgeGroupLabel = (ageGroup: UserAgeGroup): string => {
  switch (ageGroup) {
    case 'teen': return 'Teen';
    case 'adult': return 'Adult';
    case 'senior': return 'Senior';
    default: return 'User';
  }
};

const Sidebar = () => {
  const { user } = useApp();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { path: '/expenses', label: 'Expenses', icon: <BarChart className="h-5 w-5" /> },
    { path: '/budget', label: 'Budget', icon: <CalendarClock className="h-5 w-5" /> },
    { path: '/carbon', label: 'Carbon Impact', icon: <Leaf className="h-5 w-5" /> },
    { path: '/rewards', label: 'Rewards', icon: <Award className="h-5 w-5" /> },
    { path: '/settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">EcoBudget</h1>
        <div className="flex items-center mt-4">
          <div className="bg-sidebar-accent p-2 rounded-full">
            <UserCircle className="h-8 w-8 text-sidebar-foreground" />
          </div>
          <div className="ml-3">
            <p className="text-sidebar-foreground font-medium">{user.name}</p>
            <p className="text-sidebar-foreground/70 text-sm">{getAgeGroupLabel(user.ageGroup)}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                  location.pathname === item.path && "bg-sidebar-accent font-medium"
                )}
                onClick={isMobile ? toggleSidebar : undefined}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border mt-auto">
        <button className="flex items-center w-full px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
          <LogOut className="h-5 w-5" />
          <span className="ml-3">Log out</span>
        </button>
      </div>
    </div>
  );

  // Mobile sidebar toggle button
  const mobileToggle = isMobile && (
    <Button
      variant="ghost"
      size="icon"
      className="fixed top-4 left-4 z-50 bg-sidebar text-sidebar-foreground"
      onClick={toggleSidebar}
    >
      {isOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
    </Button>
  );

  return (
    <>
      {mobileToggle}
      
      {isMobile ? (
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out bg-sidebar",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebarContent}
        </div>
      ) : (
        <div className="w-64 bg-sidebar h-screen flex-shrink-0">
          {sidebarContent}
        </div>
      )}
    </>
  );
};

export default Sidebar;
