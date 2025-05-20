
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
import { Checkbox } from "@/components/ui/checkbox";
import { SimulationScenario } from "../../types";
import { useForm } from "react-hook-form";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoCircle, Calendar, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExternalFactorsProps {
  scenario: SimulationScenario;
  updateScenario: (updates: Partial<SimulationScenario>) => void;
}

interface HolidayPeriod {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  impact: number;
}

const ExternalFactors: React.FC<ExternalFactorsProps> = ({
  scenario,
  updateScenario,
}) => {
  // Mock holidays - in a real app this would be part of the scenario state
  const [holidays, setHolidays] = useState<HolidayPeriod[]>([
    { id: '1', name: 'Winter Break', startDate: new Date(2025, 11, 20), endDate: new Date(2026, 0, 3), impact: 0.9 },
    { id: '2', name: 'Spring Holiday', startDate: new Date(2025, 3, 10), endDate: new Date(2025, 3, 13), impact: 0.7 },
  ]);

  const form = useForm({
    defaultValues: {
      includeHolidays: scenario.simulationParameters.includeHolidays,
      includePTOEffect: scenario.simulationParameters.includePTOEffect,
      averagePTODays: 20, // Mock value
      trainingDays: 5, // Mock value
    }
  });

  const handleCheckboxChange = (field: string, checked: boolean) => {
    if (field === 'includeHolidays' || field === 'includePTOEffect') {
      updateScenario({
        simulationParameters: {
          ...scenario.simulationParameters,
          [field]: checked
        }
      });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <h2 className="text-lg font-medium">External Factors</h2>
        <Tooltip>
          <TooltipTrigger>
            <InfoCircle size={16} className="text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-sm">
            <p>Configure external factors that impact team availability and productivity, such as holidays, time off, and training.</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      <Form {...form}>
        <div className="space-y-8">
          <FormField
            control={form.control}
            name="includeHolidays"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      handleCheckboxChange('includeHolidays', !!checked);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Include Holiday/Time Off Calendar</FormLabel>
                  <FormDescription>
                    Account for company holidays and planned time off
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          {form.watch('includeHolidays') && (
            <Card className="bg-muted/20">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Holiday Calendar</h3>
                  <Button size="sm" variant="outline">
                    <Calendar className="mr-1 h-4 w-4" /> Import Calendar
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {holidays.map(holiday => (
                    <div key={holiday.id} className="flex justify-between items-center p-2 bg-background rounded border">
                      <div>
                        <p className="font-medium text-sm">{holiday.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(holiday.startDate)} - {formatDate(holiday.endDate)}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs mr-2">
                          Impact: {(holiday.impact * 100).toFixed(0)}%
                        </span>
                        <Button variant="ghost" size="sm">
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button className="w-full" variant="outline" size="sm">
                    <Plus className="mr-1 h-4 w-4" /> Add Holiday Period
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <FormField
            control={form.control}
            name="includePTOEffect"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      handleCheckboxChange('includePTOEffect', !!checked);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Model PTO/Training Effects</FormLabel>
                  <FormDescription>
                    Include the impact of personal time off and training days
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          {form.watch('includePTOEffect') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="averagePTODays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average PTO Days per Team Member</FormLabel>
                    <FormControl>
                      <input
                        type="number"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={field.value}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        min={0}
                        max={30}
                      />
                    </FormControl>
                    <FormDescription>
                      Annual average per person
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="trainingDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Training Days per Year</FormLabel>
                    <FormControl>
                      <input
                        type="number"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={field.value}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        min={0}
                        max={20}
                      />
                    </FormControl>
                    <FormDescription>
                      Days allocated to professional development
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          )}
          
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-2">Onboarding and Attrition</h3>
              <p className="text-xs text-muted-foreground">
                Team composition changes are configured in the Team Parameters section. You've set onboarding time to {scenario.teamConfiguration.onboardingTime} sprints and attrition risk to {(scenario.teamConfiguration.attritionRisk * 100).toFixed(0)}%.
              </p>
            </CardContent>
          </Card>
        </div>
      </Form>
    </div>
  );
};

export default ExternalFactors;
