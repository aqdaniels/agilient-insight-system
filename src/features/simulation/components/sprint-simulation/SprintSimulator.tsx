import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SprintSimulationConfig, SprintSimulationResult, SprintData, AgileKPI } from "../../types/sprint-simulation";
import SprintTeamSetup from './SprintTeamSetup';
import SprintSetupForm from './SprintSetupForm';
import SprintSimulationResults from './SprintSimulationResults';
import { Badge } from "@/components/design-system";
import { GenAIAccelerator } from "@/features/genai/types";
import { Play } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SprintSimulatorProps {
  availableAccelerators?: GenAIAccelerator[];
}

const SprintSimulator: React.FC<SprintSimulatorProps> = ({ 
  availableAccelerators = []
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("setup");
  
  const defaultKpis: AgileKPI[] = [
    { name: "Velocity", value: 30, target: 35, unit: "points/sprint" },
    { name: "Completion Rate", value: 90, target: 95, unit: "%" },
    { name: "Bug Injection Rate", value: 5, target: 2, unit: "bugs/sprint" },
    { name: "Code Coverage", value: 75, target: 80, unit: "%" }
  ];
  
  const [config, setConfig] = useState<SprintSimulationConfig>({
    initialBacklogSize: 200,
    baselineVelocity: 30,
    teamSize: 5,
    sprintsToSimulate: 8,
    kpis: defaultKpis,
    acceleratorId: null,
    velocityVariability: 0.2 // 20% variation
  });
  
  const [simulationResult, setSimulationResult] = useState<SprintSimulationResult | null>(null);
  const [selectedAccelerator, setSelectedAccelerator] = useState<GenAIAccelerator | null>(null);

  const updateConfig = (updates: Partial<SprintSimulationConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...updates
    }));
  };

  const selectAccelerator = (acceleratorId: string | null) => {
    setConfig(prev => ({
      ...prev,
      acceleratorId
    }));
    
    if (acceleratorId) {
      const accelerator = availableAccelerators.find(a => a.id === acceleratorId);
      setSelectedAccelerator(accelerator || null);
    } else {
      setSelectedAccelerator(null);
    }
  };

  const updateKpis = (updatedKpis: AgileKPI[]) => {
    updateConfig({ kpis: updatedKpis });
  };

  const runSimulation = () => {
    // Generate simulation data
    const sprints: SprintData[] = [];
    let remainingBacklog = config.initialBacklogSize;
    let totalCompletedPoints = 0;
    
    // Calculate accelerator impact
    const acceleratorImpact = selectedAccelerator 
      ? Math.min(0.5, selectedAccelerator.effectivenessMultiplier / 3) // Convert to a 0-0.5 range
      : 0;
    
    // Generate sprint data
    for (let i = 0; i < config.sprintsToSimulate && remainingBacklog > 0; i++) {
      // Base velocity with variability
      const variabilityFactor = 1 + ((Math.random() * 2 - 1) * config.velocityVariability);
      let velocityPoints = Math.round(config.baselineVelocity * variabilityFactor);
      
      // Add accelerator impact (increases over time)
      const acceleratorRampUp = Math.min(1, (i + 1) / 4); // Ramps up over first 4 sprints
      const acceleratorBoost = selectedAccelerator 
        ? Math.round(velocityPoints * acceleratorImpact * acceleratorRampUp)
        : 0;
      
      // Calculate completed story points, capped by remaining backlog
      const completedPoints = Math.min(remainingBacklog, velocityPoints + acceleratorBoost);
      totalCompletedPoints += completedPoints;
      remainingBacklog -= completedPoints;
      
      sprints.push({
        sprintNumber: i + 1,
        velocityPoints, // Base velocity before accelerator
        completedStoryPoints: completedPoints,
        remainingBacklog,
        teamUtilization: Math.min(95, 75 + Math.random() * 20), // Random between 75-95%
        acceleratorImpact: acceleratorBoost
      });
    }
    
    // Generate burndown data
    const backlogBurndown = sprints.map(sprint => ({
      sprintNumber: sprint.sprintNumber,
      remainingPoints: sprint.remainingBacklog
    }));
    
    // Generate KPI trends
    const kpiTrends = config.kpis.map(kpi => {
      const values = sprints.map((_, i) => {
        const startValue = kpi.value;
        const target = kpi.target || startValue * 1.2;
        const improvement = (target - startValue) / config.sprintsToSimulate;
        
        // For bug injection rate (lower is better), we reverse the improvement
        const isNegativeKpi = kpi.name.toLowerCase().includes('bug');
        
        let value: number;
        if (isNegativeKpi) {
          value = startValue - (improvement * i) * (Math.random() * 0.5 + 0.75);
        } else {
          value = startValue + (improvement * i) * (Math.random() * 0.5 + 0.75);
        }
        
        return Math.max(0, value);
      });
      
      return {
        kpiName: kpi.name,
        values
      };
    });
    
    // Calculate accelerator impact
    const withAccelerator = selectedAccelerator ? {
      averageVelocity: totalCompletedPoints / sprints.length,
      sprintsRequired: sprints.length,
      improvementPercentage: Math.round(acceleratorImpact * 100)
    } : null;
    
    const result: SprintSimulationResult = {
      sprints,
      totalDuration: sprints.length * 2, // 2 weeks per sprint
      averageVelocity: totalCompletedPoints / sprints.length,
      backlogBurndown,
      kpiTrends,
      withAccelerator
    };
    
    setSimulationResult(result);
    setActiveTab("results");
    
    toast({
      title: "Simulation completed",
      description: `Simulated ${sprints.length} sprints with average velocity of ${Math.round(result.averageVelocity)}.`
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sprint-Based Simulation</h2>
          <p className="text-muted-foreground">Simulate team performance over multiple sprints</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            Team Size: {config.teamSize}
          </Badge>
          <Button 
            variant="default" 
            onClick={runSimulation}
          >
            <Play className="mr-2 h-4 w-4" />
            Run Simulation
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="results" disabled={!simulationResult}>Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="setup" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <SprintTeamSetup
                    config={config}
                    updateConfig={updateConfig}
                    kpis={config.kpis}
                    updateKpis={updateKpis}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardContent className="pt-6">
                  <SprintSetupForm
                    config={config}
                    updateConfig={updateConfig}
                    availableAccelerators={availableAccelerators}
                    selectedAcceleratorId={config.acceleratorId}
                    onSelectAccelerator={selectAccelerator}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="results" className="mt-6">
          {simulationResult && (
            <SprintSimulationResults
              result={simulationResult}
              config={config}
              accelerator={selectedAccelerator}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SprintSimulator;
