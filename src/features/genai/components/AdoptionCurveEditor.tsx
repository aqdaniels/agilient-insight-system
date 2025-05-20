
import React, { useState, useEffect } from 'react';
import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart
} from "recharts";
import { GenAIAccelerator, CurveTemplate, AdoptionPoint } from '../types';
import { Button, Card } from '@/components/design-system';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface AdoptionCurveEditorProps {
  accelerator: GenAIAccelerator;
  onSave: (accelerator: GenAIAccelerator) => void;
}

const AdoptionCurveEditor: React.FC<AdoptionCurveEditorProps> = ({ accelerator, onSave }) => {
  const [editedAccelerator, setEditedAccelerator] = useState<GenAIAccelerator>({...accelerator});
  const [curveTemplate, setCurveTemplate] = useState<CurveTemplate>('custom');
  const [maxSprints, setMaxSprints] = useState(24);

  useEffect(() => {
    setEditedAccelerator({...accelerator});
  }, [accelerator]);

  const generateCurve = (template: CurveTemplate, maxTimePoint: number): AdoptionPoint[] => {
    const points: AdoptionPoint[] = [];
    
    switch (template) {
      case 'linear':
        for (let i = 0; i <= maxTimePoint; i += 2) {
          const effectivenessPercent = Math.min(100, (i / maxTimePoint) * 100);
          points.push({ timePoint: i, effectivenessPercent });
        }
        break;
        
      case 's-curve':
        for (let i = 0; i <= maxTimePoint; i += 2) {
          // Sigmoid function to create S-curve
          const normalized = i / maxTimePoint;
          const sigmoid = 1 / (1 + Math.exp(-10 * (normalized - 0.5)));
          const effectivenessPercent = sigmoid * 100;
          points.push({ timePoint: i, effectivenessPercent });
        }
        break;
        
      case 'exponential':
        for (let i = 0; i <= maxTimePoint; i += 2) {
          const normalized = i / maxTimePoint;
          const exp = (Math.exp(3 * normalized) - 1) / (Math.exp(3) - 1);
          const effectivenessPercent = exp * 100;
          points.push({ timePoint: i, effectivenessPercent });
        }
        break;
        
      case 'plateau':
        for (let i = 0; i <= maxTimePoint; i += 2) {
          let effectivenessPercent;
          if (i / maxTimePoint < 0.3) {
            effectivenessPercent = (i / (maxTimePoint * 0.3)) * 80;
          } else {
            effectivenessPercent = 80 + (i / maxTimePoint - 0.3) * 20 / 0.7;
          }
          effectivenessPercent = Math.min(100, effectivenessPercent);
          points.push({ timePoint: i, effectivenessPercent });
        }
        break;
        
      default:
        // Return the existing points for custom curve
        return [...editedAccelerator.adoptionCurve];
    }
    
    return points;
  };

  const handleTemplateChange = (template: CurveTemplate) => {
    setCurveTemplate(template);
    if (template !== 'custom') {
      const newCurve = generateCurve(template, maxSprints);
      setEditedAccelerator(prev => ({
        ...prev,
        adoptionCurve: newCurve
      }));
    }
  };

  const handleMaxSprintsChange = (value: number[]) => {
    const newMaxSprints = value[0];
    setMaxSprints(newMaxSprints);
    
    if (curveTemplate !== 'custom') {
      const newCurve = generateCurve(curveTemplate, newMaxSprints);
      setEditedAccelerator(prev => ({
        ...prev,
        adoptionCurve: newCurve
      }));
    }
  };

  const handlePointChange = (index: number, newValue: number) => {
    const newCurve = [...editedAccelerator.adoptionCurve];
    newCurve[index] = {
      ...newCurve[index],
      effectivenessPercent: Math.max(0, Math.min(100, newValue))
    };
    
    setEditedAccelerator(prev => ({
      ...prev,
      adoptionCurve: newCurve
    }));
    
    setCurveTemplate('custom');
  };

  const handleAddPoint = () => {
    const sortedCurve = [...editedAccelerator.adoptionCurve].sort((a, b) => a.timePoint - b.timePoint);
    const lastPoint = sortedCurve[sortedCurve.length - 1];
    const newTimePoint = lastPoint ? lastPoint.timePoint + 4 : 0;
    
    if (newTimePoint <= maxSprints) {
      const newPoint: AdoptionPoint = {
        timePoint: newTimePoint,
        effectivenessPercent: lastPoint ? lastPoint.effectivenessPercent : 0
      };
      
      setEditedAccelerator(prev => ({
        ...prev,
        adoptionCurve: [...prev.adoptionCurve, newPoint]
      }));
      
      setCurveTemplate('custom');
    }
  };

  const handleRemovePoint = (timePoint: number) => {
    // Don't allow removing if there are only 2 points or fewer
    if (editedAccelerator.adoptionCurve.length <= 2) {
      return;
    }
    
    setEditedAccelerator(prev => ({
      ...prev,
      adoptionCurve: prev.adoptionCurve.filter(point => point.timePoint !== timePoint)
    }));
    
    setCurveTemplate('custom');
  };

  const handleSave = () => {
    onSave(editedAccelerator);
  };
  
  // Sort adoption curve points by timePoint for the chart
  const sortedCurveData = [...editedAccelerator.adoptionCurve]
    .sort((a, b) => a.timePoint - b.timePoint)
    .map(point => ({
      sprint: point.timePoint,
      effectiveness: point.effectivenessPercent,
    }));
  
  // Add area chart color config
  const chartConfig = {
    adoption: {
      label: "Adoption Effectiveness",
      theme: {
        light: "#9b87f5",
        dark: "#9b87f5"
      }
    },
    area: {
      label: "Adoption Area",
      theme: {
        light: "#9b87f580",
        dark: "#9b87f540"
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card variant="default" padding="md">
            <h3 className="text-lg font-medium mb-6">Adoption Curve Visualization</h3>
            <div className="h-80">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sortedCurveData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                    <XAxis
                      dataKey="sprint"
                      label={{ value: 'Sprint', position: 'insideBottomRight', offset: -10 }}
                      tickFormatter={(value) => `${value}`}
                    />
                    <YAxis
                      tickFormatter={(value) => `${value}%`}
                      domain={[0, 100]}
                      label={{ value: 'Effectiveness', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip
                      content={<ChartTooltipContent />}
                      labelKey="sprint"
                      formatter={(value) => [`${value}%`, 'Effectiveness']}
                    />
                    <Area
                      type="monotone"
                      dataKey="effectiveness"
                      stroke="var(--color-adoption)"
                      fill="var(--color-area)"
                      strokeWidth={2}
                      activeDot={{
                        r: 8,
                        style: { cursor: 'pointer' }
                      }}
                    />
                    <ReferenceLine y={70} stroke="#FF9800" strokeDasharray="3 3" label="Target Efficiency" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card variant="default" padding="md">
            <h3 className="text-lg font-medium mb-4">Curve Settings</h3>
            
            <div className="space-y-4">
              <div>
                <Label>Curve Template</Label>
                <Select 
                  value={curveTemplate} 
                  onValueChange={(value) => handleTemplateChange(value as CurveTemplate)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom Curve</SelectItem>
                    <SelectItem value="linear">Linear Growth</SelectItem>
                    <SelectItem value="s-curve">S-Curve (Sigmoid)</SelectItem>
                    <SelectItem value="exponential">Exponential Growth</SelectItem>
                    <SelectItem value="plateau">Quick Rise & Plateau</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Time Horizon (Sprints): {maxSprints}</Label>
                <Slider
                  value={[maxSprints]}
                  min={8}
                  max={52}
                  step={4}
                  onValueChange={handleMaxSprintsChange}
                  className="mt-2"
                />
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Adoption Milestones</h4>
                {sortedCurveData.map((point, index) => (
                  <div key={`point-${point.sprint}`} className="flex items-center gap-2 mb-2">
                    <div className="w-16 text-sm">Sprint {point.sprint}:</div>
                    <div className="flex-1">
                      <Slider
                        value={[point.effectiveness]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) => handlePointChange(index, value[0])}
                      />
                    </div>
                    <div className="w-12 text-right text-sm">{Math.round(point.effectiveness)}%</div>
                    <button
                      type="button"
                      onClick={() => handleRemovePoint(point.sprint)}
                      disabled={editedAccelerator.adoptionCurve.length <= 2}
                      className="text-muted-foreground hover:text-destructive disabled:opacity-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18"></path>
                        <path d="M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  onClick={handleAddPoint}
                  variant="secondary"
                  size="sm"
                  className="mt-2"
                  disabled={sortedCurveData[sortedCurveData.length - 1]?.sprint >= maxSprints}
                >
                  Add Milestone
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-3">Adoption Insights</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card variant="bordered" padding="md">
            <p className="text-sm text-muted-foreground">Time to 50% Effectiveness</p>
            <p className="text-2xl font-semibold mt-1">
              {sortedCurveData.find(p => p.effectiveness >= 50)?.sprint || 'N/A'} sprints
            </p>
          </Card>
          
          <Card variant="bordered" padding="md">
            <p className="text-sm text-muted-foreground">Effectiveness at Sprint 12</p>
            <p className="text-2xl font-semibold mt-1">
              {sortedCurveData.find(p => p.sprint === 12)?.effectiveness.toFixed(0) || 
               sortedCurveData
                .filter(p => p.sprint < 12)
                .sort((a, b) => b.sprint - a.sprint)[0]?.effectiveness.toFixed(0) || 
                '0'}%
            </p>
          </Card>
          
          <Card variant="bordered" padding="md">
            <p className="text-sm text-muted-foreground">Peak Effectiveness</p>
            <p className="text-2xl font-semibold mt-1">
              {Math.max(...sortedCurveData.map(p => p.effectiveness)).toFixed(0)}%
            </p>
          </Card>
          
          <Card variant="bordered" padding="md">
            <p className="text-sm text-muted-foreground">Avg. Growth Per Sprint</p>
            <p className="text-2xl font-semibold mt-1">
              {(sortedCurveData.length > 1 
                ? (sortedCurveData[sortedCurveData.length-1].effectiveness - sortedCurveData[0].effectiveness) / 
                  (sortedCurveData[sortedCurveData.length-1].sprint - sortedCurveData[0].sprint || 1)
                : 0).toFixed(1)}%
            </p>
          </Card>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button type="button" onClick={handleSave} variant="primary">
          Save Adoption Curve
        </Button>
      </div>
    </div>
  );
};

export default AdoptionCurveEditor;
