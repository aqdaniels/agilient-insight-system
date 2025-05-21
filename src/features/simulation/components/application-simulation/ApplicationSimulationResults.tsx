
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationSimulationConfig, ApplicationSimulationResult } from "../../types/application-simulation";
import { GenAIAccelerator } from "@/features/genai/types";
import { Badge } from "@/components/design-system";
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
} from 'recharts';
import { Calendar, Clock, TrendingDown } from "lucide-react";

interface ApplicationSimulationResultsProps {
  result: ApplicationSimulationResult;
  config: ApplicationSimulationConfig;
  accelerator: GenAIAccelerator | null;
}

const ApplicationSimulationResults: React.FC<ApplicationSimulationResultsProps> = ({
  result,
  config,
  accelerator
}) => {
  // Prepare chart data for application breakdown
  const applicationChartData = result.applicationBreakdown.map(app => ({
    name: app.name,
    sprints: app.sprints
  }));
  
  // Calculate team velocity in story points
  const teamVelocity = Math.ceil(result.totalStoryPoints / result.sprintsRequired);
  
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock size={18} className="mr-2 text-primary" />
              Timeline Projection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/20 p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Total Sprints</div>
                  <div className="text-2xl font-bold">{result.sprintsRequired}</div>
                </div>
                <div className="bg-muted/20 p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Duration</div>
                  <div className="text-2xl font-bold">{result.totalDuration} weeks</div>
                </div>
              </div>
              
              {result.withAccelerator && (
                <div className="bg-primary/10 border border-primary/30 p-4 rounded-md">
                  <div className="flex items-center">
                    <TrendingDown size={20} className="text-success mr-2" />
                    <span className="font-medium">With {accelerator?.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <div className="text-sm text-muted-foreground">New Duration</div>
                      <div className="text-xl font-semibold">{result.withAccelerator.totalDuration} weeks</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Time Saved</div>
                      <div className="text-xl font-semibold text-success">{result.withAccelerator.timeSaved} weeks</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar size={18} className="mr-2 text-primary" />
              Work Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/20 p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Story Points</div>
                  <div className="text-2xl font-bold">{result.totalStoryPoints}</div>
                </div>
                <div className="bg-muted/20 p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Total Hours</div>
                  <div className="text-2xl font-bold">{result.totalHours}</div>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-1">Team Configuration</div>
                <div className="flex justify-between items-center p-3 bg-muted/20 rounded-md">
                  <span>Team of {config.teamSize}</span>
                  <span className="font-medium">{config.hoursPerSprint * config.teamSize} hours/sprint</span>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-1">Velocity</div>
                <div className="flex justify-between items-center p-3 bg-muted/20 rounded-md">
                  <span>Avg. Velocity</span>
                  <span className="font-medium">{teamVelocity} points/sprint</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Application Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.applicationBreakdown.map((app, index) => (
                <div 
                  key={app.applicationId} 
                  className="flex justify-between items-center p-2 hover:bg-muted/20 rounded-md transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: colors[index % colors.length] }} 
                    />
                    <span className="text-sm font-medium truncate max-w-[150px]">{app.name}</span>
                  </div>
                  <Badge variant="outline">{app.sprints} sprints</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="hover:shadow-md transition-all duration-200">
        <CardHeader>
          <CardTitle>Sprint Distribution by Application</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={applicationChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={60} 
                  tick={{ fontSize: 12 }} 
                />
                <YAxis 
                  label={{ value: 'Number of Sprints', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [`${value} sprints`, 'Duration']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  }}
                />
                <Legend />
                <Bar dataKey="sprints" name="Sprint Duration">
                  {applicationChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {accelerator && result.withAccelerator && (
        <Card className="border border-primary/20 bg-primary/5 hover:shadow-md transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-lg">Accelerator Impact: {accelerator.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-card p-4 rounded-md shadow-sm">
                <div className="text-sm text-muted-foreground">Without Accelerator</div>
                <div className="text-2xl font-bold mt-1">{result.sprintsRequired} sprints</div>
                <div className="text-sm mt-1">{result.totalDuration} weeks</div>
              </div>
              
              <div className="bg-card p-4 rounded-md shadow-sm">
                <div className="text-sm text-muted-foreground">With Accelerator</div>
                <div className="text-2xl font-bold mt-1 text-primary">
                  {result.withAccelerator.sprintsRequired} sprints
                </div>
                <div className="text-sm mt-1">{result.withAccelerator.totalDuration} weeks</div>
              </div>
              
              <div className="bg-success/10 p-4 rounded-md shadow-sm">
                <div className="text-sm text-muted-foreground">Time Saved</div>
                <div className="text-2xl font-bold mt-1 text-success">
                  {result.withAccelerator.timeSaved} weeks
                </div>
                <div className="text-sm mt-1">
                  {Math.round((result.withAccelerator.timeSaved / result.totalDuration) * 100)}% faster
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-card p-4 rounded-md">
              <h4 className="font-medium mb-2">Accelerator Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Description</p>
                  <p>{accelerator.description}</p>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-muted-foreground">Implementation Cost</p>
                    <p className="font-medium">{accelerator.implementationCost}/5</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Training Overhead</p>
                    <p className="font-medium">{accelerator.trainingOverhead}/5</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApplicationSimulationResults;
