
import React from "react";
import { BacklogItem } from "../containers/BacklogManager";

interface BacklogTableProps {
  items: BacklogItem[];
  onUpdatePriority: (id: string, priority: BacklogItem["priority"]) => void;
  onUpdateEstimate: (id: string, estimate: number) => void;
}

const BacklogTable: React.FC<BacklogTableProps> = ({ 
  items,
  onUpdatePriority,
  onUpdateEstimate
}) => {
  const renderPriorityBadge = (priority: BacklogItem["priority"]) => {
    const classes = {
      critical: "bg-error/15 text-error",
      high: "bg-warning/15 text-warning",
      medium: "bg-info/15 text-info",
      low: "bg-success/15 text-success"
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const renderTypeBadge = (type: BacklogItem["type"]) => {
    const classes = {
      epic: "bg-secondary/15 text-secondary",
      story: "bg-primary/15 text-primary",
      task: "bg-info/15 text-info",
      bug: "bg-error/15 text-error"
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes[type]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed rounded-lg">
        <p className="text-muted-foreground">No backlog items match your criteria</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Estimate</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Tags</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t border-border hover:bg-muted/30">
              <td className="px-4 py-3 font-medium">{item.id}</td>
              <td className="px-4 py-3">{item.title}</td>
              <td className="px-4 py-3">{renderTypeBadge(item.type)}</td>
              <td className="px-4 py-3">
                <select
                  className="border border-input bg-background px-2 py-1 rounded-md text-xs"
                  value={item.priority}
                  onChange={(e) => onUpdatePriority(item.id, e.target.value as BacklogItem["priority"])}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </td>
              <td className="px-4 py-3">
                <input
                  type="number"
                  className="border border-input bg-background px-2 py-1 rounded-md text-xs w-16"
                  value={item.estimate}
                  min="0"
                  onChange={(e) => onUpdateEstimate(item.id, parseInt(e.target.value, 10) || 0)}
                />
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  item.status === 'done' ? 'bg-success/15 text-success' : 
                  item.status === 'in-progress' ? 'bg-info/15 text-info' : 
                  'bg-muted text-muted-foreground'
                }`}>
                  {item.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <span key={tag} className="bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 px-1.5 py-0.5 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BacklogTable;
