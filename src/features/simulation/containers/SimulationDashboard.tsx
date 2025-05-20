
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/design-system";
import { Skeleton } from "@/components/ui/skeleton";
import SimulationControls from "../components/SimulationControls";
import TimelineVisualization from "../components/TimelineVisualization";
import { Play, Settings, Clock } from "lucide-react";

// Types
export interface SimulationParameters {
  startDate: string;
  teamConfigId: string;
  backlogId: string;
  riskFactor: number;
  variabilityFactor: number;
  constraints: {
    maxTeamSize: number;
    budgetCap: number;
    deadlineDate: string;
  };
  prioritizationStrategy: "value-first" | "risk-first" | "balanced";
  includeHistoricalData: boolean;
  iterations: number;
}

export interface SimulationResults {
  id: string;
  status: "pending" | "running" | "completed" | "failed";
  progress: number;
  startTime: string;
  endTime: string | null;
  projectedEndDate: string;
  projectedTotalCost: number;
  confidenceLevel: number;
  risksIdentified: number;
  timeline: {
    sprintId: number;
    startDate: string;
    endDate: string;
    plannedPoints: number;
    estimatedCompletedPoints: number;
    cumulativeCompletedPoints: number;
    remainingPoints: number;
  }[];
  risks: {
    id: string;
    description: string;
    probability: number;
    impact: number;
    mitigationStrategy: string;
  }[];
}

// Mock API call
const fetchSimulationData = async (): Promise<{
  parameters: SimulationParameters;
  results: SimulationResults | null;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    parameters: {
      startDate: "2025-06-01",
      teamConfigId: "team-001",
      backlogId: "backlog-001",
      riskFactor: 0.2,
      variabilityFactor: 0.15,
      constraints: {
        maxTeamSize: 8,
        budgetCap: 150000,
        deadlineDate: "2025-09-30"
      },
      prioritizationStrategy: "balanced",
      includeHistoricalData: true,
      iterations: 1000
    },
    results: {
      id: "sim-001",
      status: "completed",
      progress: 100,
      startTime: "2025-05-15T10:30:00Z",
      endTime: "2025-05-15T10:35:22Z",
      projectedEndDate: "2025-09-15",
      projectedTotalCost: 125000,
      confidenceLevel: 85,
      risksIdentified: 3,
      timeline: [
        { sprintId: 1, startDate: "2025-06-01", endDate: "2025-06-14", plannedPoints: 35, estimatedCompletedPoints: 30, cumulativeCompletedPoints: 30, remainingPoints: 270 },
        { sprintId: 2, startDate: "2025-06-15", endDate: "2025-06-28", plannedPoints: 35, estimatedCompletedPoints: 32, cumulativeCompletedPoints: 62, remainingPoints: 238 },
        { sprintId: 3, startDate: "2025-06-29", endDate: "2025-07-12", plannedPoints: 35, estimatedCompletedPoints: 33, cumulativeCompletedPoints: 95, remainingPoints: 205 },
        { sprintId: 4, startDate: "2025-07-13", endDate: "2025-07-26", plannedPoints: 35, estimatedCompletedPoints: 34, cumulativeCompletedPoints: 129, remainingPoints: 171 },
        { sprintId: 5, startDate: "2025-07-27", endDate: "2025-08-09", plannedPoints: 35, estimatedCompletedPoints: 36, cumulativeCompletedPoints: 165, remainingPoints: 135 },
        { sprintId: 6, startDate: "2025-08-10", endDate: "2025-08-23", plannedPoints: 35, estimatedCompletedPoints: 35, cumulativeCompletedPoints: 200, remainingPoints: 100 },
        { sprintId: 7, startDate: "2025-08-24", endDate: "2025-09-06", plannedPoints: 35, estimatedCompletedPoints: 37, cumulativeCompletedPoints: 237, remainingPoints: 63 },
        { sprintId: 8, startDate: "2025-09-07", endDate: "2025-09-20", plannedPoints: 35, estimatedCompletedPoints: 63, cumulativeCompletedPoints: 300, remainingPoints: 0 }
      ],
      risks: [
        { id: "risk-001", description: "Team member unavailability during summer", probability: 0.6, impact: 0.4, mitigationStrategy: "Plan for reduced velocity in July-August" },
        { id: "risk-002", description: "Technical debt in legacy components", probability: 0.8, impact: 0.7, mitigationStrategy: "Allocate specific capacity for refactoring" },
        { id: "risk-003", description: "External dependency delays", probability: 0.5, impact: 0.9, mitigationStrategy: "Identify alternative implementation approaches" }
      ]
    }
  };
};

const SimulationDashboard: React.FC = () => {
  const { data: simulationData, isLoading, error } = useQuery({
    queryKey: ['simulationData'],
    queryFn: fetchSimulationData,
  });
  
  const [isConfiguring, setIsConfiguring] = useState(false);

  const handleRunSimulation = () => {
    console.log("Running simulation");
    // Implementation would run the simulation
  };
  
  const handleUpdateParameters = (params: Partial<SimulationParameters>) => {
    console.log("Updating parameters:", params);
    // Implementation would update the simulation parameters
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Delivery Simulation</h2>
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-80 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-error">Error loading simulation data: {error.toString()}</div>;
  }

  if (!simulationData) {
    return <div className="text-error">No simulation data found</div>;
  }

  const { parameters, results } = simulationData;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Delivery Simulation</h2>
        <div className="flex space-x-2">
          <Button 
            variant={isConfiguring ? "primary" : "outline"} 
            onClick={() => setIsConfiguring(!isConfiguring)}
            leftIcon={<Settings size={16} />}
          >
            {isConfiguring ? "Hide Parameters" : "Configure"}
          </Button>
          <Button 
            variant="primary" 
            onClick={handleRunSimulation}
            leftIcon={<Play size={16} />}
            disabled={results?.status === "running"}
          >
            {results?.status === "running" ? "Simulation Running..." : "Run Simulation"}
          </Button>
        </div>
      </div>

      {isConfiguring && (
        <div className="border rounded-lg p-4 bg-card">
          <h3 className="font-medium text-lg mb-4">Simulation Parameters</h3>
          <SimulationControls 
            parameters={parameters}
            onParametersChange={handleUpdateParameters}
          />
        </div>
      )}

      {results && results.status === "completed" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border rounded-lg p-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">Projected Completion</div>
              <div className="text-2xl font-bold flex justify-center items-center gap-2">
                <Clock size={20} className="text-primary" />
                {new Date(results.projectedEndDate).toLocaleDateString()}
              </div>
              <div className={`mt-1 text-sm ${
                new Date(results.projectedEndDate) <= new Date(parameters.constraints.deadlineDate) 
                  ? 'text-success' 
                  : 'text-error'
              }`}>
                {new Date(results.projectedEndDate) <= new Date(parameters.constraints.deadlineDate) 
                  ? `${Math.ceil((new Date(parameters.constraints.deadlineDate).getTime() - new Date(results.projectedEndDate).getTime()) / (1000 * 60 * 60 * 24))} days before deadline`
                  : `${Math.ceil((new Date(results.projectedEndDate).getTime() - new Date(parameters.constraints.deadlineDate).getTime()) / (1000 * 60 * 60 * 24))} days past deadline`
                }
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">Projected Cost</div>
              <div className="text-2xl font-bold">${results.projectedTotalCost.toLocaleString()}</div>
              <div className={`mt-1 text-sm ${
                results.projectedTotalCost <= parameters.constraints.budgetCap
                  ? 'text-success' 
                  : 'text-error'
              }`}>
                {results.projectedTotalCost <= parameters.constraints.budgetCap
                  ? `$${(parameters.constraints.budgetCap - results.projectedTotalCost).toLocaleString()} under budget`
                  : `$${(results.projectedTotalCost - parameters.constraints.budgetCap).toLocaleString()} over budget`
                }
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">Confidence Level</div>
              <div className="text-2xl font-bold">{results.confidenceLevel}%</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Based on {parameters.iterations} simulation runs
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-card">
            <h3 className="font-medium text-lg mb-4">Delivery Timeline</h3>
            <TimelineVisualization 
              timelineData={results.timeline} 
              deadlineDate={parameters.constraints.deadlineDate}
            />
          </div>
          
          {results.risks.length > 0 && (
            <div className="border rounded-lg p-4 bg-card">
              <h3 className="font-medium text-lg mb-4">Identified Risks</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Risk Factor</th>
                      <th className="px-4 py-3">Probability</th>
                      <th className="px-4 py-3">Impact</th>
                      <th className="px-4 py-3">Mitigation Strategy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.risks.map((risk) => (
                      <tr key={risk.id} className="border-t border-border hover:bg-muted/30">
                        <td className="px-4 py-3">{risk.description}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div 
                              className="h-2 w-16 bg-muted rounded-full overflow-hidden"
                            >
                              <div 
                                className={`h-full ${
                                  risk.probability < 0.3 ? 'bg-success' :
                                  risk.probability < 0.7 ? 'bg-warning' :
                                  'bg-error'
                                }`}
                                style={{ width: `${risk.probability * 100}%` }}
                              ></div>
                            </div>
                            <span>{Math.round(risk.probability * 100)}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div 
                              className="h-2 w-16 bg-muted rounded-full overflow-hidden"
                            >
                              <div 
                                className={`h-full ${
                                  risk.impact < 0.3 ? 'bg-success' :
                                  risk.impact < 0.7 ? 'bg-warning' :
                                  'bg-error'
                                }`}
                                style={{ width: `${risk.impact * 100}%` }}
                              ></div>
                            </div>
                            <span>{Math.round(risk.impact * 100)}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">{risk.mitigationStrategy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {results && results.status === "running" && (
        <div className="border rounded-lg p-8 bg-card text-center">
          <div className="mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
          </div>
          <h3 className="text-lg font-medium mb-2">Simulation in Progress</h3>
          <p className="text-muted-foreground mb-4">Running {parameters.iterations} iterations...</p>
          <div className="w-full bg-muted rounded-full h-2.5 mb-1">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${results.progress}%` }}></div>
          </div>
          <p className="text-sm text-muted-foreground">{results.progress}% complete</p>
        </div>
      )}

      {(!results || results.status === "pending" || results.status === "failed") && (
        <div className="border rounded-lg p-8 bg-card text-center">
          <h3 className="text-lg font-medium mb-2">No Simulation Results</h3>
          <p className="text-muted-foreground mb-4">
            {results?.status === "failed" 
              ? "The last simulation run failed. Please check your parameters and try again." 
              : "Configure your parameters and run a simulation to see delivery forecasts."}
          </p>
          <Button 
            variant="primary" 
            onClick={handleRunSimulation}
            leftIcon={<Play size={16} />}
          >
            Run Simulation
          </Button>
        </div>
      )}
    </div>
  );
};

export default SimulationDashboard;
