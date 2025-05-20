
import React, { useState } from "react";
import { SimulationParameters } from "../containers/SimulationDashboard";
import { Button } from "@/components/design-system";

interface SimulationControlsProps {
  parameters: SimulationParameters;
  onParametersChange: (params: Partial<SimulationParameters>) => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  parameters,
  onParametersChange
}) => {
  const [params, setParams] = useState<SimulationParameters>({ ...parameters });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    let newValue: any = value;
    
    if (type === 'number' || type === 'range') {
      newValue = parseFloat(value);
    } else if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    }
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setParams(prevParams => ({
        ...prevParams,
        [parent]: {
          ...prevParams[parent as keyof SimulationParameters],
          [child]: newValue
        }
      }));
    } else {
      setParams(prevParams => ({
        ...prevParams,
        [name]: newValue
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onParametersChange(params);
  };

  const handleReset = () => {
    setParams({ ...parameters });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Start Date</label>
          <input 
            type="date"
            name="startDate"
            value={params.startDate}
            onChange={handleChange}
            className="w-full border border-input rounded-md bg-transparent px-3 py-2 text-sm"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Risk Factor</label>
          <div className="flex items-center gap-2">
            <input 
              type="range"
              name="riskFactor"
              min="0"
              max="1"
              step="0.05"
              value={params.riskFactor}
              onChange={handleChange}
              className="w-full"
            />
            <span className="text-sm w-12">{params.riskFactor.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Variability Factor</label>
          <div className="flex items-center gap-2">
            <input 
              type="range"
              name="variabilityFactor"
              min="0"
              max="1"
              step="0.05"
              value={params.variabilityFactor}
              onChange={handleChange}
              className="w-full"
            />
            <span className="text-sm w-12">{params.variabilityFactor.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Prioritization Strategy</label>
          <select 
            name="prioritizationStrategy"
            value={params.prioritizationStrategy}
            onChange={handleChange}
            className="w-full border border-input rounded-md bg-transparent px-3 py-2 text-sm"
          >
            <option value="value-first">Value First</option>
            <option value="risk-first">Risk First</option>
            <option value="balanced">Balanced</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Max Team Size</label>
          <input 
            type="number"
            name="constraints.maxTeamSize"
            min="1"
            max="20"
            value={params.constraints.maxTeamSize}
            onChange={handleChange}
            className="w-full border border-input rounded-md bg-transparent px-3 py-2 text-sm"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Budget Cap ($)</label>
          <input 
            type="number"
            name="constraints.budgetCap"
            min="10000"
            step="5000"
            value={params.constraints.budgetCap}
            onChange={handleChange}
            className="w-full border border-input rounded-md bg-transparent px-3 py-2 text-sm"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Deadline Date</label>
          <input 
            type="date"
            name="constraints.deadlineDate"
            value={params.constraints.deadlineDate}
            onChange={handleChange}
            className="w-full border border-input rounded-md bg-transparent px-3 py-2 text-sm"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Simulation Iterations</label>
          <input 
            type="number"
            name="iterations"
            min="100"
            max="10000"
            step="100"
            value={params.iterations}
            onChange={handleChange}
            className="w-full border border-input rounded-md bg-transparent px-3 py-2 text-sm"
          />
          <p className="text-xs text-muted-foreground">Higher values = more accuracy, slower</p>
        </div>
        
        <div className="space-y-2 flex items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox"
              name="includeHistoricalData"
              checked={params.includeHistoricalData}
              onChange={handleChange}
              className="rounded border-input bg-transparent h-4 w-4"
            />
            <span className="text-sm font-medium">Include Historical Data</span>
          </label>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button
          type="submit"
          variant="primary"
        >
          Apply Changes
        </Button>
      </div>
    </form>
  );
};

export default SimulationControls;
