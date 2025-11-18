import React from "react";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto space-y-8">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/10 to-secondary/20 rounded-full flex items-center justify-center">
          <ApperIcon name="TreePine" size={48} className="text-primary" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-bold text-gray-900">
            Page Not Found
          </h2>
          <p className="text-gray-600 leading-relaxed">
            The page you're looking for seems to have wandered off like a lost cow. 
            Don't worry, let's get you back to your farm management dashboard.
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/">
            <Button icon="Home" className="w-full">
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="grid grid-cols-2 gap-3">
            <Link to="/farms">
              <Button variant="outline" size="sm" icon="TreePine" className="w-full">
                Your Farms
              </Button>
            </Link>
            <Link to="/tasks">
              <Button variant="outline" size="sm" icon="CheckSquare" className="w-full">
                View Tasks
              </Button>
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Lost? Check out our navigation menu or head back to the dashboard to find what you need.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;