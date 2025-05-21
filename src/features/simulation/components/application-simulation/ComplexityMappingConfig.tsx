
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
import { ComplexityMapping } from "../../types/application-simulation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GenAIAccelerator } from "@/features/genai/types";
import { Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ComplexityMappingConfigProps {
  mapping: ComplexityMapping;
  onUpdateMapping: (mapping: ComplexityMapping) => void;
  teamSize: number;
  onUpdateTeamSize: (size: number) => void;
  availableAccelerators: GenAIAccelerator[];
  selectedAcceleratorId: string | null;
  onSelectAccelerator: (id: string | null) => void;
  hoursPerSprint: number;
}

const ComplexityMappingConfig: React.FC<ComplexityMappingConfigProps> = ({
  mapping,
  onUpdateMapping,
  teamSize,
  onUpdateTeamSize,
  availableAccelerators,
  selectedAcceleratorId,
  onSelectAccelerator,
  hoursPerSprint
}) => {
  const form = useForm({
    defaultValues: {
      ...mapping,
      teamSize,
      acceleratorId: selectedAcceleratorId || ''
    }
  });

  const handleComplexityChange = (complexity: keyof ComplexityMapping, value: number) => {
    const newMapping = { ...mapping, [complexity]: value };
    onUpdateMapping(newMapping);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <h3 className="text-lg font-medium">Simulation Settings</h3>
        <Tooltip>
          <TooltipTrigger>
            <Info size={16} className="text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-sm">
            <p>Configure how story points map to hours of work based on complexity levels, and set up your team parameters.</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      <Form {...form}>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-3">Hours per Story Point</h4>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="low"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Low Complexity</FormLabel>
                      <span className="text-sm font-medium">{mapping.low} hours</span>
                    </div>
                    <FormControl>
                      <Input
                        type="number" 
                        min="1"
                        max="8"
                        value={mapping.low}
                        onChange={(e) => handleComplexityChange('low', Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="medium"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Medium Complexity</FormLabel>
                      <span className="text-sm font-medium">{mapping.medium} hours</span>
                    </div>
                    <FormControl>
                      <Input
                        type="number" 
                        min="2"
                        max="16"
                        value={mapping.medium}
                        onChange={(e) => handleComplexityChange('medium', Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="high"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>High Complexity</FormLabel>
                      <span className="text-sm font-medium">{mapping.high} hours</span>
                    </div>
                    <FormControl>
                      <Input
                        type="number" 
                        min="4"
                        max="40"
                        value={mapping.high}
                        onChange={(e) => handleComplexityChange('high', Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-3">Team Configuration</h4>
            
            <FormField
              control={form.control}
              name="teamSize"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Team Size</FormLabel>
                    <span className="text-sm font-medium">{teamSize} members</span>
                  </div>
                  <FormControl>
                    <Slider
                      min={1}
                      max={20}
                      step={1}
                      value={[teamSize]}
                      onValueChange={(values) => onUpdateTeamSize(values[0])}
                    />
                  </FormControl>
                  <FormDescription>
                    Team capacity: {teamSize * hoursPerSprint} hours per sprint
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="acceleratorId"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>GenAI Accelerator</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      onSelectAccelerator(value || null);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an accelerator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {availableAccelerators.map(acc => (
                        <SelectItem key={acc.id} value={acc.id}>
                          {acc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Apply a GenAI accelerator to boost productivity
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        </div>
      </Form>
    </div>
  );
};

export default ComplexityMappingConfig;
