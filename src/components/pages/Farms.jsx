import React, { useState } from "react";
import FarmList from "@/components/organisms/FarmList";
import Modal from "@/components/organisms/Modal";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import farmService from "@/services/api/farmService";
import { toast } from "react-toastify";

const Farms = () => {
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingFarm, setEditingFarm] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    size: "",
    sizeUnit: "acres"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sizeUnitOptions = [
    { value: "acres", label: "Acres" },
    { value: "hectares", label: "Hectares" },
    { value: "square feet", label: "Square Feet" },
    { value: "square meters", label: "Square Meters" }
  ];

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      size: "",
      sizeUnit: "acres"
    });
    setEditingFarm(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (farm) => {
    setFormData({
      name: farm.name,
      location: farm.location,
      size: farm.size.toString(),
      sizeUnit: farm.sizeUnit
    });
    setEditingFarm(farm);
    setShowModal(true);
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
    
    if (!formData.name.trim() || !formData.location.trim() || !formData.size) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const farmData = {
        ...formData,
        size: parseFloat(formData.size)
      };

      if (editingFarm) {
        await farmService.update(editingFarm.Id, farmData);
        toast.success("Farm updated successfully!");
      } else {
        await farmService.create(farmData);
        toast.success("Farm created successfully!");
      }
handleClose();
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      toast.error("Failed to save farm");
      console.error("Farm save error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
<FarmList onEdit={handleEdit} onAdd={handleAdd} refreshKey={refreshKey} />

      <Modal
        isOpen={showModal}
        onClose={handleClose}
        title={editingFarm ? "Edit Farm" : "Add New Farm"}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            label="Farm Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter farm name"
            required
          />

          <FormField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Enter farm location"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Size"
              name="size"
              type="number"
              value={formData.size}
              onChange={handleInputChange}
              placeholder="0"
              required
            />

            <FormField
              label="Unit"
              name="sizeUnit"
              type="select"
              value={formData.sizeUnit}
              onChange={handleInputChange}
              options={sizeUnitOptions}
              required
            />
          </div>

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
              {isSubmitting ? "Saving..." : (editingFarm ? "Update Farm" : "Create Farm")}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Farms;