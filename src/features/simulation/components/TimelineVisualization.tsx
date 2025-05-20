
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

interface TimelinePoint {
  sprintId: number;
  startDate: string;
  endDate: string;
  plannedPoints: number;
  estimatedCompletedPoints: number;
  cumulativeCompletedPoints: number;
  remainingPoints: number;
}

interface TimelineVisualizationProps {
  timelineData: TimelinePoint[];
  deadlineDate: string;
}

const TimelineVisualization: React.FC<TimelineVisualizationProps> = ({ 
  timelineData,
  deadlineDate
}) => {
  const totalBacklogPoints = timelineData.length > 0 
    ? timelineData[0].cumulativeCompletedPoints + timelineData[0].remainingPoints
    : 0;
  
  // Format data for chart
  const chartData = timelineData.map(point => ({
    name: `Sprint ${point.sprintId}`,
    date: new Date(point.endDate).toLocaleDateString(),
    completed: point.cumulativeCompletedPoints,
    remaining: point.remainingPoints,
    burndown: totalBacklogPoints - point.cumulativeCompletedPoints,
    velocity: point.estimatedCompletedPoints
  }));

  // Find deadline sprint (closest to deadline)
  const deadlineTime = new Date(deadlineDate).getTime();
  const deadlineSprint = timelineData.findIndex((sprint, i) => {
    const sprintEnd = new Date(sprint.endDate).getTime();
    const nextSprintEnd = i < timelineData.length - 1 
      ? new Date(timelineData[i + 1].endDate).getTime()
      : Infinity;
    
    return sprintEnd >= deadlineTime && deadlineTime < nextSprintEnd;
  });

  return (
    <div className="space-y-4">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                value,
                name === "burndown" ? "Remaining Points" : 
                name === "velocity" ? "Sprint Velocity" : 
                name
              ]}
              labelFormatter={(label) => `${label}`}
            />
            <Legend />
            {deadlineSprint >= 0 && (
              <ReferenceLine 
                x={chartData[deadlineSprint].name} 
                stroke="red"
                strokeDasharray="3 3"
                label={{ value: 'Deadline', position: 'top' }}
              />
            )}
            <Area 
              type="monotone" 
              dataKey="burndown" 
              name="Burndown"
              stroke="#8884d8" 
              fill="#8884d8" 
              fillOpacity={0.3}
            />
            <Area 
              type="monotone" 
              dataKey="velocity" 
              name="Velocity"
              stroke="#82ca9d" 
              fill="#82ca9d" 
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-2">Sprint</th>
              <th className="px-4 py-2">Date Range</th>
              <th className="px-4 py-2">Planned</th>
              <th className="px-4 py-2">Estimated Completion</th>
              <th className="px-4 py-2">Cumulative</th>
              <th className="px-4 py-2">Remaining</th>
              <th className="px-4 py-2">% Complete</th>
            </tr>
          </thead>
          <tbody>
            {timelineData.map((sprint) => {
              const isDeadlineSprint = new Date(sprint.startDate).getTime() <= new Date(deadlineDate).getTime() &&
                                      new Date(deadlineDate).getTime() <= new Date(sprint.endDate).getTime();
              
              const percentComplete = Math.round((sprint.cumulativeCompletedPoints / totalBacklogPoints) * 100);
              
              return (
                <tr 
                  key={sprint.sprintId} 
                  className={`border-t border-border hover:bg-muted/30 ${isDeadlineSprint ? 'bg-error/10' : ''}`}
                >
                  <td className="px-4 py-2">Sprint {sprint.sprintId}</td>
                  <td className="px-4 py-2">
                    {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                    {isDeadlineSprint && <span className="ml-2 text-error font-medium text-xs">(Deadline)</span>}
                  </td>
                  <td className="px-4 py-2">{sprint.plannedPoints}</td>
                  <td className="px-4 py-2">{sprint.estimatedCompletedPoints}</td>
                  <td className="px-4 py-2">{sprint.cumulativeCompletedPoints}</td>
                  <td className="px-4 py-2">{sprint.remainingPoints}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-muted rounded-full h-1.5">
                        <div 
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: `${percentComplete}%` }}
                        ></div>
                      </div>
                      <span>{percentComplete}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimelineVisualization;
