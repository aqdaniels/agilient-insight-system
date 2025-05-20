
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/design-system";
import { VelocityPoint } from "../../simulation/types";

interface DeliveryMetricsProps {
  velocityTrend: VelocityPoint[];
}

const storyPointDistributionData = [
  { sprint: "Sprint 1", frontend: 12, backend: 10, design: 5, qa: 3, total: 30 },
  { sprint: "Sprint 2", frontend: 10, backend: 13, design: 6, qa: 3, total: 32 },
  { sprint: "Sprint 3", frontend: 8, backend: 15, design: 5, qa: 5, total: 33 },
  { sprint: "Sprint 4", frontend: 9, backend: 14, design: 4, qa: 7, total: 34 },
  { sprint: "Sprint 5", frontend: 11, backend: 13, design: 6, qa: 6, total: 36 },
  { sprint: "Sprint 6", frontend: 13, backend: 12, design: 5, qa: 5, total: 35 },
  { sprint: "Sprint 7", frontend: 14, backend: 10, design: 8, qa: 5, total: 37 },
  { sprint: "Sprint 8", frontend: 15, backend: 12, design: 7, qa: 6, total: 40 }
];

const workTypeBreakdownData = [
  { name: "Features", value: 55, color: "#3b82f6" },
  { name: "Bug Fixes", value: 15, color: "#ef4444" },
  { name: "Technical Debt", value: 20, color: "#f59e0b" },
  { name: "Documentation", value: 10, color: "#10b981" }
];

const completionPercentageData = [
  { sprint: "Sprint 1", planned: 10, actual: 10, total: 300 },
  { sprint: "Sprint 2", planned: 20, actual: 20, total: 300 },
  { sprint: "Sprint 3", planned: 30, actual: 31, total: 300 },
  { sprint: "Sprint 4", planned: 40, actual: 42, total: 300 },
  { sprint: "Sprint 5", planned: 50, actual: 54, total: 300 },
  { sprint: "Sprint 6", planned: 60, actual: 65, total: 300 },
  { sprint: "Sprint 7", planned: 70, actual: 78, total: 300 },
  { sprint: "Sprint 8", planned: 80, actual: 87, total: 300 },
  { sprint: "Sprint 9", planned: 90, actual: 95, total: 300 },
  { sprint: "Sprint 10", planned: 100, actual: 100, total: 300 }
];

const DeliveryMetrics: React.FC<DeliveryMetricsProps> = ({ velocityTrend }) => {
  // Process velocity trend data to include confidence bands
  const velocityWithBands = velocityTrend.map(point => ({
    sprint: `Sprint ${point.sprint}`,
    velocity: point.velocity,
    upper: Math.round(point.velocity * 1.2), // 20% upper band
    lower: Math.round(point.velocity * 0.8)  // 20% lower band
  }));

  // Transform completion percentage for better visualization
  const transformedCompletionData = completionPercentageData.map(item => ({
    sprint: item.sprint,
    planned: item.planned,
    actual: item.actual,
    difference: item.actual - item.planned
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">Velocity Projection</CardTitle>
              <Badge variant="success">Trending Up</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartContainer
                config={{
                  velocity: { 
                    label: "Team Velocity", 
                    color: "#3b82f6" 
                  },
                  upper: { 
                    label: "Upper Bound (P90)", 
                    color: "#10b981" 
                  },
                  lower: { 
                    label: "Lower Bound (P10)", 
                    color: "#f59e0b" 
                  }
                }}
              >
                <AreaChart data={velocityWithBands}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sprint" />
                  <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="upper" 
                    stroke="#10b981" 
                    fill="#10b98120" 
                    activeDot={false}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="lower" 
                    stroke="#f59e0b" 
                    fill="#f59e0b20" 
                    activeDot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="velocity" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Completion Percentage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartContainer
                config={{
                  planned: { 
                    label: "Planned", 
                    color: "#6b7280" 
                  },
                  actual: { 
                    label: "Actual", 
                    color: "#3b82f6" 
                  }
                }}
              >
                <LineChart data={transformedCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sprint" />
                  <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="planned" 
                    stroke="#6b7280" 
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Story Point Distribution</CardTitle>
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
                  }
                }}
              >
                <BarChart data={storyPointDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sprint" />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  />
                  <Legend />
                  <Bar dataKey="frontend" stackId="a" />
                  <Bar dataKey="backend" stackId="a" />
                  <Bar dataKey="design" stackId="a" />
                  <Bar dataKey="qa" stackId="a" />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Work Type Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={workTypeBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {workTypeBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${value} story points`} 
                    labelFormatter={(name) => `${name}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Delivery Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-base mb-2">Velocity Trends</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-success"></span>
                  <span>Increasing velocity trend (+5% per sprint)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-success"></span>
                  <span>Team stabilizing after Sprint 3</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-warning"></span>
                  <span>Sprint 6 velocity drop (holiday impact)</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-base mb-2">Story Distribution</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-warning"></span>
                  <span>Backend heavy in early sprints</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-info"></span>
                  <span>Frontend increases in later sprints</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-success"></span>
                  <span>QA distribution aligned with dependencies</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-base mb-2">Completion Rate</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-success"></span>
                  <span>Ahead of plan by 7% in Sprint 7</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-info"></span>
                  <span>Tech debt paydown improving velocity</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-warning"></span>
                  <span>Risk of slowdown in final sprints</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryMetrics;
