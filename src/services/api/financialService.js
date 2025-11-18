import financialData from "@/services/mockData/financialEntries.json";

let financialEntries = [...financialData];

const financialService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...financialEntries];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return financialEntries.find(entry => entry.Id === parseInt(id));
  },

  async getByFarmId(farmId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return financialEntries.filter(entry => entry.farmId === farmId.toString());
  },

  async getSummary() {
    await new Promise(resolve => setTimeout(resolve, 300));
    const summary = financialEntries.reduce((acc, entry) => {
      if (entry.type === "income") {
        acc.totalIncome += entry.amount;
      } else {
        acc.totalExpenses += entry.amount;
      }
      return acc;
    }, { totalIncome: 0, totalExpenses: 0 });

    summary.netBalance = summary.totalIncome - summary.totalExpenses;
    return summary;
  },

  async create(entryData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newEntry = {
      Id: Math.max(...financialEntries.map(e => e.Id)) + 1,
      ...entryData,
      createdAt: new Date().toISOString()
    };
    financialEntries.push(newEntry);
    return { ...newEntry };
  },

  async update(id, entryData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = financialEntries.findIndex(entry => entry.Id === parseInt(id));
    if (index !== -1) {
      financialEntries[index] = { ...financialEntries[index], ...entryData };
      return { ...financialEntries[index] };
    }
    throw new Error("Financial entry not found");
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = financialEntries.findIndex(entry => entry.Id === parseInt(id));
    if (index !== -1) {
      const deleted = financialEntries.splice(index, 1)[0];
      return { ...deleted };
    }
    throw new Error("Financial entry not found");
  }
};

export default financialService;