import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import LogoutButton from "@/components/atoms/LogoutButton";
import ApperIcon from "@/components/ApperIcon";
import NotificationModal from "@/components/organisms/NotificationModal";
import SettingsModal from "@/components/organisms/SettingsModal";

function Header({ title = "FarmFlow" }) {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [unreadCount, setUnreadCount] = useState(3); // Example count, replace with actual logic
  const navItems = [
    { name: "Dashboard", path: "", icon: "LayoutDashboard" },
    { name: "Farms", path: "farms", icon: "TreePine" },
    { name: "Crops", path: "crops", icon: "Wheat" },
    { name: "Tasks", path: "tasks", icon: "CheckSquare" },
    { name: "Finances", path: "finances", icon: "DollarSign" },
    { name: "Weather", path: "weather", icon: "Cloud" }
  ];

  const getPageTitle = () => {
    const currentPath = location.pathname.replace("/", "");
    const currentItem = navItems.find(item => item.path === currentPath);
    return currentItem ? currentItem.name : "FarmFlow";
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <ApperIcon name="TreePine" size={24} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                FarmFlow
              </h1>
              <p className="text-xs text-gray-500 font-medium">Agriculture Management</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive = (item.path === "" && location.pathname === "/") || 
                             (item.path !== "" && location.pathname.startsWith(`/${item.path}`));
              
              return (
                <Link
                  key={item.name}
                  to={`/${item.path}`}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02]",
                    isActive
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                      : "text-gray-600 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  <ApperIcon name={item.icon} size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Page Title */}
          <div className="lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900">{getPageTitle()}</h2>
          </div>

          {/* User Actions */}
<div className="hidden lg:flex items-center space-x-3">
            <button 
              onClick={() => setShowNotifications(true)}
              className="p-2 text-gray-500 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors duration-200 relative"
            >
              <ApperIcon name="Bell" size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-500 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors duration-200"
            >
              <ApperIcon name="Settings" size={20} />
            </button>
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <div className="grid grid-cols-6 gap-1 p-2">
          {navItems.map((item) => {
            const isActive = (item.path === "" && location.pathname === "/") || 
                           (item.path !== "" && location.pathname.startsWith(`/${item.path}`));
            
            return (
              <Link
                key={item.name}
                to={`/${item.path}`}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium transition-all duration-200 min-h-[60px]",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-gray-500 hover:text-primary hover:bg-primary/5"
                )}
              >
                <ApperIcon name={item.icon} size={20} className="mb-1" />
                <span className="leading-tight">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
{/* Notification Modal */}
      {showNotifications && (
        <NotificationModal
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </header>
  );
}

export default Header;