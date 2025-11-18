import React from 'react';
import { useAuth } from '@/layouts/Root';
import { useSelector } from 'react-redux';
import ApperIcon from '@/components/ApperIcon';

const LogoutButton = () => {
  const { logout } = useAuth();
  const { isAuthenticated, user } = useSelector(state => state.user);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <button 
      onClick={logout}
      className="p-2 text-gray-500 hover:text-error rounded-lg hover:bg-error/5 transition-colors duration-200"
      title="Logout"
    >
      <ApperIcon name="LogOut" size={20} />
    </button>
  );
};

export default LogoutButton;