import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Modal from '@/components/organisms/Modal';
import ApperIcon from '@/components/ApperIcon';
import { format } from 'date-fns';

const NotificationModal = ({ isOpen, onClose, onMarkAsRead }) => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Mock notifications for agriculture management system
    const mockNotifications = [
      {
        id: 1,
        type: 'weather',
        title: 'Weather Alert',
        message: 'Heavy rain expected tomorrow. Consider postponing outdoor tasks.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
        priority: 'high'
      },
      {
        id: 2,
        type: 'task',
        title: 'Task Reminder',
        message: 'Irrigation scheduled for North Field in 2 hours.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false,
        priority: 'medium'
      },
      {
        id: 3,
        type: 'system',
        title: 'System Update',
        message: 'New crop monitoring features available in your dashboard.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: true,
        priority: 'low'
      },
      {
        id: 4,
        type: 'finance',
        title: 'Budget Alert',
        message: 'Monthly expenses approaching 80% of budget limit.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        read: false,
        priority: 'medium'
      },
      {
        id: 5,
        type: 'crop',
        title: 'Growth Milestone',
        message: 'Corn crops in East Field reached maturity stage.',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        read: true,
        priority: 'low'
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'weather': return 'Cloud';
      case 'task': return 'CheckSquare';
      case 'system': return 'Settings';
      case 'finance': return 'DollarSign';
      case 'crop': return 'Leaf';
      default: return 'Bell';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'weather': return 'text-blue-600 bg-blue-100';
      case 'task': return 'text-green-600 bg-green-100';
      case 'system': return 'text-purple-600 bg-purple-100';
      case 'finance': return 'text-orange-600 bg-orange-100';
      case 'crop': return 'text-emerald-600 bg-emerald-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-error';
      case 'medium': return 'border-l-warning';
      case 'low': return 'border-l-success';
      default: return 'border-l-gray-300';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const handleMarkAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    onMarkAsRead?.(id);
    toast.success('Notification marked as read');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    toast.success('All notifications marked as read');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ApperIcon name="Bell" size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-600">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            {['all', 'unread', 'read'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors duration-200 ${
                  filter === filterType
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-200"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-sm ${
                  notification.read ? 'bg-gray-50' : 'bg-white border shadow-sm'
                } ${getPriorityColor(notification.priority)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex space-x-3 flex-1">
                    <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                      <ApperIcon name={getTypeIcon(notification.type)} size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {format(notification.timestamp, 'MMM d, yyyy • h:mm a')}
                      </p>
                    </div>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="ml-3 text-xs text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <ApperIcon name="Bell" size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">
                {filter === 'unread' 
                  ? "You're all caught up! No unread notifications."
                  : filter === 'read'
                  ? "No read notifications to display."
                  : "You have no notifications at this time."
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default NotificationModal;