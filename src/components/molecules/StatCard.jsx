import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue,
  className,
  valueColor = "text-gray-900"
}) => {
  const getTrendColor = () => {
    if (trend === "up") return "text-success";
    if (trend === "down") return "text-error";
    return "text-gray-500";
  };

  return (
    <div className={cn("card", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline space-x-2">
            <span className={cn("text-3xl font-bold", valueColor)}>
              {value}
            </span>
            {trend && trendValue && (
              <div className={cn("flex items-center text-sm font-medium", getTrendColor())}>
                <ApperIcon 
                  name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                  size={16} 
                  className="mr-1"
                />
                {trendValue}
              </div>
            )}
          </div>
        </div>
        
        {icon && (
          <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-xl flex items-center justify-center">
            <ApperIcon name={icon} size={24} className="text-primary" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;