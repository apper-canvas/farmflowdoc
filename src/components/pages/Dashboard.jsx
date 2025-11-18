import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardStats from "@/components/organisms/DashboardStats";
import UpcomingTasks from "@/components/organisms/UpcomingTasks";
import WeatherWidget from "@/components/organisms/WeatherWidget";
import ApperIcon from "@/components/ApperIcon";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
            <ApperIcon name="TreePine" size={32} className="text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to FarmFlow
            </h1>
            <p className="text-gray-600 font-medium">
              Manage your agricultural operations with ease
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <ApperIcon name="CheckSquare" size={24} className="mr-3 text-primary" />
                Upcoming Tasks
              </h2>
              <span className="text-sm text-gray-500 font-medium">Next 7 days</span>
            </div>
            <UpcomingTasks />
          </div>
        </div>

        {/* Weather Widget */}
        <div className="space-y-6">
          <WeatherWidget />
          
          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Zap" size={20} className="mr-2 text-accent" />
              Quick Actions
            </h3>
            
            <div className="space-y-3">
<button 
                onClick={() => navigate("/tasks")}
                className="w-full flex items-center justify-between p-3 text-left bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 rounded-lg transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="flex items-center">
                  <ApperIcon name="Plus" size={16} className="mr-3 text-primary" />
                  <span className="font-medium text-gray-900">Add New Task</span>
                </div>
                <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
              </button>
              
<button 
                onClick={() => navigate("/finances")}
                className="w-full flex items-center justify-between p-3 text-left bg-gradient-to-r from-secondary/5 to-secondary/10 hover:from-secondary/10 hover:to-secondary/15 rounded-lg transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="flex items-center">
                  <ApperIcon name="DollarSign" size={16} className="mr-3 text-secondary" />
                  <span className="font-medium text-gray-900">Log Expense</span>
                </div>
                <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
              </button>
              
<button 
                onClick={() => navigate("/crops")}
                className="w-full flex items-center justify-between p-3 text-left bg-gradient-to-r from-accent/5 to-accent/10 hover:from-accent/10 hover:to-accent/15 rounded-lg transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="flex items-center">
                  <ApperIcon name="Wheat" size={16} className="mr-3 text-accent" />
                  <span className="font-medium text-gray-900">Add Crop</span>
                </div>
                <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;