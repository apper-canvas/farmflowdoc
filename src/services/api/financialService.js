import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const financialService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords('financialEntries_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "farmId_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Map database fields to UI field names
      return (response.data || []).map(entry => ({
        Id: entry.Id,
        type: entry.type_c,
        amount: entry.amount_c,
        category: entry.category_c,
        description: entry.description_c,
        date: entry.date_c,
        farmId: entry.farmId_c?.Id?.toString() || entry.farmId_c
      }));
    } catch (error) {
      console.error("Error fetching financial entries:", error?.response?.data?.message || error);
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

      const response = await apperClient.getRecordById('financialEntries_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "farmId_c"}}
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
      const entry = response.data;
      return {
        Id: entry.Id,
        type: entry.type_c,
        amount: entry.amount_c,
        category: entry.category_c,
        description: entry.description_c,
        date: entry.date_c,
        farmId: entry.farmId_c?.Id?.toString() || entry.farmId_c
      };
    } catch (error) {
      console.error(`Error fetching financial entry ${id}:`, error?.response?.data?.message || error);
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

      const response = await apperClient.fetchRecords('financialEntries_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "farmId_c"}}
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
      return (response.data || []).map(entry => ({
        Id: entry.Id,
        type: entry.type_c,
        amount: entry.amount_c,
        category: entry.category_c,
        description: entry.description_c,
        date: entry.date_c,
        farmId: entry.farmId_c?.Id?.toString() || entry.farmId_c
      }));
    } catch (error) {
      console.error("Error fetching financial entries by farm:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getSummary() {
    try {
      const entries = await this.getAll();
      const summary = entries.reduce((acc, entry) => {
        if (entry.type === "income") {
          acc.totalIncome += entry.amount;
        } else {
          acc.totalExpenses += entry.amount;
        }
        return acc;
      }, { totalIncome: 0, totalExpenses: 0 });

      summary.netBalance = summary.totalIncome - summary.totalExpenses;
      return summary;
    } catch (error) {
      console.error("Error calculating financial summary:", error?.response?.data?.message || error);
      return { totalIncome: 0, totalExpenses: 0, netBalance: 0 };
    }
  },

  async create(entryData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      // Map UI field names to database fields
      const params = {
        records: [{
          Name: entryData.description,
          type_c: entryData.type,
          amount_c: parseFloat(entryData.amount),
          category_c: entryData.category,
          description_c: entryData.description,
          date_c: entryData.date,
          farmId_c: parseInt(entryData.farmId)
        }]
      };

      const response = await apperClient.createRecord('financialEntries_c', params);

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
          const createdEntry = successful[0].data;
          return {
            Id: createdEntry.Id,
            type: createdEntry.type_c,
            amount: createdEntry.amount_c,
            category: createdEntry.category_c,
            description: createdEntry.description_c,
            date: createdEntry.date_c,
            farmId: createdEntry.farmId_c?.Id?.toString() || createdEntry.farmId_c
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating financial entry:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, entryData) {
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
          Name: entryData.description,
          type_c: entryData.type,
          amount_c: parseFloat(entryData.amount),
          category_c: entryData.category,
          description_c: entryData.description,
          date_c: entryData.date,
          farmId_c: parseInt(entryData.farmId)
        }]
      };

      const response = await apperClient.updateRecord('financialEntries_c', params);

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
          const updatedEntry = successful[0].data;
          return {
            Id: updatedEntry.Id,
            type: updatedEntry.type_c,
            amount: updatedEntry.amount_c,
            category: updatedEntry.category_c,
            description: updatedEntry.description_c,
            date: updatedEntry.date_c,
            farmId: updatedEntry.farmId_c?.Id?.toString() || updatedEntry.farmId_c
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating financial entry:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('financialEntries_c', params);

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
      console.error("Error deleting financial entry:", error?.response?.data?.message || error);
      return false;
    }
  }
};

export default financialService;