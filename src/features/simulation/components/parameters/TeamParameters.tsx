import React from 'react';
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
import { TeamConfiguration } from "../../types";
import { useForm } from "react-hook-form";
import { Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TeamParametersProps {
  teamConfig: TeamConfiguration;
  updateScenario: (updates: Partial<TeamConfiguration>) => void;
}

const TeamParameters: React.FC<TeamParametersProps> = ({
  teamConfig,
  updateScenario,
}) => {
  const form = useForm({
    defaultValues: { ...teamConfig }
  });

  const handleChange = (field: keyof TeamConfiguration, value: any) => {
    updateScenario({ [field]: value });
    form.setValue(field, value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <h2 className="text-lg font-medium">Team Parameters</h2>
        <Tooltip>
          <TooltipTrigger>
            <Info size={16} className="text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-sm">
            <p>Configure your team's composition and capabilities. These parameters affect velocity calculations and resource allocation in the simulation.</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      <Form {...form}>
        <div className="space-y-8">
          <FormField
            control={form.control}
            name="teamSize"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Team Size</FormLabel>
                  <span className="text-sm font-medium">{teamConfig.teamSize}</span>
                </div>
                <FormControl>
                  <Slider
                    min={1}
                    max={20}
                    step={1}
                    defaultValue={[teamConfig.teamSize]}
                    onValueChange={(values) => handleChange('teamSize', values[0])}
                  />
                </FormControl>
                <FormDescription>
                  Number of team members working on the project
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="averageVelocity"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Average Velocity (Story Points/Sprint)</FormLabel>
                  <span className="text-sm font-medium">{teamConfig.averageVelocity}</span>
                </div>
                <FormControl>
                  <Slider
                    min={10}
                    max={100}
                    step={5}
                    defaultValue={[teamConfig.averageVelocity]}
                    onValueChange={(values) => handleChange('averageVelocity', values[0])}
                  />
                </FormControl>
                <FormDescription>
                  Historical average of story points completed per sprint
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="seniorityLevel"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Team Seniority Level</FormLabel>
                  <span className="text-sm font-medium">{(teamConfig.seniorityLevel * 100).toFixed(0)}%</span>
                </div>
                <FormControl>
                  <Slider
                    min={0}
                    max={1}
                    step={0.1}
                    defaultValue={[teamConfig.seniorityLevel]}
                    onValueChange={(values) => handleChange('seniorityLevel', values[0])}
                  />
                </FormControl>
                <FormDescription>
                  Average experience level (0% = Junior, 100% = Senior)
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="onboardingTime"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Onboarding Time (Sprints)</FormLabel>
                  <span className="text-sm font-medium">{teamConfig.onboardingTime}</span>
                </div>
                <FormControl>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    defaultValue={[teamConfig.onboardingTime]}
                    onValueChange={(values) => handleChange('onboardingTime', values[0])}
                  />
                </FormControl>
                <FormDescription>
                  Time required for new team members to reach full productivity
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="attritionRisk"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Attrition Risk</FormLabel>
                  <span className="text-sm font-medium">{(teamConfig.attritionRisk * 100).toFixed(0)}%</span>
                </div>
                <FormControl>
                  <Slider
                    min={0}
                    max={0.5}
                    step={0.05}
                    defaultValue={[teamConfig.attritionRisk]}
                    onValueChange={(values) => handleChange('attritionRisk', values[0])}
                  />
                </FormControl>
                <FormDescription>
                  Probability of team member departure during project
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      </Form>
    </div>
  );
};

export default TeamParameters;
