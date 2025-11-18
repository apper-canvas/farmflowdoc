import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Modal from '@/components/organisms/Modal';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';

const SettingsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [settings, setSettings] = useState({
    notifications: {
      weatherAlerts: true,
      taskReminders: true,
      systemUpdates: false,
      emailNotifications: true,
      pushNotifications: true,
      reminderTime: '08:00'
    },
    display: {
      theme: 'light',
      language: 'en',
      dateFormat: 'MM/dd/yyyy',
      timezone: 'UTC-5'
    },
    account: {
      farmName: 'Green Valley Farm',
      ownerName: 'John Farmer',
      email: 'john@greenvalleyfarm.com',
      phone: '+1 (555) 123-4567'
    }
  });

  const [originalSettings, setOriginalSettings] = useState({});

  useEffect(() => {
    if (isOpen) {
      // Load settings from localStorage or API
      const savedSettings = localStorage.getItem('farmflow-settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        setOriginalSettings(parsed);
      } else {
        setOriginalSettings(settings);
      }
    }
  }, [isOpen]);

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'display', label: 'Display', icon: 'Monitor' },
    { id: 'account', label: 'Account', icon: 'User' }
  ];

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    localStorage.setItem('farmflow-settings', JSON.stringify(settings));
    setOriginalSettings(settings);
    toast.success('Settings saved successfully');
    onClose();
  };

  const handleCancel = () => {
    setSettings(originalSettings);
    onClose();
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} size="xl">
      <div className="flex h-[600px]">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ApperIcon name="Settings" size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
              <p className="text-sm text-gray-600">Manage your preferences</p>
            </div>
          </div>

          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ApperIcon name={tab.icon} size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                      <div>
                        <Label className="font-medium">Weather Alerts</Label>
                        <p className="text-sm text-gray-600">Get notified about weather conditions affecting your farm</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('notifications', 'weatherAlerts', !settings.notifications.weatherAlerts)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                          settings.notifications.weatherAlerts ? 'bg-primary' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          settings.notifications.weatherAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                      <div>
                        <Label className="font-medium">Task Reminders</Label>
                        <p className="text-sm text-gray-600">Receive reminders for scheduled farm tasks</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('notifications', 'taskReminders', !settings.notifications.taskReminders)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                          settings.notifications.taskReminders ? 'bg-primary' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          settings.notifications.taskReminders ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                      <div>
                        <Label className="font-medium">System Updates</Label>
                        <p className="text-sm text-gray-600">Get notified about new features and system updates</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('notifications', 'systemUpdates', !settings.notifications.systemUpdates)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                          settings.notifications.systemUpdates ? 'bg-primary' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          settings.notifications.systemUpdates ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="p-4 bg-surface rounded-lg">
                      <Label className="font-medium mb-2 block">Daily Reminder Time</Label>
                      <Input
                        type="time"
                        value={settings.notifications.reminderTime}
                        onChange={(e) => handleSettingChange('notifications', 'reminderTime', e.target.value)}
                        className="w-40"
                      />
                      <p className="text-sm text-gray-600 mt-1">When to send daily task reminders</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'display' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Settings</h3>
                  
                  <div className="grid gap-6">
                    <div className="p-4 bg-surface rounded-lg">
                      <Label className="font-medium mb-2 block">Theme</Label>
                      <Select
                        value={settings.display.theme}
                        onChange={(e) => handleSettingChange('display', 'theme', e.target.value)}
                        className="w-full"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto (System)</option>
                      </Select>
                      <p className="text-sm text-gray-600 mt-1">Choose your preferred color scheme</p>
                    </div>

                    <div className="p-4 bg-surface rounded-lg">
                      <Label className="font-medium mb-2 block">Language</Label>
                      <Select
                        value={settings.display.language}
                        onChange={(e) => handleSettingChange('display', 'language', e.target.value)}
                        className="w-full"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                      </Select>
                      <p className="text-sm text-gray-600 mt-1">Select your preferred language</p>
                    </div>

                    <div className="p-4 bg-surface rounded-lg">
                      <Label className="font-medium mb-2 block">Date Format</Label>
                      <Select
                        value={settings.display.dateFormat}
                        onChange={(e) => handleSettingChange('display', 'dateFormat', e.target.value)}
                        className="w-full"
                      >
                        <option value="MM/dd/yyyy">MM/DD/YYYY</option>
                        <option value="dd/MM/yyyy">DD/MM/YYYY</option>
                        <option value="yyyy-MM-dd">YYYY-MM-DD</option>
                      </Select>
                      <p className="text-sm text-gray-600 mt-1">How dates are displayed throughout the app</p>
                    </div>

                    <div className="p-4 bg-surface rounded-lg">
                      <Label className="font-medium mb-2 block">Timezone</Label>
                      <Select
                        value={settings.display.timezone}
                        onChange={(e) => handleSettingChange('display', 'timezone', e.target.value)}
                        className="w-full"
                      >
                        <option value="UTC-8">Pacific (UTC-8)</option>
                        <option value="UTC-7">Mountain (UTC-7)</option>
                        <option value="UTC-6">Central (UTC-6)</option>
                        <option value="UTC-5">Eastern (UTC-5)</option>
                      </Select>
                      <p className="text-sm text-gray-600 mt-1">Your local timezone for schedules and reminders</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                  
                  <div className="grid gap-4">
                    <div className="p-4 bg-surface rounded-lg">
                      <Label className="font-medium mb-2 block">Farm Name</Label>
                      <Input
                        value={settings.account.farmName}
                        onChange={(e) => handleSettingChange('account', 'farmName', e.target.value)}
                        placeholder="Enter your farm name"
                        className="w-full"
                      />
                    </div>

                    <div className="p-4 bg-surface rounded-lg">
                      <Label className="font-medium mb-2 block">Owner Name</Label>
                      <Input
                        value={settings.account.ownerName}
                        onChange={(e) => handleSettingChange('account', 'ownerName', e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full"
                      />
                    </div>

                    <div className="p-4 bg-surface rounded-lg">
                      <Label className="font-medium mb-2 block">Email Address</Label>
                      <Input
                        type="email"
                        value={settings.account.email}
                        onChange={(e) => handleSettingChange('account', 'email', e.target.value)}
                        placeholder="Enter your email"
                        className="w-full"
                      />
                    </div>

                    <div className="p-4 bg-surface rounded-lg">
                      <Label className="font-medium mb-2 block">Phone Number</Label>
                      <Input
                        type="tel"
                        value={settings.account.phone}
                        onChange={(e) => handleSettingChange('account', 'phone', e.target.value)}
                        placeholder="Enter your phone number"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {hasChanges && (
                  <span className="flex items-center space-x-1 text-warning">
                    <ApperIcon name="AlertCircle" size={16} />
                    <span>You have unsaved changes</span>
                  </span>
                )}
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className={!hasChanges ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;