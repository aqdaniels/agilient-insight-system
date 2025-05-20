
import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell
} from 'recharts';
import { GenAIAccelerator } from '../types';
import { Button, Card } from '@/components/design-system';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface ComparisonViewProps {
  accelerators: GenAIAccelerator[];
  selectedAcceleratorId?: string;
}

type ComparisonMetric = 'cost' | 'trainingOverhead' | 'timeToAdoption' | 'taskImpact' | 'applicableSkills' | 'roi';
type SortOrder = 'asc' | 'desc';

const ComparisonView: React.FC<ComparisonViewProps> = ({ accelerators, selectedAcceleratorId }) => {
  const [selectedAccelerators, setSelectedAccelerators] = useState<string[]>(
    selectedAcceleratorId ? [selectedAcceleratorId] : []
  );
  const [comparisonMetric, setComparisonMetric] = useState<ComparisonMetric>('roi');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  // Calculate derived metrics for each accelerator
  const acceleratorMetrics = useMemo(() => {
    return accelerators.map(accelerator => {
      // Calculate time to adoption (sprints to reach 70% effectiveness)
      const sortedCurve = [...accelerator.adoptionCurve].sort((a, b) => a.timePoint - b.timePoint);
      const timeToAdoption = sortedCurve.find(point => point.effectivenessPercent >= 70)?.timePoint || 
        (sortedCurve.length > 0 ? sortedCurve[sortedCurve.length - 1].timePoint : 0);
      
      // Calculate average task impact
      const avgTaskImpact = Object.values(accelerator.taskTypeImpacts).length > 0
        ? Object.values(accelerator.taskTypeImpacts).reduce((sum, val) => sum + val, 0) / Object.values(accelerator.taskTypeImpacts).length
        : 0;
      
      // Calculate skills coverage percentage
      const skillsCoverage = accelerator.applicableSkills.length;
      
      // Calculate simple ROI (benefit/cost)
      // This is a simplified ROI - we'd use more sophisticated logic in a real app
      const roi = avgTaskImpact * sortedCurve[sortedCurve.length - 1]?.effectivenessPercent / 
        (accelerator.implementationCost > 0 ? accelerator.implementationCost / 10000 : 1);
        
      return {
        id: accelerator.id,
        name: accelerator.name,
        implementationCost: accelerator.implementationCost,
        trainingOverhead: accelerator.trainingOverhead,
        timeToAdoption,
        taskImpact: avgTaskImpact,
        skillsCoverage,
        roi
      };
    });
  }, [accelerators]);
  
  // Filter selected accelerators
  const filteredAccelerators = useMemo(() => {
    if (selectedAccelerators.length === 0) return acceleratorMetrics;
    return acceleratorMetrics.filter(acc => selectedAccelerators.includes(acc.id));
  }, [acceleratorMetrics, selectedAccelerators]);
  
  // Sort accelerators based on comparison metric
  const sortedAccelerators = useMemo(() => {
    const sorted = [...filteredAccelerators];
    return sorted.sort((a, b) => {
      const aValue = a[comparisonMetric] || 0;
      const bValue = b[comparisonMetric] || 0;
      
      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  }, [filteredAccelerators, comparisonMetric, sortOrder]);
  
  // Toggle accelerator selection
  const toggleAccelerator = (id: string) => {
    setSelectedAccelerators(prev => {
      if (prev.includes(id)) {
        return prev.filter(accId => accId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Select all accelerators
  const selectAllAccelerators = () => {
    setSelectedAccelerators(accelerators.map(acc => acc.id));
  };
  
  // Clear selection
  const clearSelection = () => {
    setSelectedAccelerators([]);
  };
  
  // Generate comparison chart data
  const comparisonChartData = sortedAccelerators.map(acc => {
    const baseAccelerator = accelerators.find(a => a.id === acc.id);
    
    // Normalize values for radar chart (scale from 0-100)
    return {
      name: acc.name,
      cost: 100 - Math.min(100, (acc.implementationCost / 50000) * 100), // Inverse: lower cost is better
      training: 100 - Math.min(100, (acc.trainingOverhead / 5000) * 100), // Inverse: lower training overhead is better
      adoption: 100 - Math.min(100, (acc.timeToAdoption / 20) * 100), // Inverse: faster adoption is better
      impact: Math.min(100, acc.taskImpact * 50),
      skills: Math.min(100, acc.skillsCoverage * 20),
      roi: Math.min(100, acc.roi * 10),
      originalValues: {
        cost: acc.implementationCost,
        training: acc.trainingOverhead,
        adoption: acc.timeToAdoption,
        impact: acc.taskImpact,
        skills: acc.skillsCoverage,
        roi: acc.roi
      },
      id: acc.id
    };
  });
  
  // Generate bar chart data for the selected metric
  const barChartData = sortedAccelerators.map(acc => ({
    name: acc.name.length > 12 ? acc.name.substring(0, 12) + '...' : acc.name,
    value: acc[comparisonMetric],
    id: acc.id
  }));
  
  // Generate colors for accelerators
  const acceleratorColors = [
    "#9b87f5", "#1EAEDB", "#6DB65B", "#FF7555", "#EA7EC7", 
    "#B25FD5", "#53C8BB", "#E9A268", "#8870C1", "#F5C76D"
  ];

  // Chart configuration for radar chart
  const radarChartConfig = {
    radar: {
      label: "Radar Data",
      theme: {
        light: "#9b87f5",
        dark: "#9b87f5"
      }
    }
  };

  // Chart configuration for bar chart
  const barChartConfig = {
    bar: {
      label: "Metric",
      theme: {
        light: "#9b87f5",
        dark: "#9b87f5"
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={selectAllAccelerators}
          >
            Select All
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearSelection}
          >
            Clear Selection
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <Label className="mr-2">Compare by:</Label>
          <Select value={comparisonMetric} onValueChange={(v) => setComparisonMetric(v as ComparisonMetric)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="roi">ROI (Return on Investment)</SelectItem>
              <SelectItem value="cost">Implementation Cost</SelectItem>
              <SelectItem value="trainingOverhead">Training Overhead</SelectItem>
              <SelectItem value="timeToAdoption">Time to Adoption</SelectItem>
              <SelectItem value="taskImpact">Task Impact</SelectItem>
              <SelectItem value="applicableSkills">Applicable Skills</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as SortOrder)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Highest First</SelectItem>
              <SelectItem value="asc">Lowest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Accelerator Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 bg-muted/30 rounded-lg">
        {accelerators.length === 0 ? (
          <div className="col-span-full text-center p-4 text-muted-foreground">
            No AI accelerators available for comparison.
          </div>
        ) : (
          accelerators.map((acc, index) => (
            <div
              key={acc.id}
              className={`p-3 rounded-md border transition-colors cursor-pointer ${
                selectedAccelerators.includes(acc.id)
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-background hover:bg-muted/50'
              }`}
              onClick={() => toggleAccelerator(acc.id)}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: acceleratorColors[index % acceleratorColors.length] }} 
                />
                <div className="font-medium flex-1">{acc.name}</div>
                <Checkbox 
                  checked={selectedAccelerators.includes(acc.id)} 
                  onCheckedChange={() => toggleAccelerator(acc.id)}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1 pl-6">
                {acc.description.substring(0, 60)}...
              </div>
            </div>
          ))
        )}
      </div>
      
      {selectedAccelerators.length === 0 ? (
        <Card variant="default" padding="lg" className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Select AI Accelerators to Compare</h3>
            <p className="text-muted-foreground mb-4">
              Choose two or more accelerators from the list above to see a detailed comparison.
            </p>
            <Button variant="secondary" onClick={selectAllAccelerators}>
              Compare All Accelerators
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Comparison Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <Card variant="default" padding="md" className="bg-background/70 backdrop-blur-sm">
              <h3 className="text-lg font-medium mb-6">Capability Comparison</h3>
              <div className="h-80">
                <ChartContainer config={radarChartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={[
                      { category: 'Cost Efficiency', fullMark: 100 },
                      { category: 'Training Efficiency', fullMark: 100 },
                      { category: 'Fast Adoption', fullMark: 100 },
                      { category: 'Task Impact', fullMark: 100 },
                      { category: 'Skills Coverage', fullMark: 100 },
                      { category: 'ROI', fullMark: 100 },
                    ]}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      
                      {comparisonChartData.map((entry, index) => (
                        <Radar
                          key={entry.id}
                          name={entry.name}
                          dataKey={(data) => {
                            switch (data.category) {
                              case 'Cost Efficiency': return entry.cost;
                              case 'Training Efficiency': return entry.training;
                              case 'Fast Adoption': return entry.adoption;
                              case 'Task Impact': return entry.impact;
                              case 'Skills Coverage': return entry.skills;
                              case 'ROI': return entry.roi;
                              default: return 0;
                            }
                          }}
                          stroke={acceleratorColors[index % acceleratorColors.length]}
                          fill={acceleratorColors[index % acceleratorColors.length]}
                          fillOpacity={0.2}
                        />
                      ))}
                      <Tooltip content={<CustomRadarTooltip />} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </Card>
            
            {/* Bar Chart */}
            <Card variant="default" padding="md" className="bg-background/70 backdrop-blur-sm">
              <h3 className="text-lg font-medium mb-6">
                {comparisonMetric === 'cost' || comparisonMetric === 'trainingOverhead' ? 'Cost Comparison' : 
                 comparisonMetric === 'timeToAdoption' ? 'Adoption Speed Comparison' :
                 comparisonMetric === 'taskImpact' ? 'Task Impact Comparison' :
                 comparisonMetric === 'applicableSkills' ? 'Skills Coverage Comparison' : 
                 'ROI Comparison'}
              </h3>
              <div className="h-80">
                <ChartContainer config={barChartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis 
                        type="number" 
                        domain={[0, 'dataMax']} 
                        tickFormatter={(value) => {
                          if (comparisonMetric === 'cost' || comparisonMetric === 'trainingOverhead') {
                            return `$${value.toLocaleString()}`;
                          }
                          return value.toFixed(1);
                        }}
                      />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip 
                        formatter={(value) => {
                          if (comparisonMetric === 'cost' || comparisonMetric === 'trainingOverhead') {
                            return [`$${Number(value).toLocaleString()}`, ''];
                          }
                          return [value, ''];
                        }}
                      />
                      <Bar dataKey="value">
                        {barChartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={acceleratorColors[index % acceleratorColors.length]} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </Card>
          </div>
          
          {/* Detailed Comparison Table */}
          <Card variant="default" padding="md" className="bg-background/70 backdrop-blur-sm">
            <h3 className="text-lg font-medium mb-6">Detailed Comparison</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>AI Accelerator</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                    <TableHead className="text-right">Training</TableHead>
                    <TableHead className="text-right">Adoption Speed</TableHead>
                    <TableHead className="text-right">Avg. Impact</TableHead>
                    <TableHead className="text-right">Skills</TableHead>
                    <TableHead className="text-right">ROI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAccelerators.map((acc, index) => {
                    const originalAcc = accelerators.find(a => a.id === acc.id);
                    const topPerformer = index === 0 && sortOrder === 'desc';
                    
                    return (
                      <TableRow key={acc.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: acceleratorColors[index % acceleratorColors.length] }} 
                            />
                            <span>{acc.name}</span>
                            {topPerformer && comparisonMetric !== 'cost' && comparisonMetric !== 'trainingOverhead' && (
                              <span className="ml-1 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">Top Pick</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          ${acc.implementationCost.toLocaleString()}
                          {comparisonMetric === 'cost' && sortOrder === 'asc' && index === 0 && (
                            <span className="ml-1 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">Best</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          ${acc.trainingOverhead.toLocaleString()}
                          {comparisonMetric === 'trainingOverhead' && sortOrder === 'asc' && index === 0 && (
                            <span className="ml-1 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">Best</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {acc.timeToAdoption} sprints
                          {comparisonMetric === 'timeToAdoption' && sortOrder === 'asc' && index === 0 && (
                            <span className="ml-1 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">Fastest</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {acc.taskImpact.toFixed(1)}x
                          {comparisonMetric === 'taskImpact' && sortOrder === 'desc' && index === 0 && (
                            <span className="ml-1 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">Best</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {acc.skillsCoverage}
                          {comparisonMetric === 'applicableSkills' && sortOrder === 'desc' && index === 0 && (
                            <span className="ml-1 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">Best</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {acc.roi.toFixed(1)}
                          {comparisonMetric === 'roi' && sortOrder === 'desc' && index === 0 && (
                            <span className="ml-1 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">Best</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
          
          {/* Combined Impact Analysis */}
          {selectedAccelerators.length > 1 && (
            <Card variant="default" padding="md" className="bg-background/70 backdrop-blur-sm">
              <h3 className="text-lg font-medium mb-4">Combined Impact Analysis</h3>
              <div className="p-4 text-sm bg-muted/40 rounded-md">
                <p className="mb-4">
                  When implementing multiple AI accelerators together, the combined impact can be greater than the sum of individual impacts.
                  The estimated synergy effect across task types is shown below:
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {
                    // Get unique task types from all selected accelerators
                    Array.from(new Set(
                      sortedAccelerators
                        .flatMap(acc => {
                          const originalAcc = accelerators.find(a => a.id === acc.id);
                          return originalAcc ? Object.keys(originalAcc.taskTypeImpacts) : [];
                        })
                    )).map(taskType => {
                      // Calculate combined impact using a weighted formula
                      const relatedAccelerators = sortedAccelerators.filter(acc => {
                        const originalAcc = accelerators.find(a => a.id === acc.id);
                        return originalAcc && originalAcc.taskTypeImpacts[taskType];
                      });
                      
                      const baseImpact = relatedAccelerators.reduce((sum, acc) => {
                        const originalAcc = accelerators.find(a => a.id === acc.id);
                        return sum + (originalAcc?.taskTypeImpacts[taskType] || 0);
                      }, 0);
                      
                      // Add synergy bonus for multiple tools addressing the same task
                      const synergy = relatedAccelerators.length > 1 ? 0.2 * baseImpact : 0;
                      const combinedImpact = baseImpact + synergy;
                      
                      return (
                        <Card key={taskType} variant="bordered" padding="sm" className="bg-background">
                          <p className="font-medium mb-1">{taskType}</p>
                          <div className="text-2xl font-bold">{combinedImpact.toFixed(1)}x</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Combined from {relatedAccelerators.length} accelerator{relatedAccelerators.length !== 1 ? 's' : ''}
                          </div>
                        </Card>
                      );
                    })
                  }
                </div>
              </div>
            </Card>
          )}
        </>
      )}
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Export Comparison
        </Button>
      </div>
    </div>
  );
};

// Custom tooltip for the radar chart
const CustomRadarTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const category = data.category;
    
    return (
      <div className="p-3 bg-background border rounded-md shadow-lg">
        <p className="font-medium mb-2">{category}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }} 
            />
            <span>{entry.name}: </span>
            <span className="font-mono">{Math.round(entry.value)}%</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default ComparisonView;
