
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";

interface UtilizationPoint {
  sprint: string;
  frontend: number;
  backend: number;
  design: number;
  qa: number;
  devops: number;
  management: number;
}

interface UtilizationChartProps {
  utilizationData: UtilizationPoint[];
}

const UtilizationChart: React.FC<UtilizationChartProps> = ({ utilizationData }) => {
  const roleColors = {
    frontend: "#0088FE",
    backend: "#00C49F",
    design: "#FFBB28",
    qa: "#FF8042",
    devops: "#8884d8",
    management: "#82ca9d"
  };
  
  const roleLabels = {
    frontend: "Frontend",
    backend: "Backend",
    design: "Design",
    qa: "QA & Testing",
    devops: "DevOps",
    management: "Management"
  };

  // Calculate average utilization by role
  const avgUtilization = Object.keys(roleColors).reduce((acc, role) => {
    const avg = utilizationData.reduce((sum, sprint) => {
      return sum + (sprint[role as keyof UtilizationPoint] as number);
    }, 0) / utilizationData.length;
    
    acc[role] = Math.round(avg);
    return acc;
  }, {} as Record<string, number>);

  // Create data for average utilization by role
  const avgUtilizationData = Object.keys(roleColors).map(role => ({
    name: roleLabels[role as keyof typeof roleLabels],
    value: avgUtilization[role],
    color: roleColors[role as keyof typeof roleColors]
  }));

  return (
    <div className="space-y-6">
      <div className="h-80">
        <h4 className="text-sm font-medium mb-4">Resource Utilization by Sprint</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={utilizationData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="sprint" />
            <YAxis 
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
            />
            <Tooltip 
              formatter={(value) => `${value}%`}
            />
            <Legend />
            <Bar dataKey="frontend" name="Frontend" fill="#0088FE" />
            <Bar dataKey="backend" name="Backend" fill="#00C49F" />
            <Bar dataKey="design" name="Design" fill="#FFBB28" />
            <Bar dataKey="qa" name="QA & Testing" fill="#FF8042" />
            <Bar dataKey="devops" name="DevOps" fill="#8884d8" />
            <Bar dataKey="management" name="Management" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-4">Average Utilization by Role</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={avgUtilizationData}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 40,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis 
                type="number" 
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis 
                type="category" 
                dataKey="name"
              />
              <Tooltip 
                formatter={(value) => `${value}%`}
              />
              <Bar dataKey="value">
                {avgUtilizationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-muted/30 p-3 rounded-md">
          <div className="text-xs text-muted-foreground">Highest Utilization</div>
          <div className="text-xl font-bold">
            {Object.entries(avgUtilization).reduce(
              (max, [role, value]) => value > max.value ? { role: roleLabels[role as keyof typeof roleLabels], value } : max,
              { role: "", value: 0 }
            ).role}: {Object.entries(avgUtilization).reduce(
              (max, [_, value]) => value > max ? value : max, 0
            )}%
          </div>
        </div>
        <div className="bg-muted/30 p-3 rounded-md">
          <div className="text-xs text-muted-foreground">Lowest Utilization</div>
          <div className="text-xl font-bold">
            {Object.entries(avgUtilization).reduce(
              (min, [role, value]) => value < min.value || min.value === 0 ? { role: roleLabels[role as keyof typeof roleLabels], value } : min, 
              { role: "", value: 0 }
            ).role}: {Object.entries(avgUtilization).reduce(
              (min, [_, value]) => (min === 0 || value < min) ? value : min, 0
            )}%
          </div>
        </div>
        <div className="bg-muted/30 p-3 rounded-md">
          <div className="text-xs text-muted-foreground">Overall Utilization</div>
          <div className="text-xl font-bold">
            {Math.round(
              Object.values(avgUtilization).reduce((sum, val) => sum + val, 0) / 
              Object.values(avgUtilization).length
            )}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default UtilizationChart;
