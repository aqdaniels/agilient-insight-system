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
  ReferenceLine
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { SimulationResults } from "../../simulation/types";
import { Info } from "lucide-react";  // Replace InfoCircle with Info
import { format } from "date-fns";

interface TimelineAnalysisProps {
  results: SimulationResults;
}

const BurndownChartData = [
  { sprint: "Sprint 1", remaining: 300, completed: 30, planned: 290 },
  { sprint: "Sprint 2", remaining: 270, completed: 60, planned: 260 },
  { sprint: "Sprint 3", remaining: 238, completed: 92, planned: 230 },
  { sprint: "Sprint 4", remaining: 204, completed: 126, planned: 200 },
  { sprint: "Sprint 5", remaining: 168, completed: 162, planned: 170 },
  { sprint: "Sprint 6", remaining: 133, completed: 197, planned: 140 },
  { sprint: "Sprint 7", remaining: 95, completed: 235, planned: 105 },
  { sprint: "Sprint 8", remaining: 63, completed: 267, planned: 70 },
  { sprint: "Sprint 9", remaining: 25, completed: 305, planned: 35 },
  { sprint: "Sprint 10", remaining: 0, completed: 330, planned: 0 },
];

const MilestoneData = [
  { name: "MVP Release", date: "2025-07-15", probability: 0.95, sprint: "Sprint 4" },
  { name: "Beta Launch", date: "2025-08-30", probability: 0.75, sprint: "Sprint 8" },
  { name: "Public Release", date: "2025-09-30", probability: 0.6, sprint: "Sprint 10" }
];

const TimelineAnalysis: React.FC<TimelineAnalysisProps> = ({ results }) => {
  const probabilityData = results.completionDistribution.map(point => ({
    date: format(point.date, "MMM dd"),
    probability: Math.round(point.probability * 100)
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Delivery Burndown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer
                config={{
                  remaining: { 
                    label: "Story Points Remaining", 
                    color: "#f43f5e" 
                  },
                  completed: { 
                    label: "Story Points Completed", 
                    color: "#06b6d4" 
                  },
                  planned: { 
                    label: "Planned Burndown", 
                    color: "#6b7280" 
                  }
                }}
              >
                <LineChart data={BurndownChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sprint" />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="remaining"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="planned"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                  />
                  {MilestoneData.map((milestone, index) => (
                    <ReferenceLine
                      key={index}
                      x={milestone.sprint}
                      stroke="#8884d8"
                      label={{
                        value: milestone.name,
                        position: "insideTopRight",
                        fill: "#8884d8"
                      }}
                    />
                  ))}
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <span>Completion Confidence Over Time</span>
              <Info size={16} className="ml-2 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartContainer
                config={{
                  probability: { 
                    label: "Probability of Completion", 
                    color: "#3b82f6" 
                  }
                }}
              >
                <AreaChart data={probabilityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="probability" 
                    stroke="#3b82f6" 
                    fill="#3b82f680"
                  />
                  <ReferenceLine 
                    y={90} 
                    label="P90" 
                    stroke="#10b981" 
                    strokeDasharray="3 3" 
                  />
                  <ReferenceLine 
                    y={50} 
                    label="P50" 
                    stroke="#f59e0b" 
                    strokeDasharray="3 3" 
                  />
                  <ReferenceLine 
                    y={10} 
                    label="P10" 
                    stroke="#ef4444" 
                    strokeDasharray="3 3" 
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Milestone Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MilestoneData.map((milestone, index) => (
                <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-medium">{milestone.name}</h4>
                    <span className="text-sm">{new Date(milestone.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          milestone.probability > 0.8 ? 'bg-success' :
                          milestone.probability > 0.5 ? 'bg-warning' :
                          'bg-error'
                        }`}
                        style={{ width: `${milestone.probability * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{Math.round(milestone.probability * 100)}%</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {milestone.probability > 0.8 ? 'High confidence' : 
                     milestone.probability > 0.5 ? 'Medium confidence' : 'At risk'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Critical Path Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The critical path consists of 12 work items across 3 epics, with a total of 85 story points.
              The following items are on the critical path and may impact the delivery timeline:
            </p>
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="py-2 px-3 text-left">Item</th>
                  <th className="py-2 px-3 text-left">Epic</th>
                  <th className="py-2 px-3 text-left">Sprint</th>
                  <th className="py-2 px-3 text-left">Points</th>
                  <th className="py-2 px-3 text-left">Risk</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-muted">
                  <td className="py-2 px-3">DB Schema Migration</td>
                  <td className="py-2 px-3">Data Layer Redesign</td>
                  <td className="py-2 px-3">Sprint 3</td>
                  <td className="py-2 px-3">13</td>
                  <td className="py-2 px-3"><span className="text-warning font-medium">Medium</span></td>
                </tr>
                <tr className="border-b border-muted">
                  <td className="py-2 px-3">Auth Service Integration</td>
                  <td className="py-2 px-3">Security Overhaul</td>
                  <td className="py-2 px-3">Sprint 4-5</td>
                  <td className="py-2 px-3">21</td>
                  <td className="py-2 px-3"><span className="text-error font-medium">High</span></td>
                </tr>
                <tr className="border-b border-muted">
                  <td className="py-2 px-3">Payment Processing</td>
                  <td className="py-2 px-3">Checkout Flow</td>
                  <td className="py-2 px-3">Sprint 6</td>
                  <td className="py-2 px-3">8</td>
                  <td className="py-2 px-3"><span className="text-success font-medium">Low</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimelineAnalysis;
