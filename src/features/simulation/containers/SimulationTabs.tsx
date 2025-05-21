
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
import { useAppContext } from '@/contexts/AppContext';
import WorkflowActions from '@/components/navigation/WorkflowActions';

const SimulationTabs: React.FC = () => {
  const { accelerators } = useAppContext();
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

      <WorkflowActions />

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
              <ApplicationSimulator availableAccelerators={accelerators} />
            </Card>
          </TabsContent>
          
          <TabsContent value="sprint-based" className="mt-0 space-y-6">
            <Card className="p-6">
              <SprintSimulator availableAccelerators={accelerators} />
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default SimulationTabs;
