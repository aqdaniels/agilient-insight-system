
import React from "react";
import { VelocityData } from "../containers/TeamConfigurator";
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
  Area,
  AreaChart
} from "recharts";

interface VelocityTrendChartProps {
  velocityHistory: VelocityData[];
}

const VelocityTrendChart: React.FC<VelocityTrendChartProps> = ({ velocityHistory }) => {
  // Calculate average velocity
  const averageVelocity = velocityHistory.reduce(
    (sum, sprint) => sum + sprint.completedPoints, 0
  ) / velocityHistory.length;

  // Calculate standard deviation
  const squaredDiffs = velocityHistory.map(sprint => 
    Math.pow(sprint.completedPoints - averageVelocity, 2)
  );
  const variance = squaredDiffs.reduce((sum, squaredDiff) => sum + squaredDiff, 0) / velocityHistory.length;
  const stdDev = Math.sqrt(variance);

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
    const sprintNumber = n + i;
    
    predictedData.push({
      sprintId: `projected-${i}`,
      sprintName: `Sprint ${sprintNumber} (Projected)`,
      plannedPoints: Math.round(predictedVelocity),
      completedPoints: Math.round(predictedVelocity),
      completionRate: 100,
      date: "Projected"
    });
  }

  // Add standard deviation range for completed points
  const dataWithDeviation = velocityHistory.map(item => ({
    ...item,
    upperBound: item.completedPoints + stdDev,
    lowerBound: Math.max(0, item.completedPoints - stdDev)
  }));

  // Create different data series for actual and projected
  const actualData = predictedData.filter(item => item.date !== "Projected");
  const projectedData = predictedData.filter(item => item.date === "Projected");

  return (
    <div className="space-y-4 p-4">
      <h3 className="font-semibold text-lg">Velocity Analysis</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={predictedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="sprintName" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [
                value,
                name === "plannedPoints" ? "Planned Points" : name === "completedPoints" ? "Completed Points" : name
              ]}
              labelFormatter={(label) => `${label}`}
            />
            <Legend />
            <ReferenceLine y={averageVelocity} stroke="#ff7300" strokeDasharray="3 3" label="Average" />
            
            {/* Actual data solid lines */}
            <Line
              type="monotone"
              dataKey="plannedPoints"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              strokeWidth={2}
              data={actualData}
              name="Planned Points (Actual)"
            />
            <Line
              type="monotone"
              dataKey="completedPoints"
              stroke="#82ca9d"
              activeDot={{ r: 8 }}
              strokeWidth={2}
              data={actualData}
              name="Completed Points (Actual)"
              connectNulls
            />
            
            {/* Projected data dashed lines */}
            <Line
              type="monotone"
              dataKey="plannedPoints"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              strokeWidth={2}
              strokeDasharray="5 5"
              data={projectedData}
              name="Planned Points (Projected)"
            />
            <Line
              type="monotone"
              dataKey="completedPoints"
              stroke="#82ca9d"
              activeDot={{ r: 8 }}
              strokeWidth={2}
              strokeDasharray="5 5"
              data={projectedData}
              name="Completed Points (Projected)"
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="h-64 mt-8">
        <h4 className="text-sm font-medium mb-2">Velocity Variability</h4>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={dataWithDeviation}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="sprintName" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => {
                if (name === "upperBound") return [`${value} (Upper Bound)`, 'Standard Deviation'];
                if (name === "lowerBound") return [`${value} (Lower Bound)`, 'Standard Deviation'];
                return [value, name === "completedPoints" ? "Completed Points" : name];
              }}
              labelFormatter={(label) => `${label}`}
            />
            <Area 
              type="monotone" 
              dataKey="upperBound" 
              stroke="none" 
              fill="#82ca9d" 
              fillOpacity={0.2} 
            />
            <Area 
              type="monotone" 
              dataKey="lowerBound" 
              stroke="none" 
              fill="#82ca9d" 
              fillOpacity={0} 
            />
            <Line
              type="monotone"
              dataKey="completedPoints"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <ReferenceLine y={averageVelocity} stroke="#ff7300" strokeDasharray="3 3" />
          </AreaChart>
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
