import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];

const taskService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...tasks];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return tasks.find(task => task.Id === parseInt(id));
  },

  async getByFarmId(farmId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return tasks.filter(task => task.farmId === farmId.toString());
  },

  async getUpcoming() {
    await new Promise(resolve => setTimeout(resolve, 250));
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return !task.completed && dueDate >= now && dueDate <= nextWeek;
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  },

  async create(taskData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newTask = {
      Id: Math.max(...tasks.map(t => t.Id)) + 1,
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, taskData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...taskData };
      return { ...tasks[index] };
    }
    throw new Error("Task not found");
  },

  async toggleComplete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index !== -1) {
      tasks[index].completed = !tasks[index].completed;
      return { ...tasks[index] };
    }
    throw new Error("Task not found");
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index !== -1) {
      const deleted = tasks.splice(index, 1)[0];
      return { ...deleted };
    }
    throw new Error("Task not found");
  }
};

export default taskService;