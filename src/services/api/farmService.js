import farmsData from "@/services/mockData/farms.json";

let farms = [...farmsData];

const farmService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...farms];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return farms.find(farm => farm.Id === parseInt(id));
  },

  async create(farmData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newFarm = {
      Id: Math.max(...farms.map(f => f.Id)) + 1,
      ...farmData,
      createdAt: new Date().toISOString()
    };
    farms.push(newFarm);
    return { ...newFarm };
  },

  async update(id, farmData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = farms.findIndex(farm => farm.Id === parseInt(id));
    if (index !== -1) {
      farms[index] = { ...farms[index], ...farmData };
      return { ...farms[index] };
    }
    throw new Error("Farm not found");
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = farms.findIndex(farm => farm.Id === parseInt(id));
    if (index !== -1) {
      const deleted = farms.splice(index, 1)[0];
      return { ...deleted };
    }
    throw new Error("Farm not found");
  }
};

export default farmService;