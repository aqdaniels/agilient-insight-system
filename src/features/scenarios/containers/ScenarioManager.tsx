
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/design-system";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";

// Types
export interface Scenario {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "running" | "completed";
}

// Mock API function - would be replaced by actual API calls
const fetchScenarios = async (): Promise<Scenario[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: "scen-001",
      name: "Baseline Delivery Plan",
      description: "Standard team composition with current velocity",
      createdAt: "2025-04-15T10:30:00Z",
      updatedAt: "2025-04-18T14:22:00Z",
      status: "completed"
    },
    {
      id: "scen-002",
      name: "Accelerated Timeline",
      description: "Enhanced team with 20% velocity increase",
      createdAt: "2025-04-16T09:15:00Z",
      updatedAt: "2025-04-18T11:45:00Z",
      status: "completed"
    },
    {
      id: "scen-003",
      name: "Cost Optimization",
      description: "Reduced team size with extended timeline",
      createdAt: "2025-04-17T15:20:00Z",
      updatedAt: "2025-04-17T15:20:00Z",
      status: "draft"
    }
  ];
};

// ScenarioManager container component
const ScenarioManager: React.FC = () => {
  const { data: scenarios, isLoading, error } = useQuery({
    queryKey: ['scenarios'],
    queryFn: fetchScenarios,
  });

  const handleCreateScenario = () => {
    console.log("Create new scenario");
    // Implementation would create a new scenario
  };

  const handleDeleteScenario = (id: string) => {
    console.log("Delete scenario:", id);
    // Implementation would delete the scenario
  };

  const handleEditScenario = (id: string) => {
    console.log("Edit scenario:", id);
    // Implementation would navigate to edit page or open edit modal
  };

  const handleDuplicateScenario = (id: string) => {
    console.log("Duplicate scenario:", id);
    // Implementation would duplicate the scenario
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Scenarios</h2>
          <Skeleton className="h-10 w-32" />
        </div>
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-error">Error loading scenarios: {error.toString()}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Delivery Scenarios</h2>
        <Button 
          variant="primary" 
          onClick={handleCreateScenario}
          leftIcon={<Plus />}
        >
          New Scenario
        </Button>
      </div>
      
      {scenarios && scenarios.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {scenarios.map(scenario => (
            <div key={scenario.id} className="border rounded-lg p-4 bg-card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{scenario.name}</h3>
                  <p className="text-muted-foreground">{scenario.description}</p>
                  <div className="flex items-center mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      scenario.status === 'completed' ? 'bg-success/15 text-success' : 
                      scenario.status === 'running' ? 'bg-info/15 text-info' : 
                      'bg-muted text-muted-foreground'
                    }`}>
                      {scenario.status.charAt(0).toUpperCase() + scenario.status.slice(1)}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      Updated {new Date(scenario.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditScenario(scenario.id)}>
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDuplicateScenario(scenario.id)}>
                    Duplicate
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No scenarios created yet</p>
          <Button 
            variant="primary" 
            onClick={handleCreateScenario}
          >
            Create Your First Scenario
          </Button>
        </div>
      )}
    </div>
  );
};

export default ScenarioManager;
