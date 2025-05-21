
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
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SimulationApplication, ComplexityMapping } from "../../types/application-simulation";
import { Calculator, Plus } from "lucide-react";

interface ApplicationFormProps {
  onAddApplication: (application: SimulationApplication) => void;
  complexityMapping: ComplexityMapping;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ 
  onAddApplication,
  complexityMapping
}) => {
  const form = useForm<Omit<SimulationApplication, 'id'>>({
    defaultValues: {
      name: '',
      hoursBreakdown: {
        development: 0,
        testing: 0,
        management: 0
      },
      totalHours: 0,
      complexity: 'medium'
    }
  });
  
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = form;
  
  // Watch hours breakdown to calculate total
  const devHours = watch('hoursBreakdown.development');
  const testHours = watch('hoursBreakdown.testing');
  const managementHours = watch('hoursBreakdown.management');
  const complexity = watch('complexity');
  
  React.useEffect(() => {
    const total = Number(devHours || 0) + Number(testHours || 0) + Number(managementHours || 0);
    setValue('totalHours', total);
    
    // Calculate story points based on complexity
    if (total > 0) {
      const hoursPerPoint = complexityMapping[complexity as keyof ComplexityMapping];
      const points = Math.ceil(total / hoursPerPoint);
      setValue('storyPoints', points);
    } else {
      setValue('storyPoints', 0);
    }
  }, [devHours, testHours, managementHours, complexity, complexityMapping, setValue]);
  
  const onSubmit = (data: Omit<SimulationApplication, 'id'>) => {
    onAddApplication(data as SimulationApplication);
    reset();
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Add Application</h3>
      </div>
      
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Application Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter application name" 
                    {...field} 
                    required
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="hoursBreakdown.development"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Development Hours</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      required
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="hoursBreakdown.testing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Testing Hours</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      required
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="hoursBreakdown.management"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Management Hours</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      required
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="complexity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complexity Level</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select complexity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Complexity</SelectItem>
                      <SelectItem value="medium">Medium Complexity</SelectItem>
                      <SelectItem value="high">High Complexity</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Low: {complexityMapping.low} hours/point | Medium: {complexityMapping.medium} hours/point | High: {complexityMapping.high} hours/point
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel>Summary</FormLabel>
              <div className="grid grid-cols-2 gap-2 p-3 bg-muted/20 rounded-md">
                <div className="text-sm">Total Hours:</div>
                <div className="text-sm font-medium">{form.watch('totalHours')}</div>
                
                <div className="text-sm">Story Points:</div>
                <div className="text-sm font-medium">{form.watch('storyPoints')}</div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={!form.watch('name') || form.watch('totalHours') <= 0}>
              <Plus className="mr-2 h-4 w-4" />
              Add Application
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ApplicationForm;
