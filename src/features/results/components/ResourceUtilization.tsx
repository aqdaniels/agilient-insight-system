
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Scatter,
  ScatterChart,
  ZAxis,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const teamCapacityData = [
  { sprint: "Sprint 1", frontend: 90, backend: 70, design: 95, qa: 40, devops: 60, management: 80 },
  { sprint: "Sprint 2", frontend: 85, backend: 80, design: 70, qa: 50, devops: 65, management: 80 },
  { sprint: "Sprint 3", frontend: 80, backend: 90, design: 50, qa: 70, devops: 70, management: 80 },
  { sprint: "Sprint 4", frontend: 75, backend: 95, design: 40, qa: 85, devops: 75, management: 80 },
  { sprint: "Sprint 5", frontend: 70, backend: 90, design: 60, qa: 90, devops: 85, management: 80 },
  { sprint: "Sprint 6", frontend: 85, backend: 75, design: 80, qa: 95, devops: 90, management: 80 },
  { sprint: "Sprint 7", frontend: 95, backend: 70, design: 90, qa: 90, devops: 95, management: 80 },
  { sprint: "Sprint 8", frontend: 90, backend: 85, design: 95, qa: 85, devops: 90, management: 80 }
];

const skillUtilizationData = [
  { name: "React", utilization: 85, demand: 90, gap: -5 },
  { name: "Node.js", utilization: 90, demand: 85, gap: 5 },
  { name: "UX Design", utilization: 75, demand: 85, gap: -10 },
  { name: "API Design", utilization: 80, demand: 75, gap: 5 },
  { name: "DevOps", utilization: 65, demand: 80, gap: -15 },
  { name: "Automated Testing", utilization: 60, demand: 85, gap: -25 },
  { name: "Database", utilization: 85, demand: 70, gap: 15 },
  { name: "Cloud Architecture", utilization: 70, demand: 80, gap: -10 }
];

const bottleneckData = [
  { name: "Database Schema Migration", severity: 8, impact: 7, x: 8, y: 7, z: 10 },
  { name: "API Integration", severity: 7, impact: 9, x: 7, y: 9, z: 10 },
  { name: "Design System Implementation", severity: 6, impact: 5, x: 6, y: 5, z: 10 },
  { name: "Authentication Flow", severity: 9, impact: 8, x: 9, y: 8, z: 10 },
  { name: "CI/CD Pipeline", severity: 5, impact: 6, x: 5, y: 6, z: 10 },
  { name: "Performance Testing", severity: 7, impact: 7, x: 7, y: 7, z: 10 },
  { name: "Mobile Responsiveness", severity: 6, impact: 8, x: 6, y: 8, z: 10 },
];

const ResourceUtilization: React.FC = () => {
  const [timeframeFilter, setTimeframeFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredTeamData = teamCapacityData.filter(entry => {
    if (timeframeFilter === "all") return true;
    if (timeframeFilter === "early") return entry.sprint.includes("1") || entry.sprint.includes("2") || entry.sprint.includes("3");
    if (timeframeFilter === "middle") return entry.sprint.includes("4") || entry.sprint.includes("5") || entry.sprint.includes("6");
    if (timeframeFilter === "late") return entry.sprint.includes("7") || entry.sprint.includes("8");
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="w-48">
          <Select value={timeframeFilter} onValueChange={setTimeframeFilter}>
            <SelectTrigger className="transition-all duration-200 hover:border-primary focus:border-primary">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent className="animate-in fade-in-50 zoom-in-95 duration-200">
              <SelectItem value="all">All Sprints</SelectItem>
              <SelectItem value="early">Early Sprints (1-3)</SelectItem>
              <SelectItem value="middle">Middle Sprints (4-6)</SelectItem>
              <SelectItem value="late">Late Sprints (7-8)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-48">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="transition-all duration-200 hover:border-primary focus:border-primary">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent className="animate-in fade-in-50 zoom-in-95 duration-200">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="frontend">Frontend</SelectItem>
              <SelectItem value="backend">Backend</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="qa">QA</SelectItem>
              <SelectItem value="devops">DevOps</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Team Capacity Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartContainer
                config={{
                  frontend: { 
                    label: "Frontend", 
                    color: "#3b82f6" 
                  },
                  backend: { 
                    label: "Backend", 
                    color: "#10b981" 
                  },
                  design: { 
                    label: "Design", 
                    color: "#f59e0b" 
                  },
                  qa: { 
                    label: "QA", 
                    color: "#8b5cf6" 
                  },
                  devops: { 
                    label: "DevOps", 
                    color: "#ec4899" 
                  },
                  management: { 
                    label: "Management", 
                    color: "#6b7280" 
                  }
                }}
              >
                <BarChart data={filteredTeamData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sprint" />
                  <YAxis 
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 100]}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    animationDuration={200}
                  />
                  <Legend />
                  <Bar dataKey="frontend" className="transition-opacity duration-200 hover:opacity-80" />
                  <Bar dataKey="backend" className="transition-opacity duration-200 hover:opacity-80" />
                  <Bar dataKey="design" className="transition-opacity duration-200 hover:opacity-80" />
                  <Bar dataKey="qa" className="transition-opacity duration-200 hover:opacity-80" />
                  <Bar dataKey="devops" className="transition-opacity duration-200 hover:opacity-80" />
                  <Bar dataKey="management" className="transition-opacity duration-200 hover:opacity-80" />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Skill Utilization & Demand</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartContainer
                config={{
                  utilization: { 
                    label: "Current Utilization", 
                    color: "#3b82f6" 
                  },
                  demand: { 
                    label: "Project Demand", 
                    color: "#f59e0b" 
                  }
                }}
              >
                <BarChart
                  data={skillUtilizationData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number"
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name"
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    animationDuration={200}
                  />
                  <Legend />
                  <Bar dataKey="utilization" className="transition-opacity duration-200 hover:opacity-80" />
                  <Bar dataKey="demand" className="transition-opacity duration-200 hover:opacity-80" />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Bottleneck Identification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartContainer
                config={{
                  bottleneck: { 
                    label: "Bottleneck Severity", 
                    color: "#ef4444" 
                  },
                }}
              >
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="severity" 
                    unit=""
                    domain={[0, 10]} 
                    label={{ value: 'Severity', position: 'bottom' }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="impact" 
                    unit=""
                    domain={[0, 10]} 
                    label={{ value: 'Business Impact', angle: -90, position: 'left' }}
                  />
                  <ZAxis 
                    type="number" 
                    dataKey="z" 
                    range={[50, 400]} 
                    name="volume" 
                    unit="" 
                  />
                  <ChartTooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    content={<ChartTooltipContent />}
                    animationDuration={200}
                  />
                  <Scatter 
                    name="Bottlenecks" 
                    data={bottleneckData}
                    fill="#ef4444"
                    className="transition-opacity duration-200 hover:opacity-80"
                  >
                    {bottleneckData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.severity * entry.impact > 60 ? "#ef4444" :
                          entry.severity * entry.impact > 40 ? "#f59e0b" :
                          "#10b981"
                        }
                        className="transition-all duration-200 hover:opacity-80"
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Allocation Optimization Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-info p-4 bg-info/5 rounded-r-md transition-all duration-200 hover:bg-info/10 hover:translate-x-1">
                <h4 className="font-medium mb-1">Rebalance QA Resources</h4>
                <p className="text-sm">QA resources are underutilized in Sprint 1-2 but overutilized in Sprint 5-6. Consider shifting testing activities earlier to smooth resource needs.</p>
              </div>
              
              <div className="border-l-4 border-warning p-4 bg-warning/5 rounded-r-md transition-all duration-200 hover:bg-warning/10 hover:translate-x-1">
                <h4 className="font-medium mb-1">Backend Developer Skills Gap</h4>
                <p className="text-sm">Current backend team lacks sufficient API design expertise. Consider training or short-term consulting to bridge the knowledge gap.</p>
              </div>
              
              <div className="border-l-4 border-success p-4 bg-success/5 rounded-r-md transition-all duration-200 hover:bg-success/10 hover:translate-x-1">
                <h4 className="font-medium mb-1">Cross-training Opportunity</h4>
                <p className="text-sm">Database specialists are underutilized in Sprint 7-8. Consider cross-training on DevOps to support CI/CD pipeline implementation.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResourceUtilization;
