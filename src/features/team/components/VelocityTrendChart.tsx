import React from "react";
import { TeamVelocity } from "../containers/TeamConfigurator";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

interface VelocityTrendChartProps {
  velocityHistory: TeamVelocity[];
}

const VelocityTrendChart: React.FC<VelocityTrendChartProps> = ({ velocityHistory }) => {
  // Calculate average velocity
  const averageVelocity = velocityHistory.reduce(
    (sum, sprint) => sum + sprint.completedPoints, 0
  ) / velocityHistory.length;

  // Calculate trend line points for future prediction
  // Simple linear regression
  const n = velocityHistory.length;
  const xVals = Array.from({ length: n }, (_, i) => i + 1);
  const yVals = velocityHistory.map(item => item.completedPoints);
  
  const sumX = xVals.reduce((a, b) => a + b, 0);
  const sumY = yVals.reduce((a, b) => a + b, 0);
  const sumXY = xVals.reduce((sum, x, i) => sum + x * yVals[i], 0);
  const sumXX = xVals.reduce((sum, x) => sum + x * x, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Predict next 3 sprints
  const predictedData = [...velocityHistory];
  
  for (let i = 1; i <= 3; i++) {
    const sprintNum = n + i;
    const predictedVelocity = intercept + slope * sprintNum;
    
    predictedData.push({
      sprint: `Sprint ${n + i} (Projected)`,
      plannedPoints: Math.round(predictedVelocity),
      completedPoints: Math.round(predictedVelocity),
      date: "Projected"
    });
  }

  // Function to determine stroke dasharray based on data
  const getStrokeDashArray = (dataPoint: TeamVelocity) => {
    return dataPoint.date === "Projected" ? "5 5" : "0";
  };

  return (
    <div className="space-y-4">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={predictedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="sprint" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [
                value,
                name === "plannedPoints" ? "Planned Points" : "Completed Points"
              ]}
              labelFormatter={(label) => `${label}`}
            />
            <Legend />
            <ReferenceLine y={averageVelocity} stroke="#ff7300" strokeDasharray="3 3" label="Average" />
            <Line
              type="monotone"
              dataKey="plannedPoints"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="completedPoints"
              stroke="#82ca9d"
              activeDot={{ r: 8 }}
              strokeWidth={2}
              strokeDasharray={getStrokeDashArray(predictedData[0])}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-muted/30 p-3 rounded-md text-center">
          <div className="text-2xl font-bold">{Math.round(averageVelocity)}</div>
          <div className="text-xs text-muted-foreground">Avg. Velocity</div>
        </div>
        <div className="bg-muted/30 p-3 rounded-md text-center">
          <div className="text-2xl font-bold">
            {Math.round(predictedData[predictedData.length - 1].completedPoints)}
          </div>
          <div className="text-xs text-muted-foreground">Projected Velocity</div>
        </div>
        <div className="bg-muted/30 p-3 rounded-md text-center">
          <div className="text-2xl font-bold">
            {Math.max(...velocityHistory.map(sprint => sprint.completedPoints))}
          </div>
          <div className="text-xs text-muted-foreground">Max. Velocity</div>
        </div>
        <div className="bg-muted/30 p-3 rounded-md text-center">
          <div className={`text-2xl font-bold ${slope > 0 ? 'text-success' : slope < 0 ? 'text-error' : ''}`}>
            {slope > 0 ? '+' : ''}{slope.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground">Velocity Trend</div>
        </div>
      </div>
    </div>
  );
};

export default VelocityTrendChart;
