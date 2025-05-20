
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Breadcrumbs, Badge } from "@/components/design-system";
import { Play, Save } from "lucide-react";

import ScenarioDefinition from '../components/ScenarioDefinition';
import ParameterConfiguration from '../components/ParameterConfiguration';
import SimulationControl from '../components/SimulationControl';
import QuickPreviewPanel from '../components/QuickPreviewPanel';
import { SimulationScenario } from "../types";
import { v4 as uuidv4 } from 'uuid';

// Initial empty scenario
const initialScenario: SimulationScenario = {
  id: uuidv4(),
  name: "",
  description: "",
  projectId: "",
  teamConfiguration: {
    teamSize: 5,
    skills: [],
    averageVelocity: 30,
    seniorityLevel: 0.6,
    onboardingTime: 2,
    attritionRisk: 0.1,
  },
  backlogConfiguration: {
    totalStoryPoints: 500,
    storyDistribution: {
      "feature": 60,
      "bug": 20,
      "tech-debt": 20
    },
    dependencies: [],
    prioritizationStrategy: "business-value",
  },
  genAIConfiguration: {
    accelerators: [],
    adoptionRate: [
      { timePoint: 0, effectivenessPercent: 0 },
      { timePoint: 3, effectivenessPercent: 0.5 },
      { timePoint: 6, effectivenessPercent: 0.8 },
    ],
    effectivenessMultiplier: 1.5,
    coveragePercentage: 0.7,
  },
  processParameters: {
    sprintLength: 2,
    ceremonyOverhead: 0.1,
    workItemAgingEffect: 0.05,
    contextSwitchingImpact: 0.15,
  },
  simulationParameters: {
    resolution: "sprint",
    iterationCount: 1000,
    confidenceInterval: 0.85,
    includeHolidays: true,
    includePTOEffect: true,
  },
  createdBy: "user",
  createdAt: new Date(),
  lastModified: new Date(),
  tags: [],
};

const SimulationSetup: React.FC = () => {
  const [scenario, setScenario] = useState<SimulationScenario>(initialScenario);
  const [activeTab, setActiveTab] = useState("definition");
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const handleSaveScenario = () => {
    // In a real app, this would save to backend
    setScenario({
      ...scenario,
      lastModified: new Date()
    });
    
    toast({
      title: "Scenario saved",
      description: `"${scenario.name}" has been successfully saved.`,
    });
  };

  const handleRunSimulation = () => {
    setIsRunning(true);
    
    // Simulate a delay for the simulation
    toast({
      title: "Simulation started",
      description: "Running simulation with the current parameters...",
    });
    
    setTimeout(() => {
      setIsRunning(false);
      toast({
        title: "Simulation completed",
        description: "Results are now available for analysis.",
      });
      
      // Navigate to results
      // In a real app, this would navigate to results view
    }, 3000);
  };

  const updateScenario = (updates: Partial<SimulationScenario>) => {
    setScenario(prev => ({
      ...prev,
      ...updates,
      lastModified: new Date()
    }));
  };

  const breadcrumbsItems = [
    { label: "Home", href: "/" },
    { label: "Simulation", href: "#" },
    { label: "Setup", href: "#" }
  ];

  return (
    <div className="container mx-auto py-6 space-y-8 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumbs items={breadcrumbsItems} />
          <h1 className="text-3xl font-bold mt-2">Simulation Setup</h1>
          <p className="text-muted-foreground">Configure and run delivery scenarios</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline"
            onClick={handleSaveScenario}
            leftIcon={<Save />}
          >
            Save Scenario
          </Button>
          <Button 
            variant="primary"
            onClick={handleRunSimulation}
            disabled={isRunning || !scenario.name}
            leftIcon={<Play />}
          >
            {isRunning ? "Running..." : "Run Simulation"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <Tabs defaultValue="definition" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="definition">Definition</TabsTrigger>
                <TabsTrigger value="parameters">Parameters</TabsTrigger>
                <TabsTrigger value="controls">Simulation Controls</TabsTrigger>
              </TabsList>
              
              <CardContent className="pt-6">
                <TabsContent value="definition" className="mt-0">
                  <ScenarioDefinition 
                    scenario={scenario} 
                    updateScenario={updateScenario} 
                  />
                </TabsContent>
                
                <TabsContent value="parameters" className="mt-0">
                  <ParameterConfiguration 
                    scenario={scenario} 
                    updateScenario={updateScenario} 
                  />
                </TabsContent>
                
                <TabsContent value="controls" className="mt-0">
                  <SimulationControl 
                    scenario={scenario} 
                    updateScenario={updateScenario} 
                    onRun={handleRunSimulation}
                    isRunning={isRunning}
                  />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <QuickPreviewPanel scenario={scenario} />
        </div>
      </div>
    </div>
  );
};

export default SimulationSetup;
