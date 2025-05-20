
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/design-system";
import { Skeleton } from "@/components/ui/skeleton";
import UtilizationChart from "../components/UtilizationChart";
import CostBreakdown from "../components/CostBreakdown";
import { Download, ChevronDown, ChevronUp, BarChart } from "lucide-react";

// Types
export interface SimulationResult {
  id: string;
  name: string;
  completedAt: string;
  metrics: {
    duration: number; // days
    cost: number;
    teamUtilization: number; // percentage
    riskExposure: number; // percentage
    confidenceLevel: number; // percentage
  };
  utilizationData: {
    sprint: string;
    frontend: number;
    backend: number;
    design: number;
    qa: number;
    devops: number;
    management: number;
  }[];
  costData: {
    category: string;
    planned: number;
    actual: number;
  }[];
}

// Mock API call
const fetchSimulationResult = async (id: string): Promise<SimulationResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: "sim-001",
    name: "Baseline Delivery Plan",
    completedAt: "2025-05-15T14:30:00Z",
    metrics: {
      duration: 120,
      cost: 125000,
      teamUtilization: 85,
      riskExposure: 18,
      confidenceLevel: 92,
    },
    utilizationData: [
      { sprint: "Sprint 1", frontend: 90, backend: 70, design: 95, qa: 40, devops: 60, management: 80 },
      { sprint: "Sprint 2", frontend: 85, backend: 80, design: 70, qa: 50, devops: 65, management: 80 },
      { sprint: "Sprint 3", frontend: 80, backend: 90, design: 50, qa: 70, devops: 70, management: 80 },
      { sprint: "Sprint 4", frontend: 75, backend: 95, design: 40, qa: 85, devops: 75, management: 80 },
      { sprint: "Sprint 5", frontend: 70, backend: 90, design: 60, qa: 90, devops: 85, management: 80 },
      { sprint: "Sprint 6", frontend: 85, backend: 75, design: 80, qa: 95, devops: 90, management: 80 },
      { sprint: "Sprint 7", frontend: 95, backend: 70, design: 90, qa: 90, devops: 95, management: 80 },
      { sprint: "Sprint 8", frontend: 90, backend: 85, design: 95, qa: 85, devops: 90, management: 80 }
    ],
    costData: [
      { category: "Frontend Development", planned: 42000, actual: 40000 },
      { category: "Backend Development", planned: 48000, actual: 51000 },
      { category: "DevOps & Infrastructure", planned: 15000, actual: 14500 },
      { category: "QA & Testing", planned: 20000, actual: 18000 },
      { category: "Project Management", planned: 10000, actual: 9500 }
    ]
  };
};

const ResultsAnalyzer: React.FC = () => {
  const { data: result, isLoading, error } = useQuery({
    queryKey: ['simulationResult', 'sim-001'],
    queryFn: () => fetchSimulationResult('sim-001'),
  });
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    utilization: true,
    cost: true,
    recommendations: false
  });
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const handleExportReport = () => {
    console.log("Exporting report");
    // Implementation would export the report
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Simulation Results</h2>
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-error">Error loading simulation results: {error.toString()}</div>;
  }

  if (!result) {
    return <div className="text-error">No simulation results found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Simulation Results</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleExportReport}
            leftIcon={<Download size={16} />}
          >
            Export Report
          </Button>
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h3 className="font-medium text-lg">{result.name}</h3>
            <p className="text-sm text-muted-foreground">
              Completed on {new Date(result.completedAt).toLocaleString()}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/15 text-primary">
              {result.metrics.duration} days
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/15 text-secondary">
              ${result.metrics.cost.toLocaleString()}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              result.metrics.confidenceLevel >= 80 ? 'bg-success/15 text-success' :
              result.metrics.confidenceLevel >= 60 ? 'bg-warning/15 text-warning' :
              'bg-error/15 text-error'
            }`}>
              {result.metrics.confidenceLevel}% confidence
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-muted/30 p-3 rounded-md">
            <div className="text-xs text-muted-foreground">Duration</div>
            <div className="text-xl font-bold">{result.metrics.duration} days</div>
          </div>
          <div className="bg-muted/30 p-3 rounded-md">
            <div className="text-xs text-muted-foreground">Total Cost</div>
            <div className="text-xl font-bold">${result.metrics.cost.toLocaleString()}</div>
          </div>
          <div className="bg-muted/30 p-3 rounded-md">
            <div className="text-xs text-muted-foreground">Team Utilization</div>
            <div className="text-xl font-bold">{result.metrics.teamUtilization}%</div>
          </div>
          <div className="bg-muted/30 p-3 rounded-md">
            <div className="text-xs text-muted-foreground">Risk Exposure</div>
            <div className="text-xl font-bold">{result.metrics.riskExposure}%</div>
          </div>
        </div>
      </div>

      <div className="border rounded-lg bg-card overflow-hidden">
        <div 
          className="flex justify-between items-center p-4 cursor-pointer"
          onClick={() => toggleSection('utilization')}
        >
          <h3 className="font-medium text-lg flex items-center">
            <BarChart size={18} className="mr-2" />
            Resource Utilization
          </h3>
          <button className="text-muted-foreground">
            {expandedSections.utilization ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
        
        {expandedSections.utilization && (
          <div className="p-4 pt-0">
            <UtilizationChart utilizationData={result.utilizationData} />
          </div>
        )}
      </div>

      <div className="border rounded-lg bg-card overflow-hidden">
        <div 
          className="flex justify-between items-center p-4 cursor-pointer"
          onClick={() => toggleSection('cost')}
        >
          <h3 className="font-medium text-lg flex items-center">
            <BarChart size={18} className="mr-2" />
            Cost Breakdown
          </h3>
          <button className="text-muted-foreground">
            {expandedSections.cost ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
        
        {expandedSections.cost && (
          <div className="p-4 pt-0">
            <CostBreakdown costData={result.costData} />
          </div>
        )}
      </div>

      <div className="border rounded-lg bg-card overflow-hidden">
        <div 
          className="flex justify-between items-center p-4 cursor-pointer"
          onClick={() => toggleSection('recommendations')}
        >
          <h3 className="font-medium text-lg flex items-center">
            <BarChart size={18} className="mr-2" />
            Optimization Recommendations
          </h3>
          <button className="text-muted-foreground">
            {expandedSections.recommendations ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
        
        {expandedSections.recommendations && (
          <div className="p-4 pt-0">
            <div className="space-y-4">
              <div className="border-l-4 border-info p-4 bg-info/5 rounded-r-md">
                <h4 className="font-medium mb-1">Resource Balancing</h4>
                <p className="text-sm">Frontend development resources appear to be overutilized in Sprints 1 and 7. Consider redistributing tasks to balance workload across the team.</p>
              </div>
              
              <div className="border-l-4 border-success p-4 bg-success/5 rounded-r-md">
                <h4 className="font-medium mb-1">Cost Efficiency</h4>
                <p className="text-sm">Backend development is slightly over budget. Look for opportunities to optimize implementation approach for remaining features.</p>
              </div>
              
              <div className="border-l-4 border-warning p-4 bg-warning/5 rounded-r-md">
                <h4 className="font-medium mb-1">Risk Mitigation</h4>
                <p className="text-sm">Consider adding a buffer sprint to account for the identified technical risks, especially around external dependencies.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsAnalyzer;
