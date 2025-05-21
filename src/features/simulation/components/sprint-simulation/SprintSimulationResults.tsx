
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SprintSimulationConfig, SprintSimulationResult } from "../../types/sprint-simulation";
import { GenAIAccelerator } from "@/features/genai/types";
import { Badge } from "@/components/design-system";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
  BarChart,
  Bar,
} from 'recharts';
import { Clock, TrendingUp, BarChart2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SprintSimulationResultsProps {
  result: SprintSimulationResult;
  config: SprintSimulationConfig;
  accelerator: GenAIAccelerator | null;
}

const SprintSimulationResults: React.FC<SprintSimulationResultsProps> = ({
  result,
  config,
  accelerator
}) => {
  const [selectedKpi, setSelectedKpi] = React.useState<string>(
    config.kpis.length > 0 ? config.kpis[0].name : ''
  );
  
  // Color arrays for charts
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  
  // Format sprint data for the burndown chart
  const burndownData = result.backlogBurndown.map(item => ({
    sprint: `Sprint ${item.sprintNumber}`,
    remaining: item.remainingPoints
  }));
  
  // Format sprint data for the velocity chart
  const velocityData = result.sprints.map(sprint => {
    const data: any = {
      sprint: `Sprint ${sprint.sprintNumber}`,
      velocity: sprint.completedStoryPoints
    };
    
    if (sprint.acceleratorImpact) {
      data.base = sprint.completedStoryPoints - sprint.acceleratorImpact;
      data.accelerator = sprint.acceleratorImpact;
    }
    
    return data;
  });
  
  // Format KPI data
  const kpiData = React.useMemo(() => {
    if (!selectedKpi) return [];
    
    const kpiTrend = result.kpiTrends.find(k => k.kpiName === selectedKpi);
    if (!kpiTrend) return [];
    
    return kpiTrend.values.map((value, index) => ({
      sprint: `Sprint ${index + 1}`,
      value: Number(value.toFixed(2))
    }));
  }, [selectedKpi, result.kpiTrends]);
  
  // Find the selected KPI info
  const selectedKpiInfo = React.useMemo(() => {
    return config.kpis.find(k => k.name === selectedKpi);
  }, [selectedKpi, config.kpis]);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock size={18} className="mr-2 text-primary" />
              Simulation Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/20 p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Sprints Required</div>
                  <div className="text-2xl font-bold">{result.sprints.length}</div>
                </div>
                <div className="bg-muted/20 p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Total Duration</div>
                  <div className="text-2xl font-bold">{result.totalDuration} weeks</div>
                </div>
              </div>
              
              <div className="bg-muted/20 p-3 rounded-md">
                <div className="flex justify-between">
                  <div className="text-sm text-muted-foreground">Average Velocity</div>
                  <Badge variant="outline">
                    {config.baselineVelocity} → {Math.round(result.averageVelocity)}
                  </Badge>
                </div>
                <div className="text-2xl font-bold flex items-center">
                  {Math.round(result.averageVelocity)}
                  <span className="text-sm text-success ml-2 flex items-center">
                    <TrendingUp size={14} className="mr-1" />
                    +{Math.round((result.averageVelocity / config.baselineVelocity - 1) * 100)}%
                  </span>
                </div>
              </div>
              
              {accelerator && result.withAccelerator && (
                <div className="bg-primary/10 border border-primary/30 p-3 rounded-md">
                  <div className="text-sm font-medium mb-1">Accelerator Impact</div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{accelerator.name}</span>
                    <Badge variant="success">
                      +{result.withAccelerator.improvementPercentage}% Faster
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2 hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Backlog Burndown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={burndownData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="sprint" 
                    tick={{ fontSize: 12 }}
                    interval={Math.ceil(burndownData.length / 6) - 1}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} points`, 'Remaining Backlog']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="remaining" 
                    stroke="#3b82f6" 
                    fill="url(#colorRemaining)"
                    strokeWidth={2} 
                  />
                  <defs>
                    <linearGradient id="colorRemaining" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Team Velocity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={velocityData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                  stackOffset="sign"
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="sprint" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'velocity') return [`${value} points`, 'Total Velocity'];
                      if (name === 'base') return [`${value} points`, 'Base Velocity'];
                      if (name === 'accelerator') return [`${value} points`, 'Accelerator Boost'];
                      return [value, name];
                    }}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                    }}
                  />
                  <Legend />
                  <ReferenceLine 
                    y={config.baselineVelocity} 
                    stroke="#888" 
                    strokeDasharray="3 3" 
                    label={{ 
                      value: "Baseline", 
                      position: "insideBottomRight",
                      fontSize: 12,
                      fill: '#888'
                    }} 
                  />
                  {accelerator ? (
                    <>
                      <Bar dataKey="base" name="Base Velocity" fill="#94a3b8" />
                      <Bar dataKey="accelerator" name="Accelerator Boost" fill="#3b82f6" />
                    </>
                  ) : (
                    <Bar dataKey="velocity" name="Velocity" fill="#3b82f6" />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">KPI Tracking</CardTitle>
            <Select value={selectedKpi} onValueChange={setSelectedKpi}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select KPI" />
              </SelectTrigger>
              <SelectContent>
                {config.kpis.map((kpi) => (
                  <SelectItem key={kpi.name} value={kpi.name}>
                    {kpi.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              {selectedKpiInfo && kpiData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={kpiData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="sprint" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} ${selectedKpiInfo.unit}`, selectedKpiInfo.name]}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                      }}
                    />
                    {selectedKpiInfo.target && (
                      <ReferenceLine 
                        y={selectedKpiInfo.target} 
                        stroke="#888" 
                        strokeDasharray="3 3" 
                        label={{ 
                          value: "Target", 
                          position: "insideBottomRight",
                          fontSize: 12, 
                          fill: '#888'
                        }} 
                      />
                    )}
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-center text-muted-foreground">
                  <div>
                    <BarChart2 size={40} className="mx-auto mb-2 opacity-30" />
                    <p>Select a KPI to view its trend data</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {accelerator && result.withAccelerator && (
        <Card className="border border-primary/20 bg-primary/5 hover:shadow-md transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-lg">GenAI Accelerator Impact: {accelerator.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card p-4 rounded-md shadow-sm">
                <div className="text-sm text-muted-foreground">Baseline Velocity</div>
                <div className="text-2xl font-bold mt-1">{config.baselineVelocity} points</div>
                <div className="text-sm mt-1">per sprint</div>
              </div>
              
              <div className="bg-card p-4 rounded-md shadow-sm">
                <div className="text-sm text-muted-foreground">Accelerated Velocity</div>
                <div className="text-2xl font-bold mt-1 text-primary">
                  {Math.round(result.averageVelocity)} points
                </div>
                <div className="text-sm mt-1">per sprint</div>
              </div>
              
              <div className="bg-success/10 p-4 rounded-md shadow-sm">
                <div className="text-sm text-muted-foreground">Productivity Boost</div>
                <div className="text-2xl font-bold mt-1 text-success">
                  +{result.withAccelerator.improvementPercentage}%
                </div>
                <div className="text-sm mt-1">
                  {Math.round(result.withAccelerator.averageVelocity - config.baselineVelocity)} additional points/sprint
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-card p-4 rounded-md">
              <h4 className="font-medium mb-2">Accelerator Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Description</p>
                  <p>{accelerator.description}</p>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-muted-foreground">Implementation Cost</p>
                    <p className="font-medium">{accelerator.implementationCost}/5</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Training Overhead</p>
                    <p className="font-medium">{accelerator.trainingOverhead}/5</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Effectiveness Multiplier</p>
                    <p className="font-medium">{accelerator.effectivenessMultiplier}x</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SprintSimulationResults;
