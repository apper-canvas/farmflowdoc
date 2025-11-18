import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Modal from "@/components/organisms/Modal";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import cropService from "@/services/api/cropService";
import farmService from "@/services/api/farmService";
import { format, differenceInDays } from "date-fns";
import { toast } from "react-toastify";

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    farmId: "",
    cropType: "",
    fieldLocation: "",
    plantingDate: "",
    expectedHarvestDate: "",
    status: "Planted",
    notes: ""
  });

  const statusOptions = [
    { value: "Planted", label: "Planted" },
    { value: "Growing", label: "Growing" },
    { value: "Flowering", label: "Flowering" },
    { value: "Mature", label: "Mature" },
    { value: "Harvested", label: "Harvested" }
  ];

  const cropTypes = [
    { value: "Corn", label: "Corn" },
    { value: "Wheat", label: "Wheat" },
    { value: "Soybeans", label: "Soybeans" },
    { value: "Tomatoes", label: "Tomatoes" },
    { value: "Potatoes", label: "Potatoes" },
    { value: "Rice", label: "Rice" },
    { value: "Cotton", label: "Cotton" },
    { value: "Barley", label: "Barley" }
  ];

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [cropsData, farmsData] = await Promise.all([
        cropService.getAll(),
        farmService.getAll()
      ]);

      setCrops(cropsData);
      setFarms(farmsData);
    } catch (err) {
      setError("Failed to load crops data");
      console.error("Crops loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      farmId: "",
      cropType: "",
      fieldLocation: "",
      plantingDate: "",
      expectedHarvestDate: "",
      status: "Planted",
      notes: ""
    });
    setEditingCrop(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (crop) => {
    setFormData({
      farmId: crop.farmId,
      cropType: crop.cropType,
      fieldLocation: crop.fieldLocation,
      plantingDate: format(new Date(crop.plantingDate), "yyyy-MM-dd"),
      expectedHarvestDate: format(new Date(crop.expectedHarvestDate), "yyyy-MM-dd"),
      status: crop.status,
      notes: crop.notes || ""
    });
    setEditingCrop(crop);
    setShowModal(true);
  };

  const handleDelete = async (cropId) => {
    if (!window.confirm("Are you sure you want to delete this crop?")) {
      return;
    }

    try {
      await cropService.delete(cropId);
      toast.success("Crop deleted successfully!");
      await loadData();
    } catch (err) {
      toast.error("Failed to delete crop");
      console.error("Crop deletion error:", err);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.farmId || !formData.cropType || !formData.fieldLocation || 
        !formData.plantingDate || !formData.expectedHarvestDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const cropData = {
        ...formData,
        plantingDate: new Date(formData.plantingDate).toISOString(),
        expectedHarvestDate: new Date(formData.expectedHarvestDate).toISOString()
      };

      if (editingCrop) {
        await cropService.update(editingCrop.Id, cropData);
        toast.success("Crop updated successfully!");
      } else {
        await cropService.create(cropData);
        toast.success("Crop created successfully!");
      }

      handleClose();
      await loadData();
    } catch (error) {
      toast.error("Failed to save crop");
      console.error("Crop save error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadData} />;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Planted": return "default";
      case "Growing": return "primary";
      case "Flowering": return "secondary";
      case "Mature": return "warning";
      case "Harvested": return "success";
      default: return "default";
    }
  };

  const getDaysToHarvest = (harvestDate) => {
    return differenceInDays(new Date(harvestDate), new Date());
  };

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id.toString() === farmId);
    return farm ? farm.name : "Unknown Farm";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Crop Management</h1>
        <Button onClick={handleAdd} icon="Plus">
          Add Crop
        </Button>
      </div>

      {crops.length === 0 ? (
        <Empty
          title="No crops found"
          description="Start by adding your first crop to begin tracking growth and harvest schedules."
          actionLabel="Add Crop"
          onAction={handleAdd}
          icon="Wheat"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.map((crop) => {
            const daysToHarvest = getDaysToHarvest(crop.expectedHarvestDate);
            const isOverdue = daysToHarvest < 0 && crop.status !== "Harvested";
            
            return (
              <div key={crop.Id} className="card hover:shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900">{crop.cropType}</h3>
                    <p className="text-sm text-gray-600">{getFarmName(crop.farmId)}</p>
                    <p className="text-sm text-gray-600">{crop.fieldLocation}</p>
                  </div>
                  
                  <Badge variant={getStatusColor(crop.status)}>
                    {crop.status}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Planted</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {format(new Date(crop.plantingDate), "MMM dd")}
                      </p>
                    </div>
                    
                    <div className="text-center p-3 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Harvest</p>
                      <p className={`text-sm font-semibold ${isOverdue ? "text-error" : "text-gray-900"}`}>
                        {format(new Date(crop.expectedHarvestDate), "MMM dd")}
                      </p>
                    </div>
                  </div>

                  {crop.status !== "Harvested" && (
                    <div className="text-center p-3 bg-gradient-to-br from-accent/5 to-accent/10 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Days to Harvest</p>
                      <p className={`text-xl font-bold ${isOverdue ? "text-error" : "text-accent"}`}>
                        {isOverdue ? `${Math.abs(daysToHarvest)} overdue` : daysToHarvest}
                      </p>
                    </div>
                  )}

                  {crop.notes && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">{crop.notes}</p>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(crop)}
                      className="flex-1"
                      icon="Edit2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(crop.Id)}
                      className="flex-1 text-error hover:bg-error/10 hover:text-error"
                      icon="Trash2"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={handleClose}
        title={editingCrop ? "Edit Crop" : "Add New Crop"}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Farm"
              name="farmId"
              type="select"
              value={formData.farmId}
              onChange={handleInputChange}
              options={farms.map(farm => ({ value: farm.Id.toString(), label: farm.name }))}
              placeholder="Select farm"
              required
            />

            <FormField
              label="Crop Type"
              name="cropType"
              type="select"
              value={formData.cropType}
              onChange={handleInputChange}
              options={cropTypes}
              placeholder="Select crop type"
              required
            />
          </div>

          <FormField
            label="Field Location"
            name="fieldLocation"
            value={formData.fieldLocation}
            onChange={handleInputChange}
            placeholder="e.g., North Field, Greenhouse A"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Planting Date"
              name="plantingDate"
              type="date"
              value={formData.plantingDate}
              onChange={handleInputChange}
              required
            />

            <FormField
              label="Expected Harvest Date"
              name="expectedHarvestDate"
              type="date"
              value={formData.expectedHarvestDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <FormField
            label="Status"
            name="status"
            type="select"
            value={formData.status}
            onChange={handleInputChange}
            options={statusOptions}
            required
          />

          <FormField
            label="Notes"
            name="notes"
            type="textarea"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Optional notes about this crop"
          />

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : (editingCrop ? "Update Crop" : "Create Crop")}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Crops;