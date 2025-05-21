
import React from 'react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormDescription 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/design-system";
import { SimulationScenario, scenarioTemplates } from "../types";
import { useForm } from "react-hook-form";
import { PlusCircle, Tag, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ScenarioDefinitionProps {
  scenario: SimulationScenario;
  updateScenario: (updates: Partial<SimulationScenario>) => void;
}

const ScenarioDefinition: React.FC<ScenarioDefinitionProps> = ({ 
  scenario, 
  updateScenario 
}) => {
  const form = useForm({
    defaultValues: {
      name: scenario.name,
      description: scenario.description,
      baselineScenarioId: scenario.baselineScenarioId || "",
      projectId: scenario.projectId,
      tags: scenario.tags,
    }
  });

  const handleChange = (field: string, value: any) => {
    updateScenario({ [field]: value });
    form.setValue(field as any, value);
  };

  const addTag = (tag: string) => {
    if (!tag || scenario.tags.includes(tag)) return;
    const newTags = [...scenario.tags, tag];
    updateScenario({ tags: newTags });
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = scenario.tags.filter(tag => tag !== tagToRemove);
    updateScenario({ tags: newTags });
  };

  const applyTemplate = (templateName: string) => {
    const template = scenarioTemplates.find(t => t.name === templateName);
    if (template) {
      handleChange('name', template.name);
      handleChange('description', template.description);
    }
  };

  // Mock baseline scenarios (in a real app, these would come from an API)
  const baselineScenarios = [
    { id: "baseline1", name: "Current Sprint Model" },
    { id: "baseline2", name: "Pre-AI Workflow" },
    { id: "baseline3", name: "Standard Process" }
  ];

  // Mock projects (in a real app, these would come from an API)
  const projects = [
    { id: "proj1", name: "Website Redesign" },
    { id: "proj2", name: "Mobile App Development" },
    { id: "proj3", name: "Backend Modernization" }
  ];

  return (
    <div className="space-y-6">
      <Form {...form}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scenario Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter scenario name" 
                      value={scenario.name} 
                      onChange={(e) => handleChange('name', e.target.value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter scenario description" 
                      rows={4}
                      value={scenario.description} 
                      onChange={(e) => handleChange('description', e.target.value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="baselineScenarioId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Baseline Scenario</FormLabel>
                  <Select 
                    value={scenario.baselineScenarioId || "none"} 
                    onValueChange={(value) => handleChange('baselineScenarioId', value === "none" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select baseline scenario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No baseline</SelectItem>
                      {baselineScenarios.map((base) => (
                        <SelectItem key={base.id} value={base.id}>
                          {base.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select a baseline scenario to compare results against
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Associated Project</FormLabel>
                  <Select 
                    value={scenario.projectId || "none"} 
                    onValueChange={(value) => handleChange('projectId', value === "none" ? "" : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No project</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Tags</FormLabel>
              <div className="flex flex-wrap gap-2 mt-2">
                {scenario.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
                <div className="relative">
                  <Input
                    placeholder="Add tag..."
                    className="max-w-[120px]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="absolute right-0 top-0 h-full"
                    onClick={(e) => {
                      const input = e.currentTarget.previousSibling as HTMLInputElement;
                      addTag(input.value);
                      input.value = '';
                    }}
                  >
                    <PlusCircle size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>

      <div className="border-t pt-4">
        <h3 className="text-sm font-medium mb-3">Template Suggestions</h3>
        <div className="flex flex-wrap gap-2">
          {scenarioTemplates.map((template) => (
            <Button 
              key={template.name}
              variant="outline" 
              size="sm"
              onClick={() => applyTemplate(template.name)}
            >
              {template.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Version History</h3>
          <Button variant="ghost" size="sm">
            <History size={16} className="mr-1" /> View All
          </Button>
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          <div className="flex items-center">
            <span>Last modified: {scenario.lastModified.toLocaleString()}</span>
          </div>
          <div className="flex items-center mt-1">
            <span>Created: {scenario.createdAt.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioDefinition;
