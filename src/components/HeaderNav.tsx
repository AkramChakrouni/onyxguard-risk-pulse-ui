
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import { Bell, LayoutDashboard, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const HeaderNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={16} className="mr-1" />,
    },
    {
      label: "Alerts",
      path: "/alerts",
      icon: <Bell size={16} className="mr-1" />,
    },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 bg-card/70 backdrop-blur-lg border-b border-border shadow-sm"
    >
      <div className="container py-3">
        <div className="flex justify-between items-center">
          <div onClick={() => navigate("/")} className="cursor-pointer">
            <Logo size="sm" />
          </div>
          
          <div className="flex items-center space-x-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                size="sm"
                onClick={() => navigate(item.path)}
                className={cn(
                  "relative",
                  location.pathname === item.path ? "bg-muted" : ""
                )}
              >
                {item.icon}
                {item.label}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-onyx-accent rounded-full"
                    transition={{ type: "spring", duration: 0.6 }}
                  />
                )}
              </Button>
            ))}
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button 
              variant="outline" 
              size="icon" 
              className="bg-transparent"
              onClick={() => navigate("/")}
            >
              <Search size={16} />
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default HeaderNav;
