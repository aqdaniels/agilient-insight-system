
import React from 'react';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProcessParameters } from "../../types";
import { useForm } from "react-hook-form";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoCircle } from "lucide-react";
import { Badge } from "@/components/design-system";

interface ProcessParametersProps {
  processParams: ProcessParameters;
  updateScenario: (updates: Partial<ProcessParameters>) => void;
}

const ProcessParametersComponent: React.FC<ProcessParametersProps> = ({
  processParams,
  updateScenario,
}) => {
  const form = useForm({
    defaultValues: { ...processParams }
  });

  const handleChange = (field: keyof ProcessParameters, value: any) => {
    updateScenario({ [field]: value });
    form.setValue(field, value);
  };

  const sprintLengthOptions = [
    { value: 1, label: "1 Week" },
    { value: 2, label: "2 Weeks" },
    { value: 3, label: "3 Weeks" },
    { value: 4, label: "4 Weeks" },
  ];

  // Benchmark indicators based on industry standards
  const getBenchmarkIndicator = (field: keyof ProcessParameters): { text: string; color: string } => {
    switch (field) {
      case 'ceremonyOverhead':
        if (processParams.ceremonyOverhead <= 0.08) return { text: "Minimal", color: "success" };
        if (processParams.ceremonyOverhead <= 0.15) return { text: "Average", color: "info" };
        return { text: "High", color: "warning" };
        
      case 'workItemAgingEffect':
        if (processParams.workItemAgingEffect <= 0.03) return { text: "Low", color: "success" };
        if (processParams.workItemAgingEffect <= 0.1) return { text: "Average", color: "info" };
        return { text: "Significant", color: "warning" };
        
      case 'contextSwitchingImpact':
        if (processParams.contextSwitchingImpact <= 0.1) return { text: "Low", color: "success" };
        if (processParams.contextSwitchingImpact <= 0.2) return { text: "Average", color: "info" };
        return { text: "High", color: "warning" };
        
      default:
        return { text: "N/A", color: "default" };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <h2 className="text-lg font-medium">Process Parameters</h2>
        <Tooltip>
          <TooltipTrigger>
            <InfoCircle size={16} className="text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-sm">
            <p>Configure the parameters that define your development process and methodology. These settings determine how work flows through the system.</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      <Form {...form}>
        <div className="space-y-8">
          <FormField
            control={form.control}
            name="sprintLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sprint Length</FormLabel>
                <Select
                  value={processParams.sprintLength.toString()}
                  onValueChange={(value) => handleChange('sprintLength', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sprint length" />
                  </SelectTrigger>
                  <SelectContent>
                    {sprintLengthOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Duration of each sprint in weeks
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ceremonyOverhead"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Ceremony Overhead</FormLabel>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getBenchmarkIndicator('ceremonyOverhead').color as any}>
                      {getBenchmarkIndicator('ceremonyOverhead').text}
                    </Badge>
                    <span className="text-sm font-medium">{(processParams.ceremonyOverhead * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <FormControl>
                  <Slider
                    min={0}
                    max={0.3}
                    step={0.01}
                    defaultValue={[processParams.ceremonyOverhead]}
                    onValueChange={(values) => handleChange('ceremonyOverhead', values[0])}
                  />
                </FormControl>
                <FormDescription>
                  Percentage of time spent in meetings and ceremonies
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="workItemAgingEffect"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Work Item Aging Effect</FormLabel>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getBenchmarkIndicator('workItemAgingEffect').color as any}>
                      {getBenchmarkIndicator('workItemAgingEffect').text}
                    </Badge>
                    <span className="text-sm font-medium">{(processParams.workItemAgingEffect * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <FormControl>
                  <Slider
                    min={0}
                    max={0.3}
                    step={0.01}
                    defaultValue={[processParams.workItemAgingEffect]}
                    onValueChange={(values) => handleChange('workItemAgingEffect', values[0])}
                  />
                </FormControl>
                <FormDescription>
                  Additional cost per sprint that items remain incomplete
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contextSwitchingImpact"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Context Switching Impact</FormLabel>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getBenchmarkIndicator('contextSwitchingImpact').color as any}>
                      {getBenchmarkIndicator('contextSwitchingImpact').text}
                    </Badge>
                    <span className="text-sm font-medium">{(processParams.contextSwitchingImpact * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <FormControl>
                  <Slider
                    min={0}
                    max={0.5}
                    step={0.05}
                    defaultValue={[processParams.contextSwitchingImpact]}
                    onValueChange={(values) => handleChange('contextSwitchingImpact', values[0])}
                  />
                </FormControl>
                <FormDescription>
                  Productivity loss when working on multiple tasks
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      </Form>
    </div>
  );
};

export default ProcessParametersComponent;
