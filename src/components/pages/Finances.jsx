import React, { useEffect, useState } from "react";
import { endOfMonth, endOfQuarter, endOfYear, format, isWithinInterval, startOfMonth, startOfQuarter, startOfYear } from "date-fns";
import { toast } from "react-toastify";
import Chart from "react-apexcharts";
import financialService from "@/services/api/financialService";
import farmService from "@/services/api/farmService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Modal from "@/components/organisms/Modal";
import FormField from "@/components/molecules/FormField";
import StatCard from "@/components/molecules/StatCard";
import SearchBar from "@/components/molecules/SearchBar";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";

const Finances = () => {
  const [entries, setEntries] = useState([]);
  const [farms, setFarms] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, netBalance: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
const [categoryFilter, setCategoryFilter] = useState("all");
  const [chartPeriod, setChartPeriod] = useState("monthly");
  const [formData, setFormData] = useState({
    farmId: "",
    type: "expense",
    amount: "",
    category: "",
    description: "",
    date: ""
  });

  const expenseCategories = [
    "Seeds", "Fertilizer", "Pesticides", "Equipment", "Labor", "Fuel", "Maintenance", "Insurance", "Other"
  ];

  const incomeCategories = [
    "Crop Sales", "Livestock Sales", "Government Subsidies", "Consulting", "Equipment Rental", "Other"
  ];

  const typeFilterOptions = [
    { value: "all", label: "All Entries" },
    { value: "income", label: "Income Only" },
    { value: "expense", label: "Expenses Only" }
  ];

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [entriesData, farmsData, summaryData] = await Promise.all([
        financialService.getAll(),
        farmService.getAll(),
        financialService.getSummary()
      ]);

      // Sort entries by date (newest first)
      const sortedEntries = entriesData.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setEntries(sortedEntries);
      setFarms(farmsData);
      setSummary(summaryData);
    } catch (err) {
      setError("Failed to load financial data");
      console.error("Finances loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories for filter
  const getAllCategories = () => {
    const categories = [...new Set(entries.map(entry => entry.category))];
    return [
      { value: "all", label: "All Categories" },
      ...categories.map(cat => ({ value: cat, label: cat }))
    ];
  };

  // Filter entries based on search and filters
  useEffect(() => {
    let filtered = entries;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(entry => entry.type === typeFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(entry => entry.category === categoryFilter);
    }

    setFilteredEntries(filtered);
  }, [entries, searchTerm, typeFilter, categoryFilter]);

  const resetForm = () => {
    const today = new Date().toISOString().slice(0, 10);
    
    setFormData({
      farmId: "",
      type: "expense",
      amount: "",
      category: "",
      description: "",
      date: today
    });
    setEditingEntry(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (entry) => {
    setFormData({
      farmId: entry.farmId,
      type: entry.type,
      amount: entry.amount.toString(),
      category: entry.category,
      description: entry.description,
      date: format(new Date(entry.date), "yyyy-MM-dd")
    });
    setEditingEntry(entry);
    setShowModal(true);
  };

  const handleDelete = async (entryId) => {
    if (!window.confirm("Are you sure you want to delete this financial entry?")) {
      return;
    }

    try {
      await financialService.delete(entryId);
      toast.success("Financial entry deleted successfully!");
      await loadData();
    } catch (err) {
      toast.error("Failed to delete financial entry");
      console.error("Financial entry deletion error:", err);
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
    
    if (!formData.farmId || !formData.amount || !formData.category || 
        !formData.description || !formData.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const entryData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString()
      };

      if (editingEntry) {
        await financialService.update(editingEntry.Id, entryData);
        toast.success("Financial entry updated successfully!");
      } else {
        await financialService.create(entryData);
        toast.success("Financial entry created successfully!");
      }

      handleClose();
      await loadData();
    } catch (error) {
      toast.error("Failed to save financial entry");
      console.error("Financial entry save error:", error);
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id.toString() === farmId);
    return farm ? farm.name : "Unknown Farm";
  };

// Data processing for trends chart
  function getTrendsChartData() {
    const aggregatedData = aggregateDataByPeriod(filteredEntries, chartPeriod);
    
    return [
      {
        name: 'Income',
        data: aggregatedData.map(item => item.income),
        color: '#4CAF50'
      },
      {
        name: 'Expenses',
        data: aggregatedData.map(item => Math.abs(item.expenses)),
        color: '#D32F2F'
      }
    ];
  }

  // Chart options for trends
  function getTrendsChartOptions() {
    const aggregatedData = aggregateDataByPeriod(filteredEntries, chartPeriod);
    
    return {
      chart: {
        type: 'bar',
        toolbar: {
          show: false
        },
        background: 'transparent'
      },
      colors: ['#4CAF50', '#D32F2F'],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '60%',
          borderRadius: 4
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: aggregatedData.map(item => item.label),
        labels: {
          style: {
            colors: '#666',
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Amount ($)',
          style: {
            color: '#666',
            fontSize: '12px'
          }
        },
        labels: {
          style: {
            colors: '#666',
            fontSize: '12px'
          },
          formatter: function (val) {
            return '$' + Math.round(val).toLocaleString();
          }
        }
      },
      fill: {
        opacity: 0.8
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return '$' + val.toLocaleString();
          }
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        labels: {
          colors: '#666'
        }
      },
      grid: {
        borderColor: '#f1f1f1',
        strokeDashArray: 4
      }
    };
  }

  // Data processing for category chart
  function getCategoryChartData() {
    const expensesByCategory = {};
    
    filteredEntries
      .filter(entry => entry.type === 'expense')
      .forEach(entry => {
        const category = entry.category;
        expensesByCategory[category] = (expensesByCategory[category] || 0) + Math.abs(entry.amount);
      });

    return Object.values(expensesByCategory);
  }

  // Chart options for category pie chart
  function getCategoryChartOptions() {
    const expensesByCategory = {};
    
    filteredEntries
      .filter(entry => entry.type === 'expense')
      .forEach(entry => {
        const category = entry.category;
        expensesByCategory[category] = (expensesByCategory[category] || 0) + Math.abs(entry.amount);
      });

    return {
      chart: {
        type: 'pie',
        background: 'transparent'
      },
      colors: ['#2D5016', '#7CB342', '#FF8A00', '#1976D2', '#FFC107', '#D32F2F', '#9C27B0'],
      labels: Object.keys(expensesByCategory),
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        labels: {
          colors: '#666'
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '45%'
          }
        }
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return '$' + val.toLocaleString();
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          return Math.round(val) + '%';
        },
        style: {
          fontSize: '12px',
          colors: ['#fff']
        }
      }
    };
  }

  // Aggregate data by time period
  function aggregateDataByPeriod(data, period) {
    const aggregated = {};
    const now = new Date();
    
    data.forEach(entry => {
      const entryDate = new Date(entry.date);
      let key;
      
      if (period === 'monthly') {
        key = format(entryDate, 'MMM yyyy');
      } else if (period === 'quarterly') {
        const quarter = Math.floor(entryDate.getMonth() / 3) + 1;
        key = `Q${quarter} ${entryDate.getFullYear()}`;
      } else {
        key = entryDate.getFullYear().toString();
      }
      
      if (!aggregated[key]) {
        aggregated[key] = { income: 0, expenses: 0, label: key };
      }
      
      if (entry.type === 'income') {
        aggregated[key].income += entry.amount;
      } else {
        aggregated[key].expenses += Math.abs(entry.amount);
      }
    });
    
    // Sort by chronological order and return last 12 periods for monthly, 8 for quarterly, 5 for yearly
    const sortedData = Object.values(aggregated).sort((a, b) => {
      if (period === 'monthly') {
        return new Date(a.label + ' 01') - new Date(b.label + ' 01');
      } else if (period === 'quarterly') {
        const [qA, yearA] = a.label.split(' ');
        const [qB, yearB] = b.label.split(' ');
        return parseInt(yearA) - parseInt(yearB) || parseInt(qA.slice(1)) - parseInt(qB.slice(1));
      } else {
        return parseInt(a.label) - parseInt(b.label);
      }
    });
    
    const maxPeriods = period === 'monthly' ? 12 : period === 'quarterly' ? 8 : 5;
    return sortedData.slice(-maxPeriods);
  }

  function renderModal() {
    return (
      <>
        <Modal
          isOpen={showModal}
          onClose={handleClose}
          title={editingEntry ? "Edit Financial Entry" : "Add New Financial Entry"}
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
                label="Type"
                name="type"
                type="select"
                value={formData.type}
                onChange={handleInputChange}
                options={[
                  { value: "income", label: "Income" },
                  { value: "expense", label: "Expense" }
                ]}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Amount"
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                required
              />

              <FormField
                label="Category"
                name="category"
                type="select"
                value={formData.category}
                onChange={handleInputChange}
                options={(formData.type === "income" ? incomeCategories : expenseCategories)
                  .map(cat => ({ value: cat, label: cat }))}
                placeholder="Select category"
                required
              />
            </div>

            <FormField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="e.g., Corn seed purchase, Wheat harvest sale"
              required
            />

            <FormField
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              required
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
                {isSubmitting ? "Saving..." : (editingEntry ? "Update Entry" : "Create Entry")}
              </Button>
            </div>
          </form>
        </Modal>
      </>
    );
  }

  // Entries List Section
  const renderEntriesList = () => {
    if (filteredEntries.length === 0) {
      return (
        <Empty
          title="No financial entries found"
          description={entries.length === 0 ? 
            "Start by adding your first financial entry to track your farm's income and expenses." : 
            "No entries match your current filters. Try adjusting your search or filter criteria."
          }
          actionLabel="Add Entry"
          onAction={handleAdd}
          icon="DollarSign"
        />
      );
    }

    return (
      <div className="space-y-4">
        {filteredEntries.map((entry) => (
          <div key={entry.Id} className="card hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  entry.type === "income" 
                    ? "bg-gradient-to-br from-success/10 to-success/20" 
                    : "bg-gradient-to-br from-error/10 to-error/20"
                }`}>
                  <ApperIcon 
                    name={entry.type === "income" ? "TrendingUp" : "TrendingDown"} 
                    size={24} 
                    className={entry.type === "income" ? "text-success" : "text-error"} 
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-900">{entry.description}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{getFarmName(entry.farmId)}</span>
                    <Badge variant={entry.type === "income" ? "success" : "error"}>
                      {entry.category}
                    </Badge>
                    <span>{format(new Date(entry.date), "MMM dd, yyyy")}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className={`text-2xl font-bold ${
                    entry.type === "income" ? "text-success" : "text-error"
                  }`}>
                    {entry.type === "income" ? "+" : "-"}{formatCurrency(entry.amount)}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors duration-200"
                  >
                    <ApperIcon name="Edit2" size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.Id)}
                    className="p-2 text-gray-400 hover:text-error rounded-lg hover:bg-error/5 transition-colors duration-200"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
        <Button onClick={handleAdd} icon="Plus">
          Add Entry
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Income"
          value={formatCurrency(summary.totalIncome)}
          icon="TrendingUp"
          valueColor="text-success"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(summary.totalExpenses)}
          icon="TrendingDown"
          valueColor="text-error"
        />
        <StatCard
          title="Net Balance"
          value={formatCurrency(summary.netBalance)}
          icon="DollarSign"
          valueColor={summary.netBalance >= 0 ? "text-success" : "text-error"}
          trend={summary.netBalance >= 0 ? "up" : "down"}
          trendValue={summary.netBalance >= 0 ? "Profit" : "Loss"}
        />
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <ApperIcon name="BarChart3" size={24} className="mr-3 text-primary" />
            Financial Trends
          </h2>
          
          {/* Period Selection */}
          <div className="flex bg-surface rounded-lg p-1 shadow-sm">
            {["monthly", "quarterly", "yearly"].map((period) => (
              <button
                key={period}
                onClick={() => setChartPeriod(period)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  chartPeriod === period
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trends Chart */}
          <div className="card">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Income vs Expenses Trends</h3>
              <p className="text-sm text-gray-600">Track your financial performance over time</p>
            </div>
            
            <div className="h-80">
              <Chart
                options={getTrendsChartOptions()}
                series={getTrendsChartData()}
                type="bar"
                height="100%"
              />
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="card">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Expense Categories</h3>
              <p className="text-sm text-gray-600">Breakdown of expenses by category</p>
            </div>
            
            <div className="h-80">
              <Chart
                options={getCategoryChartOptions()}
                series={getCategoryChartData()}
                type="pie"
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="space-y-4">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search entries..."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Type"
              name="typeFilter"
              type="select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={typeFilterOptions}
            />
            
            <FormField
              label="Category"
              name="categoryFilter"
              type="select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={getAllCategories()}
            />
          </div>
        </div>
      </div>

      {/* Entries List */}
      {renderEntriesList()}

      {/* Modal */}
      {renderModal()}
    </div>
  );

};

export default Finances;