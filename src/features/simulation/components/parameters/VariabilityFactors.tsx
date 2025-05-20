import React from 'react';
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
import { SimulationScenario } from "../../types";
import { useForm } from "react-hook-form";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VariabilityFactorsProps {
  scenario: SimulationScenario;
  updateScenario: (updates: Partial<SimulationScenario>) => void;
}

const VariabilityFactors: React.FC<VariabilityFactorsProps> = ({
  scenario,
  updateScenario,
}) => {
  // We'll add some mock variability factors to the form
  // In a real application, these would be proper fields in the SimulationScenario
  const form = useForm({
    defaultValues: {
      velocityVariability: 0.2,
      estimationAccuracy: 0.7,
      interruptionProbability: 0.15,
      distributionType: "normal"
    }
  });

  const handleChange = (field: string, value: any) => {
    // In a real app, this would update specific fields in the scenario
    console.log(`Updated ${field} to ${value}`);
    
    // For demonstration purposes only
    if (field === "velocityVariability") {
      // This would be properly structured in a real application
      updateScenario({
        teamConfiguration: {
          ...scenario.teamConfiguration,
          velocityVariability: value
        } as any
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <h2 className="text-lg font-medium">Variability Factors</h2>
        <Tooltip>
          <TooltipTrigger>
            <Info size={16} className="text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-sm">
            <p>Configure how much natural variability exists in your team's performance and work patterns. These settings affect the uncertainty range in the simulation results.</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      <Form {...form}>
        <div className="space-y-8">
          <FormField
            control={form.control}
            name="distributionType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distribution Type</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleChange('distributionType', value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select distribution type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal (Gaussian)</SelectItem>
                    <SelectItem value="lognormal">Log-Normal</SelectItem>
                    <SelectItem value="uniform">Uniform</SelectItem>
                    <SelectItem value="triangular">Triangular</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Statistical distribution used for random variations
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
                  <FormLabel>Velocity Variability Range</FormLabel>
                  <span className="text-sm font-medium">±{(field.value * 100).toFixed(0)}%</span>
                </div>
                <FormControl>
                  <Slider
                    min={0}
                    max={0.5}
                    step={0.05}
                    defaultValue={[field.value]}
                    onValueChange={(values) => {
                      field.onChange(values[0]);
                      handleChange('velocityVariability', values[0]);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Expected fluctuation in team velocity between sprints
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimationAccuracy"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Estimation Accuracy</FormLabel>
                  <span className="text-sm font-medium">{(field.value * 100).toFixed(0)}%</span>
                </div>
                <FormControl>
                  <Slider
                    min={0.3}
                    max={1}
                    step={0.05}
                    defaultValue={[field.value]}
                    onValueChange={(values) => {
                      field.onChange(values[0]);
                      handleChange('estimationAccuracy', values[0]);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  How accurately the team estimates story points
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interruptionProbability"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Interruption Probability</FormLabel>
                  <span className="text-sm font-medium">{(field.value * 100).toFixed(0)}%</span>
                </div>
                <FormControl>
                  <Slider
                    min={0}
                    max={0.5}
                    step={0.05}
                    defaultValue={[field.value]}
                    onValueChange={(values) => {
                      field.onChange(values[0]);
                      handleChange('interruptionProbability', values[0]);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Likelihood of unplanned work arriving during a sprint
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      </Form>

      <Card className="bg-muted/50 border-dashed">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium mb-2">Uncertainty Modeling</h3>
          <p className="text-xs text-muted-foreground">
            These variability settings will be used to generate a range of possible outcomes through Monte Carlo simulation, giving you confidence intervals rather than single-point estimates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VariabilityFactors;
