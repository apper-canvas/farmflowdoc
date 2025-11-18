import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item", 
  actionLabel = "Add Item",
  onAction,
  icon = "Plus"
}) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="text-center max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/10 to-secondary/20 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} size={40} className="text-primary" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {onAction && actionLabel && (
          <button
            onClick={onAction}
            className="btn-primary inline-flex items-center gap-2 min-h-[44px]"
          >
            <ApperIcon name="Plus" size={18} />
            {actionLabel}
          </button>
        )}

        <div className="pt-4">
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto opacity-20">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Empty;