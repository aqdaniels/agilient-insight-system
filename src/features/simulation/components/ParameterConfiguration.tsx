
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { SimulationScenario } from "../types";
import TeamParameters from './parameters/TeamParameters';
import ProcessParameters from './parameters/ProcessParameters';
import VariabilityFactors from './parameters/VariabilityFactors';
import ExternalFactors from './parameters/ExternalFactors';
import GenAIParameters from './parameters/GenAIParameters';

interface ParameterConfigurationProps {
  scenario: SimulationScenario;
  updateScenario: (updates: Partial<SimulationScenario>) => void;
}

const ParameterConfiguration: React.FC<ParameterConfigurationProps> = ({
  scenario,
  updateScenario,
}) => {
  const [activeTab, setActiveTab] = useState("team");

  return (
    <div className="space-y-6">
      <Tabs defaultValue="team" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="process">Process</TabsTrigger>
          <TabsTrigger value="variability">Variability</TabsTrigger>
          <TabsTrigger value="external">External</TabsTrigger>
          <TabsTrigger value="genai">GenAI</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="team" className="mt-0">
            <TeamParameters
              teamConfig={scenario.teamConfiguration}
              updateScenario={(teamConfig) => updateScenario({ teamConfiguration: { ...scenario.teamConfiguration, ...teamConfig } })}
            />
          </TabsContent>
          
          <TabsContent value="process" className="mt-0">
            <ProcessParameters
              processParams={scenario.processParameters}
              updateScenario={(processParams) => updateScenario({ processParameters: { ...scenario.processParameters, ...processParams } })}
            />
          </TabsContent>
          
          <TabsContent value="variability" className="mt-0">
            <VariabilityFactors
              scenario={scenario}
              updateScenario={updateScenario}
            />
          </TabsContent>
          
          <TabsContent value="external" className="mt-0">
            <ExternalFactors
              scenario={scenario}
              updateScenario={updateScenario}
            />
          </TabsContent>
          
          <TabsContent value="genai" className="mt-0">
            <GenAIParameters
              genAIConfig={scenario.genAIConfiguration}
              updateScenario={(genAIConfig) => updateScenario({ genAIConfiguration: { ...scenario.genAIConfiguration, ...genAIConfig } })}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ParameterConfiguration;
