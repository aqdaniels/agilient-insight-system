
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
import { Slider } from "@/components/ui/slider";
import { SprintSimulationConfig, AgileKPI } from "../../types/sprint-simulation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Plus, Users } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SprintTeamSetupProps {
  config: SprintSimulationConfig;
  updateConfig: (updates: Partial<SprintSimulationConfig>) => void;
  kpis: AgileKPI[];
  updateKpis: (kpis: AgileKPI[]) => void;
}

const SprintTeamSetup: React.FC<SprintTeamSetupProps> = ({
  config,
  updateConfig,
  kpis,
  updateKpis
}) => {
  const [isEditingKpi, setIsEditingKpi] = React.useState<number | null>(null);
  const [newKpi, setNewKpi] = React.useState<Omit<AgileKPI, 'name'> & { name: string }>({
    name: '',
    value: 0,
    target: 0,
    unit: ''
  });
  
  const form = useForm({
    defaultValues: {
      teamSize: config.teamSize,
      baselineVelocity: config.baselineVelocity,
      initialBacklogSize: config.initialBacklogSize
    }
  });

  const handleSliderChange = (field: keyof SprintSimulationConfig, value: number) => {
    updateConfig({ [field]: value });
  };

  const handleKpiChange = (index: number, field: keyof AgileKPI, value: any) => {
    const updatedKpis = [...kpis];
    updatedKpis[index] = { ...updatedKpis[index], [field]: value };
    updateKpis(updatedKpis);
  };

  const handleDeleteKpi = (index: number) => {
    const updatedKpis = kpis.filter((_, i) => i !== index);
    updateKpis(updatedKpis);
  };

  const handleAddKpi = () => {
    if (newKpi.name && newKpi.unit) {
      updateKpis([...kpis, { ...newKpi }]);
      setNewKpi({ name: '', value: 0, target: 0, unit: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Users size={18} className="mr-2 text-primary" />
        <h3 className="text-lg font-medium">Team Configuration</h3>
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
                  <span className="text-sm font-medium">{config.teamSize} members</span>
                </div>
                <FormControl>
                  <Slider
                    min={1}
                    max={15}
                    step={1}
                    value={[config.teamSize]}
                    onValueChange={(values) => handleSliderChange('teamSize', values[0])}
                  />
                </FormControl>
                <FormDescription>
                  Number of members working on the team
                </FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="baselineVelocity"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Baseline Velocity</FormLabel>
                  <span className="text-sm font-medium">{config.baselineVelocity} points/sprint</span>
                </div>
                <FormControl>
                  <Slider
                    min={5}
                    max={100}
                    step={5}
                    value={[config.baselineVelocity]}
                    onValueChange={(values) => handleSliderChange('baselineVelocity', values[0])}
                  />
                </FormControl>
                <FormDescription>
                  Average number of story points completed per sprint
                </FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="initialBacklogSize"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Initial Backlog Size</FormLabel>
                  <span className="text-sm font-medium">{config.initialBacklogSize} points</span>
                </div>
                <FormControl>
                  <Slider
                    min={50}
                    max={500}
                    step={10}
                    value={[config.initialBacklogSize]}
                    onValueChange={(values) => handleSliderChange('initialBacklogSize', values[0])}
                  />
                </FormControl>
                <FormDescription>
                  Total size of the backlog to be completed, in story points
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      </Form>
      
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Team KPIs</h3>
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  What are KPIs?
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="end" className="max-w-xs">
                <p>Key Performance Indicators (KPIs) are metrics that help track team performance. They will be tracked over the course of the simulation.</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>KPI Name</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kpis.map((kpi, index) => (
                <TableRow key={index} className="hover:bg-muted/10">
                  <TableCell className="font-medium">{kpi.name}</TableCell>
                  <TableCell>
                    {isEditingKpi === index ? (
                      <Input
                        type="number"
                        value={kpi.value}
                        onChange={(e) => handleKpiChange(index, 'value', Number(e.target.value))}
                        className="w-20 h-8 text-sm"
                      />
                    ) : (
                      kpi.value
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditingKpi === index ? (
                      <Input
                        type="number"
                        value={kpi.target || ''}
                        onChange={(e) => handleKpiChange(index, 'target', Number(e.target.value))}
                        className="w-20 h-8 text-sm"
                      />
                    ) : (
                      kpi.target || '—'
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditingKpi === index ? (
                      <Input
                        value={kpi.unit}
                        onChange={(e) => handleKpiChange(index, 'unit', e.target.value)}
                        className="w-24 h-8 text-sm"
                      />
                    ) : (
                      kpi.unit
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => isEditingKpi === index ? setIsEditingKpi(null) : setIsEditingKpi(index)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-destructive"
                        onClick={() => handleDeleteKpi(index)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {/* Add new KPI row */}
              <TableRow>
                <TableCell>
                  <Input
                    placeholder="KPI name"
                    value={newKpi.name}
                    onChange={(e) => setNewKpi(prev => ({ ...prev, name: e.target.value }))}
                    className="h-8 text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    placeholder="Value"
                    value={newKpi.value || ''}
                    onChange={(e) => setNewKpi(prev => ({ ...prev, value: Number(e.target.value) }))}
                    className="w-20 h-8 text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    placeholder="Target"
                    value={newKpi.target || ''}
                    onChange={(e) => setNewKpi(prev => ({ ...prev, target: Number(e.target.value) }))}
                    className="w-20 h-8 text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Unit"
                    value={newKpi.unit}
                    onChange={(e) => setNewKpi(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-24 h-8 text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleAddKpi}
                    disabled={!newKpi.name || !newKpi.unit}
                    className="h-8 px-2 gap-1 text-primary"
                  >
                    <Plus size={16} />
                    <span>Add</span>
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default SprintTeamSetup;
