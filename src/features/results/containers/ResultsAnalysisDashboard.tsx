
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/design-system";
import { Download, Share2, Clock, DollarSign, AlertTriangle, Layers } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// Components
import TimelineAnalysis from "../components/TimelineAnalysis";
import ResourceUtilization from "../components/ResourceUtilization";
import DeliveryMetrics from "../components/DeliveryMetrics";
import CostDashboard from "../components/CostDashboard";
import RiskAnalysis from "../components/RiskAnalysis";
import OptimizationEngine from "../components/OptimizationEngine";
import { SimulationResults } from "../../simulation/types";

// Mock API call to fetch simulation results
const fetchAnalysisData = async (simulationId: string): Promise<SimulationResults> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // This would normally be an API call to fetch actual results
  return {
    completionDate: new Date("2025-09-15"),
    confidenceLevel: 85,
    velocityTrend: [
      { sprint: 1, velocity: 30 },
      { sprint: 2, velocity: 32 },
      { sprint: 3, velocity: 33 },
      { sprint: 4, velocity: 34 },
      { sprint: 5, velocity: 36 },
      { sprint: 6, velocity: 35 },
      { sprint: 7, velocity: 37 },
      { sprint: 8, velocity: 40 }
    ],
    completionDistribution: [
      { date: new Date("2025-09-01"), probability: 0.1 },
      { date: new Date("2025-09-08"), probability: 0.3 },
      { date: new Date("2025-09-15"), probability: 0.5 },
      { date: new Date("2025-09-22"), probability: 0.8 },
      { date: new Date("2025-09-30"), probability: 0.95 }
    ],
    riskFactors: [
      { name: "Team member unavailability", impact: 0.4, probability: 0.6 },
      { name: "Technical debt in legacy components", impact: 0.7, probability: 0.8 },
      { name: "External dependency delays", impact: 0.9, probability: 0.5 }
    ],
    comparisonToBaseline: {
      timeReduction: 15,
      costReduction: 12000,
      qualityImprovement: 8
    }
  };
};

const ResultsAnalysisDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("timeline");
  const [showComparisonView, setShowComparisonView] = useState(false);
  
  const simulationId = "sim-001"; // In real app, this could come from URL params
  
  const { data: results, isLoading, error } = useQuery({
    queryKey: ['simulationResults', simulationId],
    queryFn: () => fetchAnalysisData(simulationId),
  });
  
  const handleExportReport = () => {
    toast.success("Report export started");
    // Implementation would handle export functionality
  };
  
  const handleShareResults = () => {
    toast.success("Link copied to clipboard");
    // Implementation would handle sharing functionality
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Results Analysis</h2>
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-error">Error loading simulation results: {error.toString()}</div>;
  }

  if (!results) {
    return <div className="text-error">No simulation results found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Results Analysis</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleShareResults}
            leftIcon={<Share2 size={16} />}
          >
            Share Results
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExportReport}
            leftIcon={<Download size={16} />}
          >
            Export Report
          </Button>
        </div>
      </div>
      
      {results.comparisonToBaseline && (
        <div className="p-4 border rounded-lg bg-success/10 border-success/30 mb-6">
          <h3 className="font-medium text-lg mb-2">Baseline Comparison Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-success" />
              <div>
                <p className="font-medium">{results.comparisonToBaseline.timeReduction}% Faster Delivery</p>
                <p className="text-sm text-muted-foreground">Compared to baseline</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={18} className="text-success" />
              <div>
                <p className="font-medium">${results.comparisonToBaseline.costReduction.toLocaleString()} Cost Savings</p>
                <p className="text-sm text-muted-foreground">Total projected reduction</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-success" />
              <div>
                <p className="font-medium">{results.comparisonToBaseline.qualityImprovement}% Quality Improvement</p>
                <p className="text-sm text-muted-foreground">Based on defect reduction</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="timeline" className="flex items-center gap-1">
            <Clock size={16} />
            <span>Timeline</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-1">
            <Layers size={16} />
            <span>Resources</span>
          </TabsTrigger>
          <TabsTrigger value="delivery" className="flex items-center gap-1">
            <Layers size={16} />
            <span>Delivery</span>
          </TabsTrigger>
          <TabsTrigger value="cost" className="flex items-center gap-1">
            <DollarSign size={16} />
            <span>Cost</span>
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center gap-1">
            <AlertTriangle size={16} />
            <span>Risk</span>
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-1">
            <Layers size={16} />
            <span>Optimization</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-0">
          <TimelineAnalysis results={results} />
        </TabsContent>
        
        <TabsContent value="resources" className="mt-0">
          <ResourceUtilization />
        </TabsContent>
        
        <TabsContent value="delivery" className="mt-0">
          <DeliveryMetrics velocityTrend={results.velocityTrend} />
        </TabsContent>
        
        <TabsContent value="cost" className="mt-0">
          <CostDashboard />
        </TabsContent>
        
        <TabsContent value="risk" className="mt-0">
          <RiskAnalysis riskFactors={results.riskFactors} />
        </TabsContent>
        
        <TabsContent value="optimization" className="mt-0">
          <OptimizationEngine />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultsAnalysisDashboard;
