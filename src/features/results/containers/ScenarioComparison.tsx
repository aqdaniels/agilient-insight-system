
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/design-system";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { SimulationScenario } from "../../simulation/types";
import { ComparisonMetric } from "../types";
import { Download, BarChart, ArrowRight, TrendingDown, TrendingUp, Search } from "lucide-react";
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
  AreaChart
} from "recharts";

// Mock API call to fetch scenarios for comparison
const fetchScenariosForComparison = async (): Promise<{
  baselineScenario: SimulationScenario;
  comparisonScenarios: SimulationScenario[];
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // This would normally be an API call to fetch actual scenarios
  return {
    baselineScenario: {
      id: "scenario-001",
      name: "Baseline Plan",
      description: "Standard delivery approach with current team",
      projectId: "project-001",
      teamConfiguration: {
        teamSize: 8,
        skills: ["frontend", "backend", "design", "qa"],
        averageVelocity: 30,
        seniorityLevel: 0.7,
        onboardingTime: 2,
        attritionRisk: 0.05
      },
      backlogConfiguration: {
        totalStoryPoints: 300,
        storyDistribution: {
          "feature": 0.6,
          "bug": 0.2,
          "debt": 0.1,
          "research": 0.1
        },
        dependencies: [],
        prioritizationStrategy: "value-based"
      },
      genAIConfiguration: {
        accelerators: [],
        adoptionRate: [
          { timePoint: 1, effectivenessPercent: 0 },
          { timePoint: 8, effectivenessPercent: 0 }
        ],
        effectivenessMultiplier: 1,
        coveragePercentage: 0
      },
      processParameters: {
        sprintLength: 2,
        ceremonyOverhead: 0.1,
        workItemAgingEffect: 0.05,
        contextSwitchingImpact: 0.15
      },
      simulationParameters: {
        resolution: "day",
        iterationCount: 1000,
        confidenceInterval: 0.9,
        includeHolidays: true,
        includePTOEffect: true
      },
      results: {
        completionDate: new Date("2025-09-15"),
        confidenceLevel: 0.85,
        velocityTrend: [
          { sprint: 1, velocity: 30 },
          { sprint: 2, velocity: 30 },
          { sprint: 3, velocity: 30 },
          { sprint: 4, velocity: 30 },
          { sprint: 5, velocity: 30 },
          { sprint: 6, velocity: 30 },
          { sprint: 7, velocity: 30 },
          { sprint: 8, velocity: 30 }
        ],
        completionDistribution: [],
        riskFactors: [],
      },
      createdBy: "user-001",
      createdAt: new Date("2025-05-01"),
      lastModified: new Date("2025-05-01"),
      tags: ["baseline"]
    },
    comparisonScenarios: [
      {
        id: "scenario-002",
        name: "GenAI Accelerated",
        description: "Leverages AI tools with gradual adoption",
        baselineScenarioId: "scenario-001",
        projectId: "project-001",
        teamConfiguration: {
          teamSize: 8,
          skills: ["frontend", "backend", "design", "qa"],
          averageVelocity: 30,
          seniorityLevel: 0.7,
          onboardingTime: 2,
          attritionRisk: 0.05
        },
        backlogConfiguration: {
          totalStoryPoints: 300,
          storyDistribution: {
            "feature": 0.6,
            "bug": 0.2,
            "debt": 0.1,
            "research": 0.1
          },
          dependencies: [],
          prioritizationStrategy: "value-based"
        },
        genAIConfiguration: {
          accelerators: ["acc1", "acc2", "acc3"],
          adoptionRate: [
            { timePoint: 1, effectivenessPercent: 0.2 },
            { timePoint: 2, effectivenessPercent: 0.4 },
            { timePoint: 3, effectivenessPercent: 0.6 },
            { timePoint: 4, effectivenessPercent: 0.7 },
            { timePoint: 5, effectivenessPercent: 0.8 },
            { timePoint: 6, effectivenessPercent: 0.9 },
            { timePoint: 7, effectivenessPercent: 0.9 },
            { timePoint: 8, effectivenessPercent: 0.9 }
          ],
          effectivenessMultiplier: 1.4,
          coveragePercentage: 0.7
        },
        processParameters: {
          sprintLength: 2,
          ceremonyOverhead: 0.1,
          workItemAgingEffect: 0.05,
          contextSwitchingImpact: 0.15
        },
        simulationParameters: {
          resolution: "day",
          iterationCount: 1000,
          confidenceInterval: 0.9,
          includeHolidays: true,
          includePTOEffect: true
        },
        results: {
          completionDate: new Date("2025-08-18"),
          confidenceLevel: 0.9,
          velocityTrend: [
            { sprint: 1, velocity: 32 },
            { sprint: 2, velocity: 34 },
            { sprint: 3, velocity: 36 },
            { sprint: 4, velocity: 38 },
            { sprint: 5, velocity: 39 },
            { sprint: 6, velocity: 41 },
            { sprint: 7, velocity: 41 },
            { sprint: 8, velocity: 42 }
          ],
          completionDistribution: [],
          riskFactors: [],
          comparisonToBaseline: {
            timeReduction: 15,
            costReduction: 12000,
            qualityImprovement: 8
          }
        },
        createdBy: "user-001",
        createdAt: new Date("2025-05-05"),
        lastModified: new Date("2025-05-05"),
        tags: ["genai", "optimized"]
      },
      {
        id: "scenario-003",
        name: "Expanded Team",
        description: "Additional resources to accelerate delivery",
        baselineScenarioId: "scenario-001",
        projectId: "project-001",
        teamConfiguration: {
          teamSize: 10,
          skills: ["frontend", "backend", "design", "qa"],
          averageVelocity: 36,
          seniorityLevel: 0.6,
          onboardingTime: 3,
          attritionRisk: 0.1
        },
        backlogConfiguration: {
          totalStoryPoints: 300,
          storyDistribution: {
            "feature": 0.6,
            "bug": 0.2,
            "debt": 0.1,
            "research": 0.1
          },
          dependencies: [],
          prioritizationStrategy: "value-based"
        },
        genAIConfiguration: {
          accelerators: [],
          adoptionRate: [
            { timePoint: 1, effectivenessPercent: 0 },
            { timePoint: 8, effectivenessPercent: 0 }
          ],
          effectivenessMultiplier: 1,
          coveragePercentage: 0
        },
        processParameters: {
          sprintLength: 2,
          ceremonyOverhead: 0.12,
          workItemAgingEffect: 0.05,
          contextSwitchingImpact: 0.18
        },
        simulationParameters: {
          resolution: "day",
          iterationCount: 1000,
          confidenceInterval: 0.9,
          includeHolidays: true,
          includePTOEffect: true
        },
        results: {
          completionDate: new Date("2025-08-25"),
          confidenceLevel: 0.82,
          velocityTrend: [
            { sprint: 1, velocity: 32 },
            { sprint: 2, velocity: 34 },
            { sprint: 3, velocity: 35 },
            { sprint: 4, velocity: 36 },
            { sprint: 5, velocity: 37 },
            { sprint: 6, velocity: 37 },
            { sprint: 7, velocity: 38 },
            { sprint: 8, velocity: 38 }
          ],
          completionDistribution: [],
          riskFactors: [],
          comparisonToBaseline: {
            timeReduction: 10,
            costReduction: -15000, // Negative indicates increased cost
            qualityImprovement: 5
          }
        },
        createdBy: "user-001",
        createdAt: new Date("2025-05-10"),
        lastModified: new Date("2025-05-10"),
        tags: ["team-expansion"]
      }
    ]
  };
};

const ScenarioComparison: React.FC = () => {
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>(["scenario-002"]);
  const [comparisonMode, setComparisonMode] = useState<'timeline' | 'resources' | 'cost'>('timeline');
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['scenarioComparison'],
    queryFn: fetchScenariosForComparison,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Scenario Comparison</h2>
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-error">Error loading scenario data: {error.toString()}</div>;
  }

  if (!data) {
    return <div className="text-error">No scenario data found</div>;
  }
  
  const { baselineScenario, comparisonScenarios } = data;
  
  const getSelectedScenarios = () => {
    return comparisonScenarios.filter(scenario => 
      selectedScenarios.includes(scenario.id)
    );
  };
  
  // Generate metrics for comparison
  const generateComparisonMetrics = (): ComparisonMetric[] => {
    const activeScenarios = getSelectedScenarios();
    if (activeScenarios.length === 0) return [];
    
    const firstScenario = activeScenarios[0];
    
    // These would normally be calculated from actual simulation results
    return [
      {
        name: "Completion Date",
        baseline: new Date(baselineScenario.results?.completionDate || "").getTime(),
        current: new Date(firstScenario.results?.completionDate || "").getTime(),
        difference: Math.floor((new Date(baselineScenario.results?.completionDate || "").getTime() - 
                               new Date(firstScenario.results?.completionDate || "").getTime()) / 
                              (1000 * 60 * 60 * 24)),
        percentChange: Math.round((new Date(baselineScenario.results?.completionDate || "").getTime() - 
                               new Date(firstScenario.results?.completionDate || "").getTime()) / 
                              (1000 * 60 * 60 * 24) / 30 * 100) / 100,
        isPositive: true
      },
      {
        name: "Team Velocity",
        baseline: baselineScenario.teamConfiguration.averageVelocity,
        current: firstScenario.results?.velocityTrend?.[firstScenario.results?.velocityTrend?.length - 1]?.velocity || 0,
        difference: (firstScenario.results?.velocityTrend?.[firstScenario.results?.velocityTrend?.length - 1]?.velocity || 0) - 
                  baselineScenario.teamConfiguration.averageVelocity,
        percentChange: Math.round(((firstScenario.results?.velocityTrend?.[firstScenario.results?.velocityTrend?.length - 1]?.velocity || 0) - 
                  baselineScenario.teamConfiguration.averageVelocity) / 
                  baselineScenario.teamConfiguration.averageVelocity * 100),
        isPositive: true
      },
      {
        name: "Project Cost",
        baseline: 140000, // Placeholder, would come from actual results
        current: 140000 - (firstScenario.results?.comparisonToBaseline?.costReduction || 0),
        difference: firstScenario.results?.comparisonToBaseline?.costReduction || 0,
        percentChange: Math.round(((firstScenario.results?.comparisonToBaseline?.costReduction || 0) / 140000) * 100),
        isPositive: firstScenario.results?.comparisonToBaseline?.costReduction ? 
                    firstScenario.results?.comparisonToBaseline?.costReduction > 0 : false
      },
      {
        name: "Quality Score",
        baseline: 85, // Placeholder, would come from actual results
        current: 85 + (firstScenario.results?.comparisonToBaseline?.qualityImprovement || 0),
        difference: firstScenario.results?.comparisonToBaseline?.qualityImprovement || 0,
        percentChange: Math.round(((firstScenario.results?.comparisonToBaseline?.qualityImprovement || 0) / 85) * 100),
        isPositive: true
      }
    ];
  };
  
  // Generate data for timeline comparison chart
  const generateTimelineData = () => {
    const baselineVelocity = baselineScenario.results?.velocityTrend || [];
    const baselineData = baselineVelocity.map(point => ({
      sprint: `Sprint ${point.sprint}`,
      baseline: point.velocity
    }));
    
    const selectedScenarios = getSelectedScenarios();
    
    return baselineData.map((dataPoint, index) => {
      const result = { ...dataPoint };
      
      selectedScenarios.forEach(scenario => {
        if (scenario.results?.velocityTrend && index < scenario.results.velocityTrend.length) {
          result[scenario.id] = scenario.results.velocityTrend[index].velocity;
        }
      });
      
      return result;
    });
  };
  
  const timelineData = generateTimelineData();
  const metrics = generateComparisonMetrics();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Scenario Comparison</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            leftIcon={<Download size={16} />}
          >
            Export Comparison
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Baseline vs. Comparison Scenarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="border p-4 rounded-md bg-muted/30">
              <h3 className="font-medium mb-1">Baseline Scenario</h3>
              <p className="text-sm text-muted-foreground mb-2">{baselineScenario.description}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Team Size:</span> {baselineScenario.teamConfiguration.teamSize}
                </div>
                <div>
                  <span className="text-muted-foreground">Average Velocity:</span> {baselineScenario.teamConfiguration.averageVelocity}
                </div>
                <div>
                  <span className="text-muted-foreground">Sprint Length:</span> {baselineScenario.processParameters.sprintLength} weeks
                </div>
                <div>
                  <span className="text-muted-foreground">Story Points:</span> {baselineScenario.backlogConfiguration.totalStoryPoints}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Select Comparison Scenarios</h3>
              <div className="space-y-2">
                {comparisonScenarios.map(scenario => (
                  <div 
                    key={scenario.id} 
                    className={`border p-3 rounded-md cursor-pointer ${
                      selectedScenarios.includes(scenario.id) 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted hover:border-primary/50'
                    }`}
                    onClick={() => {
                      if (selectedScenarios.includes(scenario.id)) {
                        setSelectedScenarios(selectedScenarios.filter(id => id !== scenario.id));
                      } else {
                        setSelectedScenarios([...selectedScenarios, scenario.id]);
                      }
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{scenario.name}</h4>
                      {selectedScenarios.includes(scenario.id) && (
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{scenario.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {selectedScenarios.length > 0 && (
            <div className="space-y-4">
              <div className="flex space-x-2 border-b">
                <button 
                  className={`px-3 py-2 text-sm font-medium ${comparisonMode === 'timeline' ? 'border-b-2 border-primary' : ''}`}
                  onClick={() => setComparisonMode('timeline')}
                >
                  Timeline
                </button>
                <button 
                  className={`px-3 py-2 text-sm font-medium ${comparisonMode === 'resources' ? 'border-b-2 border-primary' : ''}`}
                  onClick={() => setComparisonMode('resources')}
                >
                  Resources
                </button>
                <button 
                  className={`px-3 py-2 text-sm font-medium ${comparisonMode === 'cost' ? 'border-b-2 border-primary' : ''}`}
                  onClick={() => setComparisonMode('cost')}
                >
                  Cost
                </button>
              </div>
              
              {comparisonMode === 'timeline' && (
                <div>
                  <h3 className="font-medium mb-3">Velocity Comparison</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={timelineData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="sprint" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="baseline" 
                          stroke="#6b7280" 
                          name="Baseline" 
                          strokeWidth={2} 
                          strokeDasharray="5 5"
                        />
                        {getSelectedScenarios().map((scenario, index) => (
                          <Line
                            key={scenario.id}
                            type="monotone"
                            dataKey={scenario.id}
                            stroke={
                              index === 0 ? "#3b82f6" :
                              index === 1 ? "#10b981" :
                              "#f59e0b"
                            }
                            name={scenario.name}
                            strokeWidth={2}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
              
              {comparisonMode === 'resources' && (
                <div>
                  <h3 className="font-medium mb-3">Team Utilization Comparison</h3>
                  <div className="bg-muted/30 p-6 rounded-md text-center">
                    <p className="text-muted-foreground">
                      Resource utilization comparison visualization would appear here,
                      comparing team capacity and skill utilization across scenarios.
                    </p>
                  </div>
                </div>
              )}
              
              {comparisonMode === 'cost' && (
                <div>
                  <h3 className="font-medium mb-3">Cost Comparison</h3>
                  <div className="bg-muted/30 p-6 rounded-md text-center">
                    <p className="text-muted-foreground">
                      Cost comparison visualization would appear here,
                      comparing budget allocation and spending across scenarios.
                    </p>
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="font-medium mb-3">Key Metrics Comparison</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead>Baseline</TableHead>
                      <TableHead>Current</TableHead>
                      <TableHead>Difference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metrics.map((metric, index) => (
                      <TableRow key={index}>
                        <TableCell>{metric.name}</TableCell>
                        <TableCell>
                          {metric.name === "Completion Date" 
                            ? new Date(metric.baseline).toLocaleDateString()
                            : metric.name === "Project Cost"
                              ? `$${metric.baseline.toLocaleString()}`
                              : metric.baseline}
                        </TableCell>
                        <TableCell>
                          {metric.name === "Completion Date" 
                            ? new Date(metric.current).toLocaleDateString()
                            : metric.name === "Project Cost"
                              ? `$${metric.current.toLocaleString()}`
                              : metric.current}
                        </TableCell>
                        <TableCell>
                          <div className={`flex items-center ${
                            metric.isPositive ? 'text-success' : 'text-error'
                          }`}>
                            {metric.isPositive ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
                            {metric.name === "Completion Date"
                              ? `${Math.abs(metric.difference)} days ${metric.difference > 0 ? "earlier" : "later"}`
                              : metric.name === "Project Cost"
                                ? `$${Math.abs(metric.difference).toLocaleString()} ${metric.isPositive ? "savings" : "increase"}`
                                : `${metric.difference > 0 ? "+" : ""}${metric.difference} (${metric.percentChange}%)`
                            }
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {selectedScenarios.length > 0 && getSelectedScenarios()[0]?.results?.comparisonToBaseline && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Parameter Divergence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getSelectedScenarios()[0]?.genAIConfiguration.accelerators.length > 0 && (
                <div className="border-l-4 border-primary p-4 bg-primary/5 rounded-r-md">
                  <h4 className="font-medium mb-1">GenAI Accelerators</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="px-2 py-1 bg-muted/50 rounded text-xs">Baseline: None</div>
                    <ArrowRight size={16} />
                    <div className="px-2 py-1 bg-primary/20 rounded text-xs">
                      Current: {getSelectedScenarios()[0]?.genAIConfiguration.accelerators.length} tools enabled
                    </div>
                  </div>
                  <p className="text-sm">
                    The addition of GenAI accelerators contributes to a {getSelectedScenarios()[0]?.results?.comparisonToBaseline?.timeReduction}% 
                    time reduction and ${getSelectedScenarios()[0]?.results?.comparisonToBaseline?.costReduction.toLocaleString()} 
                    in cost savings through improved developer productivity.
                  </p>
                </div>
              )}
              
              {getSelectedScenarios()[0]?.teamConfiguration.teamSize !== baselineScenario.teamConfiguration.teamSize && (
                <div className="border-l-4 border-secondary p-4 bg-secondary/5 rounded-r-md">
                  <h4 className="font-medium mb-1">Team Composition</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="px-2 py-1 bg-muted/50 rounded text-xs">
                      Baseline: {baselineScenario.teamConfiguration.teamSize} team members
                    </div>
                    <ArrowRight size={16} />
                    <div className="px-2 py-1 bg-secondary/20 rounded text-xs">
                      Current: {getSelectedScenarios()[0]?.teamConfiguration.teamSize} team members
                    </div>
                  </div>
                  <p className="text-sm">
                    The {getSelectedScenarios()[0]?.teamConfiguration.teamSize > baselineScenario.teamConfiguration.teamSize ? 'increase' : 'decrease'} in 
                    team size affects overall velocity and cost structure, resulting in different resource utilization patterns.
                  </p>
                </div>
              )}
              
              {getSelectedScenarios()[0]?.processParameters.sprintLength !== baselineScenario.processParameters.sprintLength && (
                <div className="border-l-4 border-warning p-4 bg-warning/5 rounded-r-md">
                  <h4 className="font-medium mb-1">Process Parameters</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="px-2 py-1 bg-muted/50 rounded text-xs">
                      Baseline: {baselineScenario.processParameters.sprintLength}-week sprints
                    </div>
                    <ArrowRight size={16} />
                    <div className="px-2 py-1 bg-warning/20 rounded text-xs">
                      Current: {getSelectedScenarios()[0]?.processParameters.sprintLength}-week sprints
                    </div>
                  </div>
                  <p className="text-sm">
                    Sprint length changes impact delivery cadence and team overhead, affecting overall project timeline.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScenarioComparison;
