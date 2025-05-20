
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/design-system";
import { Skeleton } from "@/components/ui/skeleton";
import ComparisonMatrix from "../components/ComparisonMatrix";
import { Search, Plus, Check } from "lucide-react";

// Types
export interface ScenarioSummary {
  id: string;
  name: string;
  description: string;
  date: string;
  metrics: {
    duration: number;
    cost: number;
    confidence: number;
  };
}

// Mock API call
const fetchScenarios = async (): Promise<ScenarioSummary[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: "scen-001",
      name: "Baseline Delivery",
      description: "Standard team composition with current velocity",
      date: "2025-05-15",
      metrics: {
        duration: 120,
        cost: 125000,
        confidence: 92
      }
    },
    {
      id: "scen-002",
      name: "Accelerated Timeline",
      description: "Enhanced team with 20% velocity increase",
      date: "2025-05-16",
      metrics: {
        duration: 95,
        cost: 145000,
        confidence: 78
      }
    },
    {
      id: "scen-003",
      name: "Cost Optimization",
      description: "Reduced team size with extended timeline",
      date: "2025-05-17",
      metrics: {
        duration: 150,
        cost: 105000,
        confidence: 85
      }
    },
    {
      id: "scen-004",
      name: "Balanced Approach",
      description: "Optimized resource allocation with moderate enhancements",
      date: "2025-05-18",
      metrics: {
        duration: 110,
        cost: 130000,
        confidence: 88
      }
    }
  ];
};

const ComparisonWorkspace: React.FC = () => {
  const { data: scenarios = [], isLoading, error } = useQuery({
    queryKey: ['scenarios'],
    queryFn: fetchScenarios,
  });
  
  const [selectedScenarioIds, setSelectedScenarioIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const toggleScenarioSelection = (id: string) => {
    setSelectedScenarioIds(prev => 
      prev.includes(id) 
        ? prev.filter(scenarioId => scenarioId !== id)
        : [...prev, id]
    );
  };
  
  // Filter scenarios based on search query
  const filteredScenarios = scenarios?.filter(scenario =>
    scenario.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scenario.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  // Get selected scenarios for comparison
  const selectedScenarios = scenarios?.filter(scenario => 
    selectedScenarioIds.includes(scenario.id)
  ) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Scenario Comparison</h2>
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-error">Error loading scenarios: {error.toString()}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Scenario Comparison</h2>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
        <input
          type="text"
          placeholder="Search scenarios..."
          className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="border rounded-lg p-4 bg-card">
        <h3 className="font-medium text-lg mb-4">Select Scenarios to Compare</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredScenarios.map((scenario) => {
            const isSelected = selectedScenarioIds.includes(scenario.id);
            
            return (
              <div 
                key={scenario.id} 
                onClick={() => toggleScenarioSelection(scenario.id)}
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:border-muted-foreground'
                }`}
              >
                <div className="flex justify-between">
                  <h4 className="font-medium">{scenario.name}</h4>
                  {isSelected && (
                    <Check className="text-primary" size={18} />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{scenario.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-xs bg-muted/50 py-0.5 px-1.5 rounded">
                    {scenario.metrics.duration} days
                  </span>
                  <span className="text-xs bg-muted/50 py-0.5 px-1.5 rounded">
                    ${scenario.metrics.cost.toLocaleString()}
                  </span>
                  <span className={`text-xs py-0.5 px-1.5 rounded ${
                    scenario.metrics.confidence >= 90 ? 'bg-success/15 text-success' :
                    scenario.metrics.confidence >= 75 ? 'bg-warning/15 text-warning' :
                    'bg-error/15 text-error'
                  }`}>
                    {scenario.metrics.confidence}% confidence
                  </span>
                </div>
              </div>
            );
          })}
          
          <div 
            className="border border-dashed rounded-lg p-3 flex items-center justify-center cursor-pointer hover:border-muted-foreground"
            onClick={() => console.log("Create new scenario")}
          >
            <div className="text-center">
              <Plus className="mx-auto mb-1 text-muted-foreground" size={24} />
              <p className="text-sm">Create New Scenario</p>
            </div>
          </div>
        </div>
      </div>

      {selectedScenarios.length >= 2 ? (
        <div className="border rounded-lg p-4 bg-card">
          <h3 className="font-medium text-lg mb-4">Scenario Comparison</h3>
          <ComparisonMatrix scenarios={selectedScenarios} />
        </div>
      ) : (
        <div className="border rounded-lg p-8 bg-card text-center">
          <h3 className="text-lg font-medium mb-2">Select Scenarios to Compare</h3>
          <p className="text-muted-foreground mb-4">Please select at least two scenarios to see a detailed comparison.</p>
        </div>
      )}
    </div>
  );
};

export default ComparisonWorkspace;
