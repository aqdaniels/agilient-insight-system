
import React from 'react';
import { useForm } from "react-hook-form";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SprintSimulationConfig } from "../../types/sprint-simulation";
import { GenAIAccelerator } from "@/features/genai/types";
import { Info, BarChart2, Settings2 } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/design-system";

interface SprintSetupFormProps {
  config: SprintSimulationConfig;
  updateConfig: (updates: Partial<SprintSimulationConfig>) => void;
  availableAccelerators: GenAIAccelerator[];
  selectedAcceleratorId: string | null;
  onSelectAccelerator: (id: string | null) => void;
}

const SprintSetupForm: React.FC<SprintSetupFormProps> = ({
  config,
  updateConfig,
  availableAccelerators,
  selectedAcceleratorId,
  onSelectAccelerator
}) => {
  const form = useForm({
    defaultValues: {
      ...config
    }
  });

  const handleSliderChange = (field: keyof SprintSimulationConfig, value: number) => {
    updateConfig({ [field]: value });
  };
  
  // Get the selected accelerator
  const selectedAccelerator = React.useMemo(() => {
    return availableAccelerators.find(acc => acc.id === selectedAcceleratorId);
  }, [availableAccelerators, selectedAcceleratorId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Settings2 size={18} className="text-primary" />
        <h3 className="text-lg font-medium">Simulation Settings</h3>
        <Tooltip>
          <TooltipTrigger>
            <Info size={16} className="text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-sm">
            <p>Configure the parameters for your sprint simulation. These settings determine how many sprints to run and how variable the team's velocity will be.</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      <Form {...form}>
        <div className="space-y-8">
          <FormField
            control={form.control}
            name="sprintsToSimulate"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Number of Sprints</FormLabel>
                  <span className="text-sm font-medium">{config.sprintsToSimulate} sprints</span>
                </div>
                <FormControl>
                  <Slider
                    min={4}
                    max={24}
                    step={1}
                    value={[config.sprintsToSimulate]}
                    onValueChange={(values) => handleSliderChange('sprintsToSimulate', values[0])}
                  />
                </FormControl>
                <FormDescription>
                  Maximum number of sprints to simulate (may finish earlier if backlog is completed)
                </FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="velocityVariability"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Velocity Variability</FormLabel>
                  <span className="text-sm font-medium">±{Math.round(config.velocityVariability * 100)}%</span>
                </div>
                <FormControl>
                  <Slider
                    min={0}
                    max={0.5}
                    step={0.05}
                    value={[config.velocityVariability]}
                    onValueChange={(values) => handleSliderChange('velocityVariability', values[0])}
                  />
                </FormControl>
                <FormDescription>
                  How much the team's velocity may vary sprint to sprint
                </FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="acceleratorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GenAI Accelerator</FormLabel>
                <Select
                  value={field.value || "none"}
                  onValueChange={(value) => {
                    field.onChange(value);
                    onSelectAccelerator(value === "none" ? null : value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an accelerator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Accelerator</SelectItem>
                    {availableAccelerators.map(acc => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Apply a GenAI accelerator to boost the team's productivity
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      </Form>
      
      {selectedAccelerator && (
        <div className="mt-4 border border-primary/20 rounded-md p-4 bg-primary/5">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-sm">{selectedAccelerator.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedAccelerator.description.length > 100 
                  ? selectedAccelerator.description.substring(0, 100) + '...'
                  : selectedAccelerator.description}
              </p>
            </div>
            <Badge variant="outline" className="ml-2 shrink-0">
              {Math.round(selectedAccelerator.effectivenessMultiplier * 10) / 10}x
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="text-xs">
              <span className="text-muted-foreground">Implementation: </span>
              <span className="font-medium">{selectedAccelerator.implementationCost}/5</span>
            </div>
            <div className="text-xs">
              <span className="text-muted-foreground">Training: </span>
              <span className="font-medium">{selectedAccelerator.trainingOverhead}/5</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6 border-t pt-6">
        <div className="flex items-center mb-4">
          <BarChart2 size={16} className="mr-2 text-primary" />
          <h3 className="font-medium">Simulation Preview</h3>
        </div>
        <div className="bg-muted/20 p-4 rounded-md space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Team Size</span>
            <span>{config.teamSize} members</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Baseline Velocity</span>
            <span>{config.baselineVelocity} points/sprint</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Backlog Size</span>
            <span>{config.initialBacklogSize} points</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estimated Duration</span>
            <span>
              ~{Math.ceil(config.initialBacklogSize / config.baselineVelocity)} sprints
              {selectedAccelerator && (
                <span className="text-success ml-1">
                  ({" "}
                  -{Math.round((1 - (1 / selectedAccelerator.effectivenessMultiplier)) * 100)}%
                  )
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SprintSetupForm;
