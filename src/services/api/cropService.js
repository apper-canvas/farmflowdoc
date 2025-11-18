import cropsData from "@/services/mockData/crops.json";

let crops = [...cropsData];

const cropService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...crops];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return crops.find(crop => crop.Id === parseInt(id));
  },

  async getByFarmId(farmId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return crops.filter(crop => crop.farmId === farmId.toString());
  },

  async create(cropData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newCrop = {
      Id: Math.max(...crops.map(c => c.Id)) + 1,
      ...cropData
    };
    crops.push(newCrop);
    return { ...newCrop };
  },

  async update(id, cropData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = crops.findIndex(crop => crop.Id === parseInt(id));
    if (index !== -1) {
      crops[index] = { ...crops[index], ...cropData };
      return { ...crops[index] };
    }
    throw new Error("Crop not found");
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = crops.findIndex(crop => crop.Id === parseInt(id));
    if (index !== -1) {
      const deleted = crops.splice(index, 1)[0];
      return { ...deleted };
    }
    throw new Error("Crop not found");
  }
};

export default cropService;