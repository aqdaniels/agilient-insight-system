
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/design-system";
import { Skeleton } from "@/components/ui/skeleton";
import BacklogTable from "../components/BacklogTable";
import { Search, Plus, FileUp } from "lucide-react";
import { Input } from "@/components/ui/input";

// Types
export interface BacklogItem {
  id: string;
  title: string;
  type: "story" | "bug" | "task" | "epic";
  priority: "low" | "medium" | "high" | "critical";
  estimate: number;
  status: "todo" | "in-progress" | "done";
  tags: string[];
  assignee?: string;
}

// Mock API call
const fetchBacklogItems = async (): Promise<BacklogItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: "BLI-001",
      title: "Implement user authentication flow",
      type: "story",
      priority: "high",
      estimate: 8,
      status: "todo",
      tags: ["frontend", "security"]
    },
    {
      id: "BLI-002",
      title: "Fix dashboard loading performance",
      type: "bug",
      priority: "critical",
      estimate: 5,
      status: "in-progress",
      tags: ["performance"],
      assignee: "Alex Wong"
    },
    {
      id: "BLI-003",
      title: "Design database schema for reporting module",
      type: "task",
      priority: "medium",
      estimate: 3,
      status: "done",
      tags: ["database", "backend"]
    },
    {
      id: "BLI-004",
      title: "Reporting System Overhaul",
      type: "epic",
      priority: "medium",
      estimate: 40,
      status: "todo",
      tags: ["reporting", "analytics"]
    }
  ];
};

const BacklogManager: React.FC = () => {
  const { data: backlogItems, isLoading, error } = useQuery({
    queryKey: ['backlogItems'],
    queryFn: fetchBacklogItems,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  const handleImportFromJira = () => {
    console.log("Importing from Jira");
    // Implementation would connect to Jira
  };
  
  const handleImportFromAzureDevOps = () => {
    console.log("Importing from Azure DevOps");
    // Implementation would connect to Azure DevOps
  };
  
  const handleCreateItem = () => {
    console.log("Creating new backlog item");
    // Implementation would create a new backlog item
  };

  const handleUpdatePriority = (id: string, priority: BacklogItem["priority"]) => {
    console.log(`Updating priority for ${id} to ${priority}`);
    // Implementation would update the item priority
  };

  const handleUpdateEstimate = (id: string, estimate: number) => {
    console.log(`Updating estimate for ${id} to ${estimate}`);
    // Implementation would update the item estimate
  };

  // Filter backlog items based on search and filters
  const filteredBacklogItems = backlogItems?.filter(item => {
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = !selectedType || item.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Project Backlog</h2>
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-error">Error loading backlog: {error.toString()}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Backlog</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleImportFromJira}
            leftIcon={<FileUp size={16} />}
          >
            Import from Jira
          </Button>
          <Button 
            variant="outline" 
            onClick={handleImportFromAzureDevOps}
            leftIcon={<FileUp size={16} />}
          >
            Azure DevOps
          </Button>
          <Button 
            variant="primary" 
            onClick={handleCreateItem}
            leftIcon={<Plus size={16} />}
          >
            Add Item
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            className="pl-10"
            placeholder="Search backlog items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <select
          className="border border-input bg-background px-3 h-10 rounded-md text-sm"
          value={selectedType || ""}
          onChange={(e) => setSelectedType(e.target.value || null)}
        >
          <option value="">All Types</option>
          <option value="story">User Stories</option>
          <option value="bug">Bugs</option>
          <option value="task">Tasks</option>
          <option value="epic">Epics</option>
        </select>
      </div>

      <BacklogTable 
        items={filteredBacklogItems || []} 
        onUpdatePriority={handleUpdatePriority}
        onUpdateEstimate={handleUpdateEstimate}
      />
    </div>
  );
};

export default BacklogManager;
