import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const farmService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords('farms_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "sizeUnit_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Map database fields to UI field names
      return (response.data || []).map(farm => ({
        Id: farm.Id,
        name: farm.Name,
        location: farm.location_c,
        size: farm.size_c,
        sizeUnit: farm.sizeUnit_c
      }));
    } catch (error) {
      console.error("Error fetching farms:", error?.response?.data?.message || error);
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

      const response = await apperClient.getRecordById('farms_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "sizeUnit_c"}}
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
      const farm = response.data;
      return {
        Id: farm.Id,
        name: farm.Name,
        location: farm.location_c,
        size: farm.size_c,
        sizeUnit: farm.sizeUnit_c
      };
    } catch (error) {
      console.error(`Error fetching farm ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(farmData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      // Map UI field names to database fields
      const params = {
        records: [{
          Name: farmData.name,
          location_c: farmData.location,
          size_c: parseFloat(farmData.size),
          sizeUnit_c: farmData.sizeUnit
        }]
      };

      const response = await apperClient.createRecord('farms_c', params);

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
          const createdFarm = successful[0].data;
          return {
            Id: createdFarm.Id,
            name: createdFarm.Name,
            location: createdFarm.location_c,
            size: createdFarm.size_c,
            sizeUnit: createdFarm.sizeUnit_c
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating farm:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, farmData) {
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
          Name: farmData.name,
          location_c: farmData.location,
          size_c: parseFloat(farmData.size),
          sizeUnit_c: farmData.sizeUnit
        }]
      };

      const response = await apperClient.updateRecord('farms_c', params);

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
          const updatedFarm = successful[0].data;
          return {
            Id: updatedFarm.Id,
            name: updatedFarm.Name,
            location: updatedFarm.location_c,
            size: updatedFarm.size_c,
            sizeUnit: updatedFarm.sizeUnit_c
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating farm:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('farms_c', params);

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
      console.error("Error deleting farm:", error?.response?.data?.message || error);
      return false;
    }
  }
};

export default farmService;