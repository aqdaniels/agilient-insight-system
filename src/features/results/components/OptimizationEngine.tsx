
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, Button } from "@/components/design-system";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const teamOptimizationData = [
  { 
    role: "Frontend Developer", 
    current: 2, 
    recommended: 3, 
    impact: 15,
    description: "Adding one frontend developer could accelerate UI implementation and improve velocity by 15%."
  },
  { 
    role: "Backend Developer", 
    current: 3, 
    recommended: 3, 
    impact: 0,
    description: "Current backend staffing is optimal based on the workload distribution."
  },
  { 
    role: "DevOps Engineer", 
    current: 1, 
    recommended: 2, 
    impact: 10,
    description: "An additional DevOps engineer would reduce deployment bottlenecks and improve CI/CD pipeline efficiency."
  },
  { 
    role: "QA Engineer", 
    current: 1, 
    recommended: 2, 
    impact: 8,
    description: "Adding a QA engineer would improve test coverage and reduce defect escape rate."
  },
  { 
    role: "Designer", 
    current: 2, 
    recommended: 1, 
    impact: -5,
    description: "Design work front-loaded; consider reassigning one designer after Sprint 3."
  }
];

const skillInvestmentData = [
  { 
    skill: "React Performance Optimization", 
    priority: 9, 
    timeToAcquire: 3, 
    impact: "High",
    description: "Training team on advanced React performance techniques could improve frontend performance by 30%."
  },
  { 
    skill: "GraphQL & Apollo", 
    priority: 8, 
    timeToAcquire: 4, 
    impact: "High",
    description: "Implementing GraphQL would reduce network payload size and improve data fetching efficiency."
  },
  { 
    skill: "Automated UI Testing", 
    priority: 7, 
    timeToAcquire: 2, 
    impact: "Medium",
    description: "Establishing a comprehensive UI testing framework would catch 40% more bugs before release."
  },
  { 
    skill: "Kubernetes Management", 
    priority: 6, 
    timeToAcquire: 5, 
    impact: "Medium",
    description: "Better Kubernetes knowledge would improve deployment reliability and scaling capabilities."
  },
  { 
    skill: "Accessibility Compliance", 
    priority: 5, 
    timeToAcquire: 2, 
    impact: "Medium",
    description: "Training on accessibility would ensure WCAG 2.1 compliance and reduce legal risks."
  }
];

const genAIAdoptionData = [
  { 
    phase: "Initial Setup", 
    effort: 4, 
    value: 2,
    description: "Set up development environment integrations with GenAI tools and establish coding standards."
  },
  { 
    phase: "Developer Training", 
    effort: 3, 
    value: 4,
    description: "Train developers on effective prompt engineering and integrating AI-generated code."
  },
  { 
    phase: "Workflow Integration", 
    effort: 5, 
    value: 7,
    description: "Integrate AI tools into the daily workflow with code review and quality control processes."
  },
  { 
    phase: "Process Refinement", 
    effort: 2, 
    value: 5,
    description: "Optimize prompts and processes based on team feedback and effectiveness metrics."
  },
  { 
    phase: "Advanced Use Cases", 
    effort: 4, 
    value: 9,
    description: "Expand to automated testing, documentation generation, and code optimization."
  }
];

const processImprovementData = [
  { name: "Code Review Process", value: 9, fill: "#3b82f6" },
  { name: "Sprint Planning", value: 7, fill: "#10b981" },
  { name: "Requirement Gathering", value: 8, fill: "#f59e0b" },
  { name: "CI/CD Pipeline", value: 6, fill: "#8b5cf6" },
  { name: "Testing Strategy", value: 9, fill: "#ec4899" }
];

const backlogRestructuringData = [
  { 
    strategy: "Feature Slicing", 
    flowImprovement: 7, 
    timeToImplement: 1,
    impact: "High", 
    description: "Restructure features into vertical slices that deliver value incrementally."
  },
  { 
    strategy: "Dependency Reordering", 
    flowImprovement: 8, 
    timeToImplement: 2,
    impact: "High", 
    description: "Resequence work items to minimize blocked tasks and maximize parallel development."
  },
  { 
    strategy: "Risk-Based Prioritization", 
    flowImprovement: 6, 
    timeToImplement: 1,
    impact: "Medium", 
    description: "Reprioritize backlog to address high-risk items early in the development cycle."
  },
  { 
    strategy: "Value Stream Mapping", 
    flowImprovement: 9, 
    timeToImplement: 3,
    impact: "High", 
    description: "Apply value stream mapping to eliminate waste and optimize delivery flow."
  },
  { 
    strategy: "MVP Refinement", 
    flowImprovement: 5, 
    timeToImplement: 1,
    impact: "Medium", 
    description: "Refine the minimum viable product definition to focus on core value delivery."
  }
];

const OptimizationEngine: React.FC = () => {
  const [activeTab, setActiveTab] = useState("team");

  return (
    <div className="space-y-6">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="team">Team Composition</TabsTrigger>
          <TabsTrigger value="skills">Skill Investment</TabsTrigger>
          <TabsTrigger value="genai">GenAI Adoption</TabsTrigger>
          <TabsTrigger value="process">Process Improvement</TabsTrigger>
          <TabsTrigger value="backlog">Backlog Structure</TabsTrigger>
        </TabsList>
        
        <TabsContent value="team" className="pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Team Composition Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ChartContainer
                  config={{
                    current: { 
                      label: "Current Team", 
                      color: "#6b7280" 
                    },
                    recommended: { 
                      label: "Recommended Team", 
                      color: "#3b82f6" 
                    }
                  }}
                >
                  <BarChart
                    data={teamOptimizationData}
                    layout="vertical"
                    margin={{
                      top: 5,
                      right: 30,
                      left: 120,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="role" />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                    />
                    <Legend />
                    <Bar dataKey="current" />
                    <Bar dataKey="recommended" />
                  </BarChart>
                </ChartContainer>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-3">Staffing Recommendations & Impact</h3>
                <div className="space-y-4">
                  {teamOptimizationData
                    .filter(item => item.impact !== 0) // Only show items with impact
                    .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact)) // Sort by absolute impact value
                    .map((item, index) => (
                      <div 
                        key={index} 
                        className={`border-l-4 p-4 rounded-r-md ${
                          item.impact > 0 
                            ? 'border-success bg-success/5' 
                            : 'border-warning bg-warning/5'
                        }`}
                      >
                        <h4 className="font-medium mb-1">{item.role}</h4>
                        <div className="flex items-center gap-1 text-sm mb-2">
                          <span>Current: {item.current}</span>
                          <span className="mx-1">→</span>
                          <span>Recommended: {item.recommended}</span>
                          <Badge 
                            variant={item.impact > 0 ? "success" : "warning"}
                            className="ml-2"
                          >
                            {item.impact > 0 ? `+${item.impact}%` : `${item.impact}%`} Impact
                          </Badge>
                        </div>
                        <p className="text-sm">{item.description}</p>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="skills" className="pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Skill Investment Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ChartContainer
                  config={{
                    priority: { 
                      label: "Investment Priority", 
                      color: "#3b82f6" 
                    },
                    timeToAcquire: { 
                      label: "Time to Acquire (weeks)", 
                      color: "#f59e0b" 
                    }
                  }}
                >
                  <BarChart data={skillInvestmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="skill" />
                    <YAxis />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                    />
                    <Legend />
                    <Bar dataKey="priority" />
                    <Bar dataKey="timeToAcquire" />
                  </BarChart>
                </ChartContainer>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-3">Skill Development Plan</h3>
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="py-2 px-3 text-left">Skill</th>
                      <th className="py-2 px-3 text-left">Priority</th>
                      <th className="py-2 px-3 text-left">Time to Acquire</th>
                      <th className="py-2 px-3 text-left">Impact</th>
                      <th className="py-2 px-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skillInvestmentData.map((skill, index) => (
                      <tr key={index} className="border-b border-muted">
                        <td className="py-2 px-3">{skill.skill}</td>
                        <td className="py-2 px-3">{skill.priority}/10</td>
                        <td className="py-2 px-3">{skill.timeToAcquire} weeks</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            skill.impact === 'High' ? 'bg-success/20 text-success' :
                            skill.impact === 'Medium' ? 'bg-warning/20 text-warning' :
                            'bg-info/20 text-info'
                          }`}>
                            {skill.impact}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <Button variant="ghost" size="sm">View Strategy</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="genai" className="pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">GenAI Adoption Guidance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ChartContainer
                  config={{
                    effort: { 
                      label: "Implementation Effort", 
                      color: "#f59e0b" 
                    },
                    value: { 
                      label: "Business Value", 
                      color: "#10b981" 
                    }
                  }}
                >
                  <BarChart data={genAIAdoptionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="phase" />
                    <YAxis domain={[0, 10]} />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                    />
                    <Legend />
                    <Bar dataKey="effort" />
                    <Bar dataKey="value" />
                  </BarChart>
                </ChartContainer>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-3">Implementation Steps</h3>
                <div className="relative">
                  <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-muted"></div>
                  <div className="space-y-6">
                    {genAIAdoptionData.map((phase, index) => (
                      <div key={index} className="relative pl-10">
                        <div className="absolute left-2.5 -translate-x-1/2 bg-background p-1 z-10">
                          <div className={`h-4 w-4 rounded-full ${
                            phase.value >= 7 ? 'bg-success' :
                            phase.value >= 4 ? 'bg-warning' : 
                            'bg-info'
                          }`}></div>
                        </div>
                        <div className="border rounded-md p-3">
                          <h4 className="font-medium">{index + 1}. {phase.phase}</h4>
                          <div className="flex flex-wrap gap-2 my-2">
                            <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-warning/10 text-warning">
                              Effort: {phase.effort}/10
                            </span>
                            <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">
                              Value: {phase.value}/10
                            </span>
                            <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              ROI: {(phase.value / phase.effort).toFixed(1)}x
                            </span>
                          </div>
                          <p className="text-sm">{phase.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="process" className="pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Process Improvement Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={processImprovementData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          dataKey="value"
                          nameKey="name"
                          label={({ name, value }) => `${name}: ${value}/10`}
                        >
                          {processImprovementData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`Priority: ${value}/10`]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Top Improvement Areas</h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-[#3b82f6] p-3 bg-[#3b82f6]/5 rounded-r-md">
                      <h4 className="font-medium">Code Review Process</h4>
                      <p className="text-sm mt-1">Current code reviews are adding 1.5 days to story completion. Implementing pair programming and async reviews could reduce cycle time by 30%.</p>
                    </div>
                    <div className="border-l-4 border-[#f59e0b] p-3 bg-[#f59e0b]/5 rounded-r-md">
                      <h4 className="font-medium">Requirement Gathering</h4>
                      <p className="text-sm mt-1">25% of stories require rework due to unclear requirements. Implementing a structured requirements template and validation process could reduce rework by 75%.</p>
                    </div>
                    <div className="border-l-4 border-[#ec4899] p-3 bg-[#ec4899]/5 rounded-r-md">
                      <h4 className="font-medium">Testing Strategy</h4>
                      <p className="text-sm mt-1">End-heavy testing creates bottlenecks. Shifting to TDD and integrating automated testing earlier could improve quality and reduce late-stage defects by 40%.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-3">Implementation Roadmap</h3>
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="py-2 px-3 text-left">Process Area</th>
                      <th className="py-2 px-3 text-left">Current Metric</th>
                      <th className="py-2 px-3 text-left">Target Improvement</th>
                      <th className="py-2 px-3 text-left">Timeline</th>
                      <th className="py-2 px-3 text-left">Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-muted">
                      <td className="py-2 px-3">Code Review</td>
                      <td className="py-2 px-3">1.5 days/story</td>
                      <td className="py-2 px-3">0.5 days/story (-67%)</td>
                      <td className="py-2 px-3">2 weeks</td>
                      <td className="py-2 px-3">Tech Lead</td>
                    </tr>
                    <tr className="border-b border-muted">
                      <td className="py-2 px-3">Requirement Gathering</td>
                      <td className="py-2 px-3">25% rework rate</td>
                      <td className="py-2 px-3">6% rework rate (-75%)</td>
                      <td className="py-2 px-3">3 weeks</td>
                      <td className="py-2 px-3">Product Owner</td>
                    </tr>
                    <tr className="border-b border-muted">
                      <td className="py-2 px-3">Testing Strategy</td>
                      <td className="py-2 px-3">70% end-stage testing</td>
                      <td className="py-2 px-3">30% end-stage testing</td>
                      <td className="py-2 px-3">1 month</td>
                      <td className="py-2 px-3">QA Lead</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="backlog" className="pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Backlog Restructuring Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ChartContainer
                  config={{
                    flowImprovement: { 
                      label: "Flow Improvement", 
                      color: "#3b82f6" 
                    },
                    timeToImplement: { 
                      label: "Implementation Time (weeks)", 
                      color: "#f59e0b" 
                    }
                  }}
                >
                  <BarChart data={backlogRestructuringData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="strategy" />
                    <YAxis domain={[0, 10]} />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                    />
                    <Legend />
                    <Bar dataKey="flowImprovement" />
                    <Bar dataKey="timeToImplement" />
                  </BarChart>
                </ChartContainer>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-3">Recommended Restructuring Approach</h3>
                <div className="space-y-4">
                  {backlogRestructuringData
                    .sort((a, b) => (b.flowImprovement / b.timeToImplement) - (a.flowImprovement / a.timeToImplement))
                    .map((strategy, index) => (
                      <div 
                        key={index} 
                        className={`border p-4 rounded-md ${
                          index === 0 ? 'border-success bg-success/5' : 'border-muted'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{strategy.strategy}</h4>
                          <Badge variant={
                            strategy.impact === "High" ? "success" : 
                            strategy.impact === "Medium" ? "warning" : "default"
                          }>
                            {strategy.impact} Impact
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm mb-2">
                          <span className="flex items-center gap-1">
                            <span className="font-medium">Flow Improvement:</span>
                            {strategy.flowImprovement}/10
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="font-medium">Implementation Time:</span>
                            {strategy.timeToImplement} {strategy.timeToImplement === 1 ? 'week' : 'weeks'}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="font-medium">ROI Ratio:</span>
                            {(strategy.flowImprovement / strategy.timeToImplement).toFixed(1)}
                          </span>
                        </div>
                        <p className="text-sm">{strategy.description}</p>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OptimizationEngine;
