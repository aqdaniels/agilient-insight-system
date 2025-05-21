
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/design-system";
import SimulationSetup from './SimulationSetup';
import ApplicationSimulator from '../components/application-simulation/ApplicationSimulator';
import SprintSimulator from '../components/sprint-simulation/SprintSimulator';
import { 
  FileText, 
  BarChart2, 
  Calendar 
} from "lucide-react";
import { GenAIAccelerator } from "@/features/genai/types";

// Mock accelerators for demonstration
const mockAccelerators: GenAIAccelerator[] = [
  {
    id: "acc1",
    name: "Code Copilot Pro",
    description: "AI-powered code completion and generation tool that helps developers write code faster and with fewer errors.",
    applicableSkills: ["Frontend", "Backend"],
    taskTypeImpacts: { "development": 0.7, "testing": 0.3 },
    adoptionCurve: [
      { timePoint: 0, effectivenessPercent: 0 },
      { timePoint: 1, effectivenessPercent: 0.3 },
      { timePoint: 3, effectivenessPercent: 0.7 },
      { timePoint: 6, effectivenessPercent: 0.9 }
    ],
    implementationCost: 3,
    trainingOverhead: 2,
    effectivenessMultiplier: 1.6
  },
  {
    id: "acc2",
    name: "Documentation Assistant",
    description: "AI tool that automates creation of technical documentation, API references, and user guides based on code and requirements.",
    applicableSkills: ["Documentation", "Frontend", "Backend"],
    taskTypeImpacts: { "documentation": 0.8, "development": 0.2 },
    adoptionCurve: [
      { timePoint: 0, effectivenessPercent: 0 },
      { timePoint: 1, effectivenessPercent: 0.5 },
      { timePoint: 3, effectivenessPercent: 0.8 }
    ],
    implementationCost: 2,
    trainingOverhead: 1,
    effectivenessMultiplier: 1.4
  },
  {
    id: "acc3",
    name: "Test Generation Suite",
    description: "AI-powered testing tool that automatically generates test cases based on code changes and requirements.",
    applicableSkills: ["Testing", "QA"],
    taskTypeImpacts: { "testing": 0.9, "development": 0.1 },
    adoptionCurve: [
      { timePoint: 0, effectivenessPercent: 0 },
      { timePoint: 2, effectivenessPercent: 0.4 },
      { timePoint: 4, effectivenessPercent: 0.7 },
      { timePoint: 8, effectivenessPercent: 0.9 }
    ],
    implementationCost: 4,
    trainingOverhead: 3,
    effectivenessMultiplier: 1.7
  }
];

const SimulationTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("backlog-based");
  
  const breadcrumbsItems = [
    { label: "Home", href: "/" },
    { label: "Simulation", href: "#" },
    { label: "Setup", href: "#" }
  ];

  return (
    <div className="container mx-auto py-6 space-y-8 max-w-7xl">
      <div>
        <Breadcrumbs items={breadcrumbsItems} />
        <h1 className="text-3xl font-bold mt-2">Simulation Setup</h1>
        <p className="text-muted-foreground">Configure and run delivery scenarios</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="backlog-based" className="flex items-center gap-2">
            <FileText size={16} />
            <span>Backlog-Based</span>
          </TabsTrigger>
          <TabsTrigger value="application-based" className="flex items-center gap-2">
            <BarChart2 size={16} />
            <span>Application-Based</span>
          </TabsTrigger>
          <TabsTrigger value="sprint-based" className="flex items-center gap-2">
            <Calendar size={16} />
            <span>Sprint-Based</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="backlog-based" className="mt-0 space-y-6">
            <Card>
              <SimulationSetup />
            </Card>
          </TabsContent>
          
          <TabsContent value="application-based" className="mt-0 space-y-6">
            <Card className="p-6">
              <ApplicationSimulator availableAccelerators={mockAccelerators} />
            </Card>
          </TabsContent>
          
          <TabsContent value="sprint-based" className="mt-0 space-y-6">
            <Card className="p-6">
              <SprintSimulator availableAccelerators={mockAccelerators} />
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default SimulationTabs;
