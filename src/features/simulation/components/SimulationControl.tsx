
import React, { useState } from 'react';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SimulationScenario } from "../types";
import { useForm } from "react-hook-form";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoCircle, Play, Settings2, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProgressBar } from "@/components/design-system";

interface SimulationControlProps {
  scenario: SimulationScenario;
  updateScenario: (updates: Partial<SimulationScenario>) => void;
  onRun: () => void;
  isRunning: boolean;
}

const SimulationControl: React.FC<SimulationControlProps> = ({
  scenario,
  updateScenario,
  onRun,
  isRunning,
}) => {
  const [progress, setProgress] = useState(0);
  
  const form = useForm({
    defaultValues: {
      resolution: scenario.simulationParameters.resolution,
      iterationCount: scenario.simulationParameters.iterationCount,
      confidenceInterval: scenario.simulationParameters.confidenceInterval,
      autoSave: true, // Mock value
    }
  });

  const handleChange = (field: keyof SimulationScenario['simulationParameters'], value: any) => {
    updateScenario({
      simulationParameters: {
        ...scenario.simulationParameters,
        [field]: value
      }
    });
  };

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRunning) {
      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + 3;
        });
      }, 100);
    } else {
      setProgress(0);
    }
    
    return () => clearInterval(timer);
  }, [isRunning]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <h2 className="text-lg font-medium">Simulation Controls</h2>
        <Tooltip>
          <TooltipTrigger>
            <InfoCircle size={16} className="text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-sm">
            <p>Configure the technical parameters of your simulation. These settings determine how the simulation is run and the level of detail in the results.</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      <Form {...form}>
        <div className="space-y-8">
          <FormField
            control={form.control}
            name="resolution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Simulation Resolution</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value: "day" | "week" | "sprint") => {
                    field.onChange(value);
                    handleChange('resolution', value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select simulation resolution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Daily</SelectItem>
                    <SelectItem value="week">Weekly</SelectItem>
                    <SelectItem value="sprint">Sprint-based</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Time granularity of simulation calculations
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="iterationCount"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Monte Carlo Iterations</FormLabel>
                  <span className="text-sm font-medium">{field.value}</span>
                </div>
                <FormControl>
                  <Slider
                    min={100}
                    max={10000}
                    step={100}
                    defaultValue={[field.value]}
                    onValueChange={(values) => {
                      field.onChange(values[0]);
                      handleChange('iterationCount', values[0]);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Higher values give more accurate statistical distributions but take longer
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confidenceInterval"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Confidence Interval</FormLabel>
                  <span className="text-sm font-medium">{(field.value * 100).toFixed(0)}%</span>
                </div>
                <FormControl>
                  <Slider
                    min={0.5}
                    max={0.99}
                    step={0.01}
                    defaultValue={[field.value]}
                    onValueChange={(values) => {
                      field.onChange(values[0]);
                      handleChange('confidenceInterval', values[0]);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Statistical confidence level for results reporting
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="autoSave"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Auto-save Results</FormLabel>
                  <FormDescription>
                    Automatically save simulation results
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </Form>

      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium">Run Simulation</h3>
          <Button variant="outline" size="sm">
            <Settings2 className="mr-1 h-4 w-4" /> Advanced Options
          </Button>
        </div>
        
        {isRunning ? (
          <Card className="border">
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Simulation in Progress</p>
                  <p className="text-sm text-muted-foreground">Running {scenario.simulationParameters.iterationCount} iterations...</p>
                </div>
                <Loader2 className="animate-spin text-muted-foreground" />
              </div>
              <ProgressBar value={progress} variant="primary" />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card className="bg-muted/20">
              <CardContent className="p-4">
                <p className="text-sm">
                  <strong>Simulation Details:</strong> {scenario.simulationParameters.iterationCount} iterations at {scenario.simulationParameters.resolution} resolution with {(scenario.simulationParameters.confidenceInterval * 100).toFixed(0)}% confidence interval.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Estimated runtime: {scenario.simulationParameters.iterationCount > 5000 ? "2-3" : "1-2"} minutes
                </p>
              </CardContent>
            </Card>
            
            <Button 
              className="w-full" 
              onClick={onRun}
              disabled={!scenario.name || isRunning}
            >
              <Play className="mr-2 h-4 w-4" /> Run Simulation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationControl;
