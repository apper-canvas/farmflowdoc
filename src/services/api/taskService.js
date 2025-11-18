import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const taskService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords('tasks_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "recurring_c"}},
          {"field": {"Name": "farmId_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Map database fields to UI field names
      return (response.data || []).map(task => ({
        Id: task.Id,
        title: task.title_c,
        description: task.description_c,
        dueDate: task.dueDate_c,
        priority: task.priority_c,
        completed: task.completed_c,
        recurring: task.recurring_c,
        farmId: task.farmId_c?.Id?.toString() || task.farmId_c
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
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

      const response = await apperClient.getRecordById('tasks_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "recurring_c"}},
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
      const task = response.data;
      return {
        Id: task.Id,
        title: task.title_c,
        description: task.description_c,
        dueDate: task.dueDate_c,
        priority: task.priority_c,
        completed: task.completed_c,
        recurring: task.recurring_c,
        farmId: task.farmId_c?.Id?.toString() || task.farmId_c
      };
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
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

      const response = await apperClient.fetchRecords('tasks_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "recurring_c"}},
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
      return (response.data || []).map(task => ({
        Id: task.Id,
        title: task.title_c,
        description: task.description_c,
        dueDate: task.dueDate_c,
        priority: task.priority_c,
        completed: task.completed_c,
        recurring: task.recurring_c,
        farmId: task.farmId_c?.Id?.toString() || task.farmId_c
      }));
    } catch (error) {
      console.error("Error fetching tasks by farm:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getUpcoming() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const response = await apperClient.fetchRecords('tasks_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "recurring_c"}},
          {"field": {"Name": "farmId_c"}}
        ],
        where: [
          {
            "FieldName": "completed_c",
            "Operator": "EqualTo",
            "Values": [false]
          },
          {
            "FieldName": "dueDate_c",
            "Operator": "LessThanOrEqualTo",
            "Values": [nextWeek.toISOString()]
          },
          {
            "FieldName": "dueDate_c",
            "Operator": "GreaterThanOrEqualTo",
            "Values": [now.toISOString()]
          }
        ],
        orderBy: [{"fieldName": "dueDate_c", "sorttype": "ASC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Map database fields to UI field names
      return (response.data || []).map(task => ({
        Id: task.Id,
        title: task.title_c,
        description: task.description_c,
        dueDate: task.dueDate_c,
        priority: task.priority_c,
        completed: task.completed_c,
        recurring: task.recurring_c,
        farmId: task.farmId_c?.Id?.toString() || task.farmId_c
      }));
    } catch (error) {
      console.error("Error fetching upcoming tasks:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      // Map UI field names to database fields
      const params = {
        records: [{
          Name: taskData.title,
          title_c: taskData.title,
          description_c: taskData.description,
          dueDate_c: taskData.dueDate,
          priority_c: taskData.priority,
          completed_c: false,
          recurring_c: taskData.recurring,
          farmId_c: parseInt(taskData.farmId)
        }]
      };

      const response = await apperClient.createRecord('tasks_c', params);

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
          const createdTask = successful[0].data;
          return {
            Id: createdTask.Id,
            title: createdTask.title_c,
            description: createdTask.description_c,
            dueDate: createdTask.dueDate_c,
            priority: createdTask.priority_c,
            completed: createdTask.completed_c,
            recurring: createdTask.recurring_c,
            farmId: createdTask.farmId_c?.Id?.toString() || createdTask.farmId_c
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, taskData) {
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
          Name: taskData.title,
          title_c: taskData.title,
          description_c: taskData.description,
          dueDate_c: taskData.dueDate,
          priority_c: taskData.priority,
          completed_c: taskData.completed,
          recurring_c: taskData.recurring,
          farmId_c: parseInt(taskData.farmId)
        }]
      };

      const response = await apperClient.updateRecord('tasks_c', params);

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
          const updatedTask = successful[0].data;
          return {
            Id: updatedTask.Id,
            title: updatedTask.title_c,
            description: updatedTask.description_c,
            dueDate: updatedTask.dueDate_c,
            priority: updatedTask.priority_c,
            completed: updatedTask.completed_c,
            recurring: updatedTask.recurring_c,
            farmId: updatedTask.farmId_c?.Id?.toString() || updatedTask.farmId_c
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
      return null;
    }
  },

  async toggleComplete(id) {
    try {
      // First get the current task
      const currentTask = await this.getById(id);
      if (!currentTask) {
        throw new Error("Task not found");
      }

      // Toggle the completed status
      const updatedTask = await this.update(id, {
        ...currentTask,
        completed: !currentTask.completed
      });

      return updatedTask;
    } catch (error) {
      console.error("Error toggling task completion:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('tasks_c', params);

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
      console.error("Error deleting task:", error?.response?.data?.message || error);
      return false;
    }
  }
};

export default taskService;