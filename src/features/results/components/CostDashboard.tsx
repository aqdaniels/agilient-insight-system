
import React from "react";
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
  Area,
  AreaChart,
  Line,
  LineChart,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { DataCard } from "@/components/design-system";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

const costProjectionData = [
  { month: "May", team: 25000, infrastructure: 5000, licenses: 2000, other: 1000, total: 33000 },
  { month: "Jun", team: 25000, infrastructure: 5500, licenses: 2000, other: 1500, total: 34000 },
  { month: "Jul", team: 30000, infrastructure: 5500, licenses: 2000, other: 1500, total: 39000 },
  { month: "Aug", team: 30000, infrastructure: 6000, licenses: 2000, other: 2000, total: 40000 },
  { month: "Sep", team: 30000, infrastructure: 6000, licenses: 2000, other: 2000, total: 40000 }
];

const genAIROIData = [
  { month: "May", investment: 3000, savings: 4500, net: 1500 },
  { month: "Jun", investment: 3000, savings: 6000, net: 3000 },
  { month: "Jul", investment: 3000, savings: 7500, net: 4500 },
  { month: "Aug", investment: 3000, savings: 9000, net: 6000 },
  { month: "Sep", investment: 3000, savings: 10500, net: 7500 }
];

const costVarianceData = [
  { category: "Team Salaries", planned: 140000, actual: 135000, variance: -5000 },
  { category: "Infrastructure", planned: 28000, actual: 32000, variance: 4000 },
  { category: "Software Licenses", planned: 10000, actual: 10000, variance: 0 },
  { category: "GenAI Tools", planned: 15000, actual: 12000, variance: -3000 },
  { category: "Contingency", planned: 19300, actual: 0, variance: -19300 }
];

const costBreakdownData = [
  { name: "Team Salaries", value: 135000, color: "#3b82f6" },
  { name: "Infrastructure", value: 32000, color: "#10b981" },
  { name: "Software Licenses", value: 10000, color: "#f59e0b" },
  { name: "GenAI Tools", value: 12000, color: "#8b5cf6" }
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

const CostDashboard: React.FC = () => {
  const totalPlanned = costVarianceData.reduce((sum, item) => sum + item.planned, 0);
  const totalActual = costVarianceData.reduce((sum, item) => sum + item.actual, 0);
  const totalVariance = totalActual - totalPlanned;
  
  // Calculate ROI data
  const totalInvestment = genAIROIData.reduce((sum, item) => sum + item.investment, 0);
  const totalSavings = genAIROIData.reduce((sum, item) => sum + item.savings, 0);
  const roi = ((totalSavings - totalInvestment) / totalInvestment) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DataCard
          title="Total Project Cost"
          value={`$${totalActual.toLocaleString()}`}
          caption={`${totalVariance < 0 ? 'Under' : 'Over'} budget by $${Math.abs(totalVariance).toLocaleString()}`}
          trend={{ value: Math.round((totalVariance / totalPlanned) * 100), isPositive: totalVariance <= 0 }}
          icon={<DollarSign size={18} />}
        />
        
        <DataCard
          title="GenAI ROI"
          value={`${Math.round(roi)}%`}
          caption={`$${totalSavings.toLocaleString()} total savings`}
          trend={{ value: roi > 0 ? Math.round(roi) : 0, isPositive: roi > 0 }}
          icon={<TrendingUp size={18} />}
        />
        
        <DataCard
          title="Cost per Story Point"
          value="$417"
          caption="15% below industry average"
          trend={{ value: 15, isPositive: true }}
          icon={<TrendingDown size={18} />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Cost Projection Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartContainer
                config={{
                  team: { 
                    label: "Team", 
                    color: "#3b82f6" 
                  },
                  infrastructure: { 
                    label: "Infrastructure", 
                    color: "#10b981" 
                  },
                  licenses: { 
                    label: "Licenses", 
                    color: "#f59e0b" 
                  },
                  other: { 
                    label: "Other", 
                    color: "#8b5cf6" 
                  },
                  total: { 
                    label: "Total", 
                    color: "#6b7280" 
                  }
                }}
              >
                <AreaChart data={costProjectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="team" 
                    stackId="1" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="infrastructure" 
                    stackId="1" 
                    stroke="#10b981" 
                    fill="#10b981" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="licenses" 
                    stackId="1" 
                    stroke="#f59e0b" 
                    fill="#f59e0b" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="other" 
                    stackId="1" 
                    stroke="#8b5cf6" 
                    fill="#8b5cf6" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#6b7280" 
                    strokeWidth={2} 
                    dot={{ r: 4 }}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">GenAI Investment & ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartContainer
                config={{
                  investment: { 
                    label: "Investment", 
                    color: "#f59e0b" 
                  },
                  savings: { 
                    label: "Cost Savings", 
                    color: "#10b981" 
                  },
                  net: { 
                    label: "Net Benefit", 
                    color: "#3b82f6" 
                  }
                }}
              >
                <BarChart data={genAIROIData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  />
                  <Legend />
                  <Bar dataKey="investment" />
                  <Bar dataKey="savings" />
                  <Bar dataKey="net" />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Cost Variance Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartContainer
                config={{
                  planned: { 
                    label: "Planned Budget", 
                    color: "#6b7280" 
                  },
                  actual: { 
                    label: "Actual Cost", 
                    color: "#3b82f6" 
                  }
                }}
              >
                <BarChart 
                  data={costVarianceData}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 30,
                    left: 100,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `$${value / 1000}k`} />
                  <YAxis type="category" dataKey="category" />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  />
                  <Legend />
                  <Bar dataKey="planned" />
                  <Bar dataKey="actual" />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {costBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `$${value.toLocaleString()}`} 
                    labelFormatter={(name) => `${name}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CostDashboard;
