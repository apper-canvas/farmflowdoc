import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import taskService from "@/services/api/taskService";
import { format } from "date-fns";
import { toast } from "react-toastify";

const UpcomingTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      setError("");
      setLoading(true);
      const upcomingTasks = await taskService.getUpcoming();
      setTasks(upcomingTasks.slice(0, 5)); // Show only first 5
    } catch (err) {
      setError("Failed to load upcoming tasks");
      console.error("Tasks loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      await taskService.toggleComplete(taskId);
      toast.success("Task updated successfully!");
      await loadTasks(); // Reload to update the list
    } catch (err) {
      toast.error("Failed to update task");
      console.error("Task toggle error:", err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="h-20 bg-surface rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadTasks} />;
  }

  if (tasks.length === 0) {
    return (
      <Empty
        title="No upcoming tasks"
        description="All caught up! No tasks due in the next 7 days."
        icon="CheckCircle"
      />
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "text-error";
      case "medium": return "text-warning";
      case "low": return "text-success";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;
        
        return (
          <div
            key={task.Id}
            className="bg-surface rounded-lg p-4 border-l-4 border-primary hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <button
                  onClick={() => handleToggleComplete(task.Id)}
                  className="flex-shrink-0 mt-1"
                >
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-primary flex items-center justify-center transition-colors duration-200">
                    {task.completed && (
                      <ApperIcon name="Check" size={12} className="text-primary" />
                    )}
                  </div>
                </button>

                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                      {task.title}
                    </h4>
                    <Badge variant={task.priority} className="text-xs">
                      {task.priority}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {task.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <ApperIcon name="Calendar" size={12} className="mr-1" />
                      <span className={isOverdue ? "text-error font-medium" : ""}>
                        {format(new Date(task.dueDate), "MMM dd, h:mm a")}
                      </span>
                    </div>
                    
                    {task.recurring && (
                      <div className="flex items-center">
                        <ApperIcon name="Repeat" size={12} className="mr-1" />
                        <span>Recurring</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <ApperIcon 
                name="AlertCircle" 
                size={16} 
                className={getPriorityColor(task.priority)} 
              />
            </div>
          </div>
        );
      })}
      
      <div className="pt-2">
        <button className="w-full text-center text-sm text-primary font-medium hover:text-primary/80 transition-colors duration-200">
          View all tasks →
        </button>
      </div>
    </div>
  );
};

export default UpcomingTasks;