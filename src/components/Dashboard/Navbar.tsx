
import React from 'react';
import { Bell, Shield, Menu, X, User, Settings, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NavbarProps {
  toggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, sidebarOpen }) => {
  return (
    <div className="h-16 px-4 border-b border-border/40 flex items-center justify-between bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2 lg:hidden">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>

        <div className="flex items-center">
          <Shield className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-lg font-semibold">CyberGuard</h1>
        </div>
      </div>

      <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search threats, alerts, IPs..."
          className="pl-8 bg-background/50"
        />
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-critical" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings size={20} />
        </Button>
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
          <User size={16} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
