import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-secondary rounded-full animate-spin mx-auto" style={{ animationDirection: "reverse", animationDuration: "0.75s" }}></div>
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            FarmFlow
          </h3>
          <p className="text-gray-600 font-medium">Loading your farm data...</p>
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <div className="h-3 bg-primary/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-secondary animate-pulse rounded-full" style={{ width: "60%" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;