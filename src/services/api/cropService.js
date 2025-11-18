import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const cropService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords('crops_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "farmId_c"}},
          {"field": {"Name": "cropType_c"}},
          {"field": {"Name": "fieldLocation_c"}},
          {"field": {"Name": "plantingDate_c"}},
          {"field": {"Name": "expectedHarvestDate_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Map database fields to UI field names
      return (response.data || []).map(crop => ({
        Id: crop.Id,
        farmId: crop.farmId_c?.Id?.toString() || crop.farmId_c,
        cropType: crop.cropType_c,
        fieldLocation: crop.fieldLocation_c,
        plantingDate: crop.plantingDate_c,
        expectedHarvestDate: crop.expectedHarvestDate_c,
        status: crop.status_c,
        notes: crop.notes_c
      }));
    } catch (error) {
      console.error("Error fetching crops:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const response = await apperClient.getRecordById('crops_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "farmId_c"}},
          {"field": {"Name": "cropType_c"}},
          {"field": {"Name": "fieldLocation_c"}},
          {"field": {"Name": "plantingDate_c"}},
          {"field": {"Name": "expectedHarvestDate_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

      // Map database fields to UI field names
      const crop = response.data;
      return {
        Id: crop.Id,
        farmId: crop.farmId_c?.Id?.toString() || crop.farmId_c,
        cropType: crop.cropType_c,
        fieldLocation: crop.fieldLocation_c,
        plantingDate: crop.plantingDate_c,
        expectedHarvestDate: crop.expectedHarvestDate_c,
        status: crop.status_c,
        notes: crop.notes_c
      };
    } catch (error) {
      console.error(`Error fetching crop ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async getByFarmId(farmId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords('crops_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "farmId_c"}},
          {"field": {"Name": "cropType_c"}},
          {"field": {"Name": "fieldLocation_c"}},
          {"field": {"Name": "plantingDate_c"}},
          {"field": {"Name": "expectedHarvestDate_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{
          "FieldName": "farmId_c",
          "Operator": "EqualTo",
          "Values": [parseInt(farmId)]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Map database fields to UI field names
      return (response.data || []).map(crop => ({
        Id: crop.Id,
        farmId: crop.farmId_c?.Id?.toString() || crop.farmId_c,
        cropType: crop.cropType_c,
        fieldLocation: crop.fieldLocation_c,
        plantingDate: crop.plantingDate_c,
        expectedHarvestDate: crop.expectedHarvestDate_c,
        status: crop.status_c,
        notes: crop.notes_c
      }));
    } catch (error) {
      console.error("Error fetching crops by farm:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(cropData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      // Map UI field names to database fields
      const params = {
        records: [{
          Name: cropData.cropType,
          farmId_c: parseInt(cropData.farmId),
          cropType_c: cropData.cropType,
          fieldLocation_c: cropData.fieldLocation,
          plantingDate_c: cropData.plantingDate,
          expectedHarvestDate_c: cropData.expectedHarvestDate,
          status_c: cropData.status,
          notes_c: cropData.notes
        }]
      };

      const response = await apperClient.createRecord('crops_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdCrop = successful[0].data;
          return {
            Id: createdCrop.Id,
            farmId: createdCrop.farmId_c?.Id?.toString() || createdCrop.farmId_c,
            cropType: createdCrop.cropType_c,
            fieldLocation: createdCrop.fieldLocation_c,
            plantingDate: createdCrop.plantingDate_c,
            expectedHarvestDate: createdCrop.expectedHarvestDate_c,
            status: createdCrop.status_c,
            notes: createdCrop.notes_c
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating crop:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, cropData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      // Map UI field names to database fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: cropData.cropType,
          farmId_c: parseInt(cropData.farmId),
          cropType_c: cropData.cropType,
          fieldLocation_c: cropData.fieldLocation,
          plantingDate_c: cropData.plantingDate,
          expectedHarvestDate_c: cropData.expectedHarvestDate,
          status_c: cropData.status,
          notes_c: cropData.notes
        }]
      };

      const response = await apperClient.updateRecord('crops_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedCrop = successful[0].data;
          return {
            Id: updatedCrop.Id,
            farmId: updatedCrop.farmId_c?.Id?.toString() || updatedCrop.farmId_c,
            cropType: updatedCrop.cropType_c,
            fieldLocation: updatedCrop.fieldLocation_c,
            plantingDate: updatedCrop.plantingDate_c,
            expectedHarvestDate: updatedCrop.expectedHarvestDate_c,
            status: updatedCrop.status_c,
            notes: updatedCrop.notes_c
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating crop:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return false;
      }

      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('crops_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting crop:", error?.response?.data?.message || error);
      return false;
    }
  }
};

export default cropService;
export default cropService;