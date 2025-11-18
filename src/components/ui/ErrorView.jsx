import React from "react";
import ApperIcon from "@/components/ApperIcon";

const ErrorView = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="text-center max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-error/10 to-error/20 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" size={40} className="text-error" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {message}
          </p>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-primary inline-flex items-center gap-2 min-h-[44px]"
          >
            <ApperIcon name="RefreshCw" size={18} />
            Try Again
          </button>
        )}

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If this problem persists, please check your connection and try again.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorView;