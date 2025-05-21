
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ApplicationSimulationConfig, ApplicationSimulationResult, SimulationApplication, ComplexityMapping } from "../../types/application-simulation";
import ApplicationList from './ApplicationList';
import ApplicationForm from './ApplicationForm';
import ComplexityMappingConfig from './ComplexityMappingConfig';
import ApplicationSimulationResults from './ApplicationSimulationResults';
import { Badge } from "@/components/design-system";
import { GenAIAccelerator } from "@/features/genai/types";
import { Plus, Play } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ApplicationSimulatorProps {
  availableAccelerators?: GenAIAccelerator[];
}

const ApplicationSimulator: React.FC<ApplicationSimulatorProps> = ({ 
  availableAccelerators = []
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("configure");
  
  const [config, setConfig] = useState<ApplicationSimulationConfig>({
    applications: [],
    teamSize: 5,
    acceleratorId: null,
    complexityMapping: {
      low: 2, // 2 hours per story point for low complexity
      medium: 4,
      high: 8
    },
    hoursPerSprint: 80, // 8 hours * 10 days
    sprintLength: 2 // 2 weeks
  });
  
  const [simulationResult, setSimulationResult] = useState<ApplicationSimulationResult | null>(null);
  const [selectedAccelerator, setSelectedAccelerator] = useState<GenAIAccelerator | null>(null);

  const addApplication = (application: SimulationApplication) => {
    setConfig(prev => ({
      ...prev,
      applications: [...prev.applications, { ...application, id: uuidv4() }]
    }));
    
    toast({
      title: "Application added",
      description: `"${application.name}" has been added to the simulation.`
    });
  };

  const removeApplication = (applicationId: string) => {
    setConfig(prev => ({
      ...prev,
      applications: prev.applications.filter(app => app.id !== applicationId)
    }));
  };

  const updateTeamSize = (size: number) => {
    setConfig(prev => ({
      ...prev,
      teamSize: size
    }));
  };

  const updateComplexityMapping = (mapping: ComplexityMapping) => {
    setConfig(prev => ({
      ...prev,
      complexityMapping: mapping
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

  const runSimulation = () => {
    if (config.applications.length === 0) {
      toast({
        title: "Cannot run simulation",
        description: "Please add at least one application to simulate.",
        variant: "destructive"
      });
      return;
    }

    // Calculate total hours across all applications
    const totalHours = config.applications.reduce((sum, app) => sum + app.totalHours, 0);
    
    // Calculate story points based on complexity mapping
    const totalStoryPoints = config.applications.reduce((sum, app) => {
      const hoursPerPoint = config.complexityMapping[app.complexity];
      return sum + Math.ceil(app.totalHours / hoursPerPoint);
    }, 0);
    
    // Calculate sprints required without accelerator
    const hoursPerTeamPerSprint = config.hoursPerSprint * config.teamSize;
    const sprintsRequired = Math.ceil(totalHours / hoursPerTeamPerSprint);
    
    // Calculate application breakdown
    const applicationBreakdown = config.applications.map(app => {
      const appSprints = Math.ceil((app.totalHours / totalHours) * sprintsRequired);
      return {
        applicationId: app.id,
        name: app.name,
        sprints: appSprints
      };
    });
    
    // Calculate with accelerator if selected
    let withAccelerator = null;
    if (selectedAccelerator) {
      // Apply accelerator impact - simplified calculation for demo
      const acceleratorImpact = selectedAccelerator.implementationCost > 2 ? 0.75 : 0.85; // Higher cost = more savings
      const acceleratedSprints = Math.ceil(sprintsRequired * acceleratorImpact);
      const timeSaved = sprintsRequired - acceleratedSprints;
      
      withAccelerator = {
        sprintsRequired: acceleratedSprints,
        totalDuration: acceleratedSprints * config.sprintLength,
        timeSaved: timeSaved * config.sprintLength // in weeks
      };
    }
    
    const result: ApplicationSimulationResult = {
      totalStoryPoints,
      totalHours,
      sprintsRequired,
      totalDuration: sprintsRequired * config.sprintLength,
      applicationBreakdown,
      withAccelerator
    };
    
    setSimulationResult(result);
    setActiveTab("results");
    
    toast({
      title: "Simulation completed",
      description: `Estimated ${sprintsRequired} sprints required for ${config.applications.length} applications.`
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Application-Based Simulation</h2>
          <p className="text-muted-foreground">Estimate delivery timeline for applications</p>
        </div>
        <div className="flex items-center gap-2">
          {config.applications.length > 0 && (
            <Badge variant="outline">
              {config.applications.length} Application{config.applications.length !== 1 ? 's' : ''}
            </Badge>
          )}
          <Button 
            variant="primary" 
            onClick={runSimulation}
            disabled={config.applications.length === 0}
          >
            <Play className="mr-2 h-4 w-4" />
            Run Simulation
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="configure">Configure</TabsTrigger>
          <TabsTrigger value="results" disabled={!simulationResult}>Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="configure" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <ApplicationForm 
                    onAddApplication={addApplication}
                    complexityMapping={config.complexityMapping}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <ApplicationList 
                    applications={config.applications}
                    onRemoveApplication={removeApplication}
                    complexityMapping={config.complexityMapping}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardContent className="pt-6">
                  <ComplexityMappingConfig
                    mapping={config.complexityMapping}
                    onUpdateMapping={updateComplexityMapping}
                    teamSize={config.teamSize}
                    onUpdateTeamSize={updateTeamSize}
                    availableAccelerators={availableAccelerators}
                    selectedAcceleratorId={config.acceleratorId}
                    onSelectAccelerator={selectAccelerator}
                    hoursPerSprint={config.hoursPerSprint}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="results" className="mt-6">
          {simulationResult && (
            <ApplicationSimulationResults 
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

export default ApplicationSimulator;
