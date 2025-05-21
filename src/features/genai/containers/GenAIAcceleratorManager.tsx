
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GenAIAccelerator } from '../types';
import AcceleratorDefinition from '../components/AcceleratorDefinition';
import AdoptionCurveEditor from '../components/AdoptionCurveEditor';
import ROIAnalysisDashboard from '../components/ROIAnalysisDashboard';
import ComparisonView from '../components/ComparisonView';
import { Button, Card } from '@/components/design-system';
import { Plus } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import WorkflowActions from '@/components/navigation/WorkflowActions';

const GenAIAcceleratorManager: React.FC = () => {
  const { 
    accelerators: globalAccelerators, 
    addAccelerator: addGlobalAccelerator,
    updateAccelerator: updateGlobalAccelerator,
    selectedAcceleratorId: globalSelectedId,
    setSelectedAcceleratorId: setGlobalSelectedId
  } = useAppContext();
  
  const [accelerators, setAccelerators] = useState<GenAIAccelerator[]>([]);
  const [selectedAccelerator, setSelectedAccelerator] = useState<GenAIAccelerator | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("definition");
  
  // Sync with global context
  useEffect(() => {
    setAccelerators(globalAccelerators);
    
    if (globalSelectedId) {
      const selected = globalAccelerators.find(acc => acc.id === globalSelectedId);
      if (selected) {
        setSelectedAccelerator(selected);
        setIsCreating(false);
      }
    }
  }, [globalAccelerators, globalSelectedId]);
  
  const handleCreateNew = () => {
    const newAccelerator: GenAIAccelerator = {
      id: uuidv4(),
      name: "New AI Accelerator",
      description: "",
      applicableSkills: [],
      taskTypeImpacts: {},
      adoptionCurve: [
        { timePoint: 0, effectivenessPercent: 0 },
        { timePoint: 4, effectivenessPercent: 30 },
        { timePoint: 8, effectivenessPercent: 70 },
        { timePoint: 12, effectivenessPercent: 90 }
      ],
      implementationCost: 0,
      trainingOverhead: 0,
      effectivenessMultiplier: 1.5,
      tags: [],
      aiCapabilities: []
    };
    
    setSelectedAccelerator(newAccelerator);
    setIsCreating(true);
    setActiveTab("definition");
  };
  
  const handleSaveAccelerator = (accelerator: GenAIAccelerator) => {
    if (isCreating) {
      addGlobalAccelerator(accelerator);
      setIsCreating(false);
    } else {
      updateGlobalAccelerator(accelerator);
    }
    setSelectedAccelerator(accelerator);
    setGlobalSelectedId(accelerator.id);
  };
  
  const handleSelectAccelerator = (accelerator: GenAIAccelerator) => {
    setSelectedAccelerator(accelerator);
    setGlobalSelectedId(accelerator.id);
    setIsCreating(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
          GenAI Accelerator Hub
        </h1>
        <Button 
          variant="primary" 
          onClick={handleCreateNew}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Create New Accelerator
        </Button>
      </div>
      
      <WorkflowActions />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card variant="default" padding="md" className="h-fit bg-background/70 backdrop-blur-sm">
            <h3 className="text-lg font-medium mb-3">AI Accelerators</h3>
            <div className="space-y-2">
              {accelerators.length === 0 ? (
                <div className="text-center p-4 text-muted-foreground">
                  No AI accelerators yet. Create your first one!
                </div>
              ) : (
                accelerators.map(acc => (
                  <div 
                    key={acc.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      selectedAccelerator?.id === acc.id 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => handleSelectAccelerator(acc)}
                  >
                    <div className="font-medium">{acc.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{acc.description.substring(0, 60)}...</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {acc.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                      {(acc.tags?.length || 0) > 2 && (
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                          +{(acc.tags?.length || 0) - 2}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {(selectedAccelerator || isCreating) ? (
            <Card variant="default" padding="lg" className="bg-background/70 backdrop-blur-sm">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="definition">Definition</TabsTrigger>
                  <TabsTrigger value="adoption">Adoption Curve</TabsTrigger>
                  <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
                  <TabsTrigger value="comparison">Comparison</TabsTrigger>
                </TabsList>
                
                <TabsContent value="definition" className="mt-0">
                  <AcceleratorDefinition 
                    accelerator={selectedAccelerator!} 
                    onSave={handleSaveAccelerator} 
                  />
                </TabsContent>
                
                <TabsContent value="adoption" className="mt-0">
                  <AdoptionCurveEditor 
                    accelerator={selectedAccelerator!} 
                    onSave={handleSaveAccelerator} 
                  />
                </TabsContent>
                
                <TabsContent value="roi" className="mt-0">
                  <ROIAnalysisDashboard accelerator={selectedAccelerator!} />
                </TabsContent>
                
                <TabsContent value="comparison" className="mt-0">
                  <ComparisonView 
                    accelerators={accelerators} 
                    selectedAcceleratorId={selectedAccelerator?.id}
                  />
                </TabsContent>
              </Tabs>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-96 border border-dashed rounded-lg bg-muted/30">
              <div className="text-center px-4 py-12 max-w-md">
                <h3 className="text-xl font-semibold mb-2">Welcome to GenAI Accelerator Hub</h3>
                <p className="text-muted-foreground mb-6">
                  Create or select an AI accelerator to visualize and quantify its impact on your development processes.
                </p>
                <Button 
                  variant="primary" 
                  onClick={handleCreateNew}
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Create New Accelerator
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenAIAcceleratorManager;
