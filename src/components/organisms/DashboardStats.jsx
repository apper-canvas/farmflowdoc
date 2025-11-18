import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import taskService from "@/services/api/taskService";
import financialService from "@/services/api/financialService";
import farmService from "@/services/api/farmService";
import cropService from "@/services/api/cropService";

const DashboardStats = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    try {
      setError("");
      setLoading(true);

      const [farms, crops, upcomingTasks, financialSummary] = await Promise.all([
        farmService.getAll(),
        cropService.getAll(),
        taskService.getUpcoming(),
        financialService.getSummary()
      ]);

      const activeCrops = crops.filter(crop => crop.status !== "Harvested").length;
      const pendingTasks = upcomingTasks.filter(task => !task.completed).length;

      setStats({
        totalFarms: farms.length,
        activeCrops,
        pendingTasks,
        netBalance: financialSummary.netBalance,
        totalIncome: financialSummary.totalIncome,
        totalExpenses: financialSummary.totalExpenses
      });
    } catch (err) {
      setError("Failed to load dashboard statistics");
      console.error("Stats loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="h-32 bg-surface rounded-xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadStats} />;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Farms"
        value={stats.totalFarms}
        icon="TreePine"
        className="hover:shadow-xl"
      />
      
      <StatCard
        title="Active Crops"
        value={stats.activeCrops}
        icon="Wheat"
        className="hover:shadow-xl"
      />
      
      <StatCard
        title="Pending Tasks"
        value={stats.pendingTasks}
        icon="CheckSquare"
        trend={stats.pendingTasks > 5 ? "up" : "down"}
        trendValue={stats.pendingTasks > 5 ? "High" : "Normal"}
        className="hover:shadow-xl"
      />
      
      <StatCard
        title="Net Balance"
        value={formatCurrency(stats.netBalance)}
        icon="DollarSign"
        trend={stats.netBalance > 0 ? "up" : "down"}
        trendValue={stats.netBalance > 0 ? "Profit" : "Loss"}
        valueColor={stats.netBalance >= 0 ? "text-success" : "text-error"}
        className="hover:shadow-xl"
      />
    </div>
  );
};

export default DashboardStats;