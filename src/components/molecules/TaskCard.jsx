import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { format } from "date-fns";
import { cn } from "@/utils/cn";

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const getPriorityIcon = () => {
    switch (task.priority) {
      case "high": return "AlertCircle";
      case "medium": return "Clock";
      case "low": return "Circle";
      default: return "Circle";
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div className={cn(
      "card hover:shadow-lg transition-all duration-200",
      `priority-${task.priority}`,
      task.completed && "opacity-75",
      isOverdue && "bg-error/5"
    )}>
      <div className="flex items-start space-x-4">
        <button
          onClick={() => onToggleComplete(task.Id)}
          className="flex-shrink-0 mt-1"
        >
          <div className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
            task.completed 
              ? "bg-success border-success text-white" 
              : "border-gray-300 hover:border-primary"
          )}>
            {task.completed && <ApperIcon name="Check" size={16} />}
          </div>
        </button>

        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className={cn(
                "font-semibold text-gray-900 leading-tight",
                task.completed && "line-through text-gray-500"
              )}>
                {task.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {task.description}
              </p>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <Badge variant={task.priority}>
                <ApperIcon name={getPriorityIcon()} size={12} className="mr-1" />
                {task.priority}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <ApperIcon name="Calendar" size={16} className="mr-2" />
                <span className={cn(isOverdue && "text-error font-medium")}>
                  {format(new Date(task.dueDate), "MMM dd, yyyy 'at' h:mm a")}
                </span>
              </div>
              
              {task.recurring && (
                <div className="flex items-center">
                  <ApperIcon name="Repeat" size={16} className="mr-1" />
                  <span>Recurring</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(task)}
                className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors duration-200"
              >
                <ApperIcon name="Edit2" size={16} />
              </button>
              <button
                onClick={() => onDelete(task.Id)}
                className="p-2 text-gray-400 hover:text-error rounded-lg hover:bg-error/5 transition-colors duration-200"
              >
                <ApperIcon name="Trash2" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;