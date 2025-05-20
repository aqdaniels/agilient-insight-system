
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  AreaChart,
  Area,
  Bar,
  BarChart,
  ComposedChart
} from "recharts";
import { GenAIAccelerator, ROIAnalysis } from '../types';
import { Button, Card, DataCard } from '@/components/design-system';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface ROIAnalysisDashboardProps {
  accelerator: GenAIAccelerator;
}

const ROIAnalysisDashboard: React.FC<ROIAnalysisDashboardProps> = ({ accelerator }) => {
  const [editedCost, setEditedCost] = useState<number>(accelerator.implementationCost);
  const [editedTrainingOverhead, setEditedTrainingOverhead] = useState<number>(accelerator.trainingOverhead);
  const [teamSize, setTeamSize] = useState<number>(8);
  const [sprintCost, setSprintCost] = useState<number>(50000);
  const [confidenceLevel, setConfidenceLevel] = useState<number>(80);
  const [roiAnalysis, setRoiAnalysis] = useState<ROIAnalysis | null>(null);
  const [timeHorizon, setTimeHorizon] = useState<number>(24);
  const [roiChartData, setRoiChartData] = useState<any[]>([]);
  
  // Cost breakdown
  const [licensingCost, setLicensingCost] = useState<number>(0);
  const [setupCost, setSetupCost] = useState<number>(0);
  const [integrationCost, setIntegrationCost] = useState<number>(0);
  const [maintenanceCost, setMaintenanceCost] = useState<number>(0);
  
  useEffect(() => {
    // Set default values for cost breakdown
    const defaultLicensing = accelerator.implementationCost * 0.4;
    const defaultSetup = accelerator.implementationCost * 0.2;
    const defaultIntegration = accelerator.implementationCost * 0.3;
    const defaultMaintenance = accelerator.implementationCost * 0.1;
    
    setLicensingCost(defaultLicensing);
    setSetupCost(defaultSetup);
    setIntegrationCost(defaultIntegration);
    setMaintenanceCost(defaultMaintenance);
    
  }, [accelerator]);

  // Update total cost when cost breakdown changes - this was causing infinite loop
  useEffect(() => {
    const totalCost = licensingCost + setupCost + integrationCost + maintenanceCost;
    setEditedCost(totalCost);
  }, [licensingCost, setupCost, integrationCost, maintenanceCost]);

  useEffect(() => {
    // Recalculate ROI whenever inputs change
    const data = calculateROI();
    setRoiChartData(data);
  }, [
    accelerator, 
    editedCost, 
    editedTrainingOverhead, 
    teamSize, 
    sprintCost, 
    confidenceLevel,
    timeHorizon
  ]);

  const calculateROI = () => {
    // Sort adoption curve by timePoint
    const adoptionCurve = [...accelerator.adoptionCurve].sort((a, b) => a.timePoint - b.timePoint);
    
    // Calculate impact factors from task type impacts
    const avgImpactFactor = Object.values(accelerator.taskTypeImpacts).length > 0 
      ? Object.values(accelerator.taskTypeImpacts).reduce((sum, val) => sum + val, 0) / Object.values(accelerator.taskTypeImpacts).length
      : 1.2; // Default impact factor if none specified
    
    // Calculate individual sprint benefits based on adoption curve
    const sprintData = [];
    let cumulativeBenefit = 0;
    let breakEvenSprint = -1;
    
    const initialCost = editedCost + (editedTrainingOverhead * teamSize);
    
    for (let sprint = 0; sprint <= timeHorizon; sprint++) {
      // Find effectiveness for this sprint by interpolating between curve points
      let effectiveness = 0;
      
      if (sprint <= adoptionCurve[0]?.timePoint) {
        effectiveness = adoptionCurve[0]?.effectivenessPercent || 0;
      } else if (sprint >= adoptionCurve[adoptionCurve.length - 1]?.timePoint) {
        effectiveness = adoptionCurve[adoptionCurve.length - 1]?.effectivenessPercent || 0;
      } else {
        // Find surrounding points and interpolate
        const lowerPoint = [...adoptionCurve].reverse().find(p => p.timePoint <= sprint);
        const upperPoint = adoptionCurve.find(p => p.timePoint >= sprint);
        
        if (lowerPoint && upperPoint) {
          const rangeFactor = (sprint - lowerPoint.timePoint) / (upperPoint.timePoint - lowerPoint.timePoint);
          effectiveness = lowerPoint.effectivenessPercent + 
            rangeFactor * (upperPoint.effectivenessPercent - lowerPoint.effectivenessPercent);
        }
      }
      
      // Calculate benefit for this sprint
      const monthlySavingsRate = (effectiveness / 100) * avgImpactFactor;
      const sprintBenefit = sprintCost * monthlySavingsRate / 100; // Benefit as percentage of sprint cost
      
      cumulativeBenefit += sprintBenefit;
      const netBenefit = cumulativeBenefit - initialCost;
      
      if (breakEvenSprint === -1 && netBenefit >= 0) {
        breakEvenSprint = sprint;
      }
      
      // Determine confidence interval based on sprint number
      // More uncertainty further in the future
      const confidenceFactor = confidenceLevel / 100;
      const variabilityFactor = 1 + (sprint / timeHorizon) * (1 - confidenceFactor);
      const lowerBound = sprintBenefit / variabilityFactor;
      const upperBound = sprintBenefit * variabilityFactor;
      
      sprintData.push({
        sprint,
        benefit: sprintBenefit,
        cumulativeBenefit,
        netBenefit,
        lowerBound,
        upperBound
      });
    }
    
    // Calculate final ROI metrics
    const totalBenefit = cumulativeBenefit;
    const netBenefit = totalBenefit - initialCost;
    const roi = (netBenefit / initialCost) * 100;
    
    // Calculate confidence interval for total benefit
    const confidenceFactor = confidenceLevel / 100;
    const lowerBoundTotal = totalBenefit * confidenceFactor;
    const upperBoundTotal = totalBenefit / confidenceFactor;
    
    // Calculate monthly savings based on final adoption level
    const finalEffectiveness = adoptionCurve[adoptionCurve.length - 1]?.effectivenessPercent || 0;
    const monthlySavings = (finalEffectiveness / 100) * avgImpactFactor * sprintCost / 100;
    
    setRoiAnalysis({
      breakEvenSprint,
      totalCost: initialCost,
      totalBenefit,
      netBenefit,
      confidenceInterval: [lowerBoundTotal, upperBoundTotal],
      monthlySavings
    });
    
    return sprintData;
  };

  // Get breakeven point from roiAnalysis
  const breakEvenPoint = roiAnalysis?.breakEvenSprint || 0;
  
  // Create cost breakdown data for the pie chart
  const costBreakdownData = [
    { name: 'Licensing', value: licensingCost },
    { name: 'Setup', value: setupCost },
    { name: 'Integration', value: integrationCost },
    { name: 'Maintenance', value: maintenanceCost },
    { name: 'Training', value: editedTrainingOverhead * teamSize }
  ];
  
  // Chart configuration
  const chartConfig = {
    benefit: {
      label: "Benefit",
      theme: {
        light: "#82ca9d",
        dark: "#82ca9d"
      }
    },
    cost: {
      label: "Cost",
      theme: {
        light: "#ff7300",
        dark: "#ff7300"
      }
    },
    cumulative: {
      label: "Cumulative Return",
      theme: {
        light: "#9b87f5",
        dark: "#9b87f5"
      }
    },
    lowerBound: {
      label: "Lower Bound",
      theme: {
        light: "#82ca9d50",
        dark: "#82ca9d30"
      }
    },
    upperBound: {
      label: "Upper Bound",
      theme: {
        light: "#82ca9d20",
        dark: "#82ca9d10"
      }
    }
  };

  // Handle cost input changes without causing infinite updates
  const handleLicensingCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLicensingCost(Number(e.target.value));
  };

  const handleSetupCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSetupCost(Number(e.target.value));
  };

  const handleIntegrationCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIntegrationCost(Number(e.target.value));
  };

  const handleMaintenanceCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaintenanceCost(Number(e.target.value));
  };

  const handleTrainingOverheadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTrainingOverhead(Number(e.target.value));
  };

  return (
    <div className="space-y-6">
      {/* Summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DataCard
          title="Implementation Cost"
          value={`$${editedCost.toLocaleString()}`}
          caption="Total investment required"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 18C2.5 19.3807 3.61929 20.5 5 20.5H17.5V5.5H11.5"/><path d="M2.5 9.5L7.21739 5L11.5 9.5"/><path d="M7 5V17"/></svg>}
        />
        <DataCard
          title="Break-even Point"
          value={roiAnalysis?.breakEvenSprint !== undefined ? `Sprint ${roiAnalysis?.breakEvenSprint}` : 'N/A'}
          caption="Recovery of investment"
          trend={breakEvenPoint > 0 ? { 
            value: Math.round(breakEvenPoint / timeHorizon * 100), 
            isPositive: breakEvenPoint < timeHorizon / 2
          } : undefined}
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>}
        />
        <DataCard
          title="Total Return"
          value={roiAnalysis ? `$${roiAnalysis.netBenefit.toLocaleString()}` : '$0'}
          caption={`Over ${timeHorizon} sprints`}
          trend={roiAnalysis?.netBenefit ? { 
            value: Math.round(roiAnalysis.netBenefit / roiAnalysis.totalCost * 10), 
            isPositive: roiAnalysis.netBenefit > 0
          } : undefined}
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6"/><path d="M6 20v-6"/><path d="M18 20v-6"/><path d="M12 14l7-7"/><path d="M17 7h2v2"/></svg>}
        />
        <DataCard
          title="Monthly Savings"
          value={roiAnalysis ? `$${roiAnalysis.monthlySavings.toLocaleString()}` : '$0'}
          caption="At full adoption"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z"/><path d="M2 9v1c0 1.1.9 2 2 2h1"/><path d="M16 11h0"/></svg>}
        />
      </div>

      {/* ROI Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card variant="default" padding="md" className="bg-background/70 backdrop-blur-sm">
            <h3 className="text-lg font-medium mb-6">Return on Investment Analysis</h3>
            <div className="h-80">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={roiChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                    <XAxis 
                      dataKey="sprint" 
                      label={{ value: 'Sprint', position: 'insideBottomRight', offset: -5 }} 
                    />
                    <YAxis 
                      label={{ value: 'Value ($)', angle: -90, position: 'insideLeft', offset: 10 }}
                      tickFormatter={(value) => `$${value >= 1000 ? (value/1000).toFixed(0)+'k' : value}`}
                    />
                    <Tooltip 
                      content={<ChartTooltipContent />}
                      formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="upperBound"
                      fill="var(--color-upperBound)"
                      stroke="none"
                      stackId="1"
                    />
                    <Area
                      type="monotone"
                      dataKey="lowerBound"
                      fill="var(--color-lowerBound)"
                      stroke="none"
                      stackId="1"
                    />
                    <Bar dataKey="benefit" fill="var(--color-benefit)" barSize={20} />
                    <Line 
                      type="monotone" 
                      dataKey="netBenefit" 
                      stroke="var(--color-cumulative)" 
                      dot={false}
                      strokeWidth={2}
                    />
                    {roiAnalysis?.breakEvenSprint && (
                      <ReferenceLine 
                        x={roiAnalysis.breakEvenSprint} 
                        stroke="var(--color-cost)" 
                        strokeDasharray="3 3"
                        label={{ value: 'Payback', position: 'right', fill: 'var(--color-cost)' }}
                      />
                    )}
                    <ReferenceLine 
                      y={0} 
                      stroke="#666" 
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="bg-muted/30 p-3 rounded-md text-center">
                <div className="text-2xl font-bold text-green-500 dark:text-green-400">
                  {roiAnalysis?.netBenefit && roiAnalysis.totalCost ? 
                    `${((roiAnalysis.netBenefit / roiAnalysis.totalCost) * 100).toFixed(0)}%` : 
                    '0%'}
                </div>
                <div className="text-xs text-muted-foreground">ROI Percentage</div>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-md text-center">
                <div className="text-2xl font-bold">
                  {roiAnalysis?.confidenceInterval ? 
                    `${(roiAnalysis.confidenceInterval[0] / 1000).toFixed(0)}k-${(roiAnalysis.confidenceInterval[1] / 1000).toFixed(0)}k` : 
                    '$0'}
                </div>
                <div className="text-xs text-muted-foreground">Benefit Range ($)</div>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-md text-center">
                <div className={`text-2xl font-bold ${roiAnalysis?.breakEvenSprint && roiAnalysis.breakEvenSprint < timeHorizon ? 'text-success' : 'text-error'}`}>
                  {roiAnalysis?.breakEvenSprint ? 
                    roiAnalysis.breakEvenSprint < timeHorizon ? 
                      `${roiAnalysis.breakEvenSprint} sprints` : 
                      'Beyond horizon' : 
                    'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">Time to Break Even</div>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-md text-center">
                <div className="text-2xl font-bold">
                  {/* Calculate monthly ROI */}
                  {roiAnalysis?.netBenefit && roiAnalysis.totalCost && roiAnalysis?.breakEvenSprint ? 
                    `${(roiAnalysis.netBenefit / (roiAnalysis.breakEvenSprint || 1) / roiAnalysis.totalCost * 100).toFixed(1)}%` : 
                    '0%'}
                </div>
                <div className="text-xs text-muted-foreground">Monthly ROI</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card variant="default" padding="md" className="bg-background/70 backdrop-blur-sm">
            <h3 className="text-lg font-medium mb-6">Cost & Parameters</h3>
            
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Licensing Costs</Label>
                  <div className="flex mt-1">
                    <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md text-sm text-muted-foreground">$</span>
                    <Input
                      type="number"
                      min="0"
                      value={licensingCost}
                      onChange={handleLicensingCostChange}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                <div>
                  <Label>Setup Costs</Label>
                  <div className="flex mt-1">
                    <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md text-sm text-muted-foreground">$</span>
                    <Input
                      type="number"
                      min="0"
                      value={setupCost}
                      onChange={handleSetupCostChange}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Integration Costs</Label>
                  <div className="flex mt-1">
                    <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md text-sm text-muted-foreground">$</span>
                    <Input
                      type="number"
                      min="0"
                      value={integrationCost}
                      onChange={handleIntegrationCostChange}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                <div>
                  <Label>Maintenance Costs</Label>
                  <div className="flex mt-1">
                    <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md text-sm text-muted-foreground">$</span>
                    <Input
                      type="number"
                      min="0"
                      value={maintenanceCost}
                      onChange={handleMaintenanceCostChange}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Label>Training Overhead per Team Member</Label>
                <div className="flex mt-1">
                  <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md text-sm text-muted-foreground">$</span>
                  <Input
                    type="number"
                    min="0"
                    value={editedTrainingOverhead}
                    onChange={handleTrainingOverheadChange}
                    className="rounded-l-none"
                  />
                </div>
              </div>
              
              <div>
                <Label>Team Size: {teamSize} members</Label>
                <Slider
                  value={[teamSize]}
                  min={1}
                  max={20}
                  step={1}
                  onValueChange={(values) => setTeamSize(values[0])}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Average Sprint Cost: ${sprintCost.toLocaleString()}</Label>
                <Slider
                  value={[sprintCost]}
                  min={10000}
                  max={200000}
                  step={5000}
                  onValueChange={(values) => setSprintCost(values[0])}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label>Confidence Level: {confidenceLevel}%</Label>
                <Slider
                  value={[confidenceLevel]}
                  min={50}
                  max={95}
                  step={5}
                  onValueChange={(values) => setConfidenceLevel(values[0])}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label>Time Horizon: {timeHorizon} sprints</Label>
                <Slider
                  value={[timeHorizon]}
                  min={6}
                  max={52}
                  step={2}
                  onValueChange={(values) => setTimeHorizon(values[0])}
                  className="mt-2"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Export Analysis
        </Button>
        <Button variant="primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M12 20v-6"></path>
            <path d="M12 14l-3-3"></path>
            <path d="M12 14l3-3"></path>
            <path d="M8 9h8"></path>
            <path d="M10 5h4"></path>
            <rect x="2" y="3" width="20" height="18" rx="2" ry="2"></rect>
          </svg>
          Generate Report
        </Button>
      </div>
    </div>
  );
};

export default ROIAnalysisDashboard;
