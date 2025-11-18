import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import farmService from "@/services/api/farmService";
import cropService from "@/services/api/cropService";
import { toast } from "react-toastify";

const FarmList = ({ onEdit, onAdd, refreshKey }) => {
  const [farms, setFarms] = useState([]);
  const [cropCounts, setCropCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFarms = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [farmsData, cropsData] = await Promise.all([
        farmService.getAll(),
        cropService.getAll()
      ]);

      // Count active crops per farm
      const counts = {};
      cropsData.forEach(crop => {
        if (crop.status !== "Harvested") {
          counts[crop.farmId] = (counts[crop.farmId] || 0) + 1;
        }
      });

      setFarms(farmsData);
      setCropCounts(counts);
    } catch (err) {
      setError("Failed to load farms");
      console.error("Farms loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (farmId) => {
    if (!window.confirm("Are you sure you want to delete this farm? This action cannot be undone.")) {
      return;
    }

    try {
      await farmService.delete(farmId);
      toast.success("Farm deleted successfully!");
      await loadFarms();
    } catch (err) {
      toast.error("Failed to delete farm");
      console.error("Farm deletion error:", err);
    }
  };

  useEffect(() => {
loadFarms();
  }, [refreshKey]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadFarms} />;
  }

  if (farms.length === 0) {
    return (
      <Empty
        title="No farms found"
        description="Start by adding your first farm to begin tracking your agricultural operations."
        actionLabel="Add Farm"
        onAction={onAdd}
        icon="TreePine"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Your Farms</h2>
        <Button onClick={onAdd} icon="Plus">
          Add Farm
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms.map((farm) => (
          <div key={farm.Id} className="card hover:shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">{farm.name}</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="MapPin" size={14} className="mr-1" />
                  <span>{farm.location}</span>
                </div>
              </div>
              
              <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-xl flex items-center justify-center">
                <ApperIcon name="TreePine" size={24} className="text-primary" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
                  <p className="text-2xl font-bold text-primary">
                    {farm.size}
                  </p>
                  <p className="text-xs text-gray-600 font-medium">
                    {farm.sizeUnit}
                  </p>
                </div>
                
                <div className="text-center p-3 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-lg">
                  <p className="text-2xl font-bold text-secondary">
                    {cropCounts[farm.Id.toString()] || 0}
                  </p>
                  <p className="text-xs text-gray-600 font-medium">
                    Active Crops
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(farm)}
                  className="flex-1"
                  icon="Edit2"
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(farm.Id)}
                  className="flex-1 text-error hover:bg-error/10 hover:text-error"
                  icon="Trash2"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FarmList;