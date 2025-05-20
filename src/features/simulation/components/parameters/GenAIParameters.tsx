
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
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { GenAIConfiguration } from "../../types";
import { useForm } from "react-hook-form";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Link, LineChart } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/design-system";

interface GenAIParametersProps {
  genAIConfig: GenAIConfiguration;
  updateScenario: (updates: Partial<GenAIConfiguration>) => void;
}

const GenAIParameters: React.FC<GenAIParametersProps> = ({
  genAIConfig,
  updateScenario,
}) => {
  // Mock accelerators that could be selected
  const availableAccelerators = [
    { id: "acc1", name: "Code Copilot Pro" },
    { id: "acc2", name: "Requirements Analyzer" },
    { id: "acc3", name: "Test Generation Suite" },
    { id: "acc4", name: "Documentation Assistant" },
    { id: "acc5", name: "Code Review AI" },
  ];
  
  const adoptionCurveTemplates = [
    { id: "linear", name: "Linear Adoption" },
    { id: "scurve", name: "S-Curve (Realistic)" },
    { id: "rapid", name: "Rapid Adoption" },
    { id: "slow", name: "Slow Adoption" },
    { id: "custom", name: "Custom" },
  ];

  const form = useForm({
    defaultValues: {
      accelerators: genAIConfig.accelerators || [],
      adoptionCurveTemplate: "scurve",
      effectivenessMultiplier: genAIConfig.effectivenessMultiplier,
      coveragePercentage: genAIConfig.coveragePercentage,
    }
  });

  const handleAcceleratorChange = (acceleratorId: string, checked: boolean) => {
    let updatedAccelerators = [...genAIConfig.accelerators];
    
    if (checked) {
      if (!updatedAccelerators.includes(acceleratorId)) {
        updatedAccelerators.push(acceleratorId);
      }
    } else {
      updatedAccelerators = updatedAccelerators.filter(id => id !== acceleratorId);
    }
    
    updateScenario({ accelerators: updatedAccelerators });
  };

  const handleValueChange = (field: keyof GenAIConfiguration, value: any) => {
    updateScenario({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <h2 className="text-lg font-medium">GenAI Acceleration Settings</h2>
        <Tooltip>
          <TooltipTrigger>
            <InfoCircle size={16} className="text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-sm">
            <p>Configure how AI tools will augment your team's capabilities. These settings determine the productivity impact of AI accelerators.</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      <Form {...form}>
        <div className="space-y-8">
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>Selected AI Accelerators</FormLabel>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                <Link className="mr-1 h-4 w-4" /> Link to GenAI Module
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {availableAccelerators.map(accelerator => (
                <div
                  key={accelerator.id}
                  className={`flex items-center p-2 rounded border ${
                    genAIConfig.accelerators.includes(accelerator.id)
                      ? 'bg-primary/10 border-primary'
                      : 'bg-background border-border'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={genAIConfig.accelerators.includes(accelerator.id)}
                    onChange={(e) => handleAcceleratorChange(accelerator.id, e.target.checked)}
                    id={`accelerator-${accelerator.id}`}
                  />
                  <label
                    htmlFor={`accelerator-${accelerator.id}`}
                    className="flex-grow cursor-pointer text-sm"
                  >
                    {accelerator.name}
                  </label>
                </div>
              ))}
            </div>
            <FormDescription className="mt-2">
              Select AI tools that will be used by the team
            </FormDescription>
          </FormItem>

          <FormField
            control={form.control}
            name="adoptionCurveTemplate"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Adoption Curve</FormLabel>
                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                    <LineChart className="mr-1 h-4 w-4" /> Edit Curve
                  </Button>
                </div>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    // In a real app, this would update the adoption points based on the template
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select adoption pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    {adoptionCurveTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  How quickly the team adopts the AI tools
                </FormDescription>
                
                <Card className="mt-3 bg-muted/20">
                  <CardContent className="p-3">
                    <div className="h-[100px] w-full flex items-end">
                      {/* Simple visual representation of the adoption curve */}
                      {genAIConfig.adoptionRate.map((point, index) => (
                        <div 
                          key={index} 
                          className="flex-1 bg-primary/70 mx-px rounded-t"
                          style={{ height: `${point.effectivenessPercent * 100}px` }}
                          title={`Sprint ${point.timePoint}: ${(point.effectivenessPercent * 100).toFixed(0)}%`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>Start</span>
                      <span>Time</span>
                      <span>End</span>
                    </div>
                  </CardContent>
                </Card>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="effectivenessMultiplier"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Effectiveness Multiplier</FormLabel>
                  <span className="text-sm font-medium">
                    {field.value.toFixed(1)}x
                    <Badge variant="success" className="ml-2">
                      {field.value >= 1.5 ? "High" : field.value >= 1.2 ? "Medium" : "Low"} Impact
                    </Badge>
                  </span>
                </div>
                <FormControl>
                  <Slider
                    min={1}
                    max={3}
                    step={0.1}
                    defaultValue={[field.value]}
                    onValueChange={(values) => {
                      field.onChange(values[0]);
                      handleValueChange('effectivenessMultiplier', values[0]);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Productivity multiplier at maximum effectiveness
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coveragePercentage"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Coverage Percentage</FormLabel>
                  <span className="text-sm font-medium">{(field.value * 100).toFixed(0)}%</span>
                </div>
                <FormControl>
                  <Slider
                    min={0}
                    max={1}
                    step={0.05}
                    defaultValue={[field.value]}
                    onValueChange={(values) => {
                      field.onChange(values[0]);
                      handleValueChange('coveragePercentage', values[0]);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Percentage of work that can benefit from AI acceleration
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      </Form>
    </div>
  );
};

export default GenAIParameters;
