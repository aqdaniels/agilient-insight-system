import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  ScatterChart, Scatter, ZAxis, ReferenceLine
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/design-system';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

// Sample risk data
const riskData = [
  { name: 'Scope Creep', probability: 0.7, impact: 0.8, risk: 0.56, category: 'Project Management' },
  { name: 'Resource Unavailability', probability: 0.5, impact: 0.9, risk: 0.45, category: 'Resource' },
  { name: 'Technical Debt', probability: 0.8, impact: 0.6, risk: 0.48, category: 'Technical' },
  { name: 'Integration Issues', probability: 0.6, impact: 0.7, risk: 0.42, category: 'Technical' },
  { name: 'Requirements Ambiguity', probability: 0.7, impact: 0.7, risk: 0.49, category: 'Functional' },
  { name: 'Performance Issues', probability: 0.4, impact: 0.8, risk: 0.32, category: 'Technical' },
  { name: 'Security Vulnerabilities', probability: 0.3, impact: 1.0, risk: 0.30, category: 'Security' },
  { name: 'Budget Overrun', probability: 0.6, impact: 0.9, risk: 0.54, category: 'Financial' },
  { name: 'Schedule Delay', probability: 0.8, impact: 0.8, risk: 0.64, category: 'Project Management' },
  { name: 'Vendor Dependency', probability: 0.5, impact: 0.6, risk: 0.30, category: 'External' },
];

// Dependencies data
const dependencyData = [
  { id: 1, source: 'Integration API', target: 'Backend Services', weight: 3, type: 'technical' },
  { id: 2, source: 'UX Design', target: 'Frontend Development', weight: 5, type: 'workflow' },
  { id: 3, source: 'Data Model', target: 'API Design', weight: 4, type: 'technical' },
  { id: 4, source: 'Authentication Service', target: 'User Management', weight: 3, type: 'technical' },
  { id: 5, source: 'Backend Services', target: 'Frontend Development', weight: 4, type: 'workflow' },
  { id: 6, source: 'DevOps Pipeline', target: 'Testing', weight: 2, type: 'workflow' },
  { id: 7, source: 'External API', target: 'Integration API', weight: 5, type: 'external' },
  { id: 8, source: 'Database', target: 'Backend Services', weight: 5, type: 'technical' },
];

// Bottleneck data
const bottleneckData = [
  { name: 'API Integration', value: 85, limit: 60 },
  { name: 'Database Queries', value: 45, limit: 70 },
  { name: 'UI Rendering', value: 30, limit: 40 },
  { name: 'Authentication', value: 65, limit: 50 },
  { name: 'File Processing', value: 90, limit: 75 },
];

// Sensitivity analysis data
const sensitivityData = [
  { parameter: 'Team Size', change: -20, impact: -15 },
  { parameter: 'Team Size', change: -10, impact: -7 },
  { parameter: 'Team Size', change: 10, impact: 5 },
  { parameter: 'Team Size', change: 20, impact: 8 },
  { parameter: 'Sprint Length', change: -20, impact: 12 },
  { parameter: 'Sprint Length', change: -10, impact: 5 },
  { parameter: 'Sprint Length', change: 10, impact: -4 },
  { parameter: 'Sprint Length', change: 20, impact: -10 },
  { parameter: 'Technical Debt', change: -20, impact: 18 },
  { parameter: 'Technical Debt', change: -10, impact: 8 },
  { parameter: 'Technical Debt', change: 10, impact: -9 },
  { parameter: 'Technical Debt', change: 20, impact: -20 },
];

const RiskAnalysis: React.FC = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="risk-matrix" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="risk-matrix">Risk Matrix</TabsTrigger>
          <TabsTrigger value="risk-register">Risk Register</TabsTrigger>
          <TabsTrigger value="dependency-network">Dependencies</TabsTrigger>
          <TabsTrigger value="bottlenecks">Bottlenecks</TabsTrigger>
          <TabsTrigger value="sensitivity">Sensitivity Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="risk-matrix" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid />
                    <XAxis 
                      type="number" 
                      dataKey="impact" 
                      name="Impact" 
                      domain={[0, 1]} 
                      label={{ value: 'Impact', position: 'bottom' }} 
                    />
                    <YAxis 
                      type="number" 
                      dataKey="probability" 
                      name="Probability" 
                      domain={[0, 1]} 
                      label={{ value: 'Probability', angle: -90, position: 'left' }} 
                    />
                    <ZAxis type="number" dataKey="risk" range={[50, 400]} />
                    <Tooltip 
                      formatter={(value: any) => value.toFixed(2)}
                      cursor={{ strokeDasharray: '3 3' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background p-3 border rounded shadow-sm">
                              <p className="font-medium">{data.name}</p>
                              <p className="text-sm">Category: {data.category}</p>
                              <p className="text-sm">Probability: {data.probability.toFixed(2)}</p>
                              <p className="text-sm">Impact: {data.impact.toFixed(2)}</p>
                              <p className="text-sm font-medium">Risk Score: {data.risk.toFixed(2)}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <ReferenceLine y={0.5} stroke="#777" strokeDasharray="3 3" />
                    <ReferenceLine x={0.5} stroke="#777" strokeDasharray="3 3" />
                    <Scatter 
                      name="Risks" 
                      data={riskData} 
                      fill="#8884d8"
                      shape={(props) => {
                        const { cx, cy, payload } = props;
                        return (
                          <circle 
                            cx={cx} 
                            cy={cy} 
                            r={10} 
                            fill={
                              payload.risk >= 0.5 ? "#ef4444" : 
                              payload.risk >= 0.3 ? "#f97316" : 
                              "#22c55e"
                            }
                            opacity={0.8}
                          />
                        );
                      }}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span>High Risk (≥ 0.5)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                  <span>Medium Risk (0.3-0.5)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span>Low Risk (< 0.3)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Risk Register Tab */}
        <TabsContent value="risk-register" className="mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Risk Register</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="py-2 px-3 text-left">Risk Factor</th>
                    <th className="py-2 px-3 text-left">Probability</th>
                    <th className="py-2 px-3 text-left">Impact</th>
                    <th className="py-2 px-3 text-left">Risk Score</th>
                    <th className="py-2 px-3 text-left">Mitigation Strategy</th>
                  </tr>
                </thead>
                <tbody>
                  {riskData.map((risk, index) => (
                    <tr key={index} className="border-b border-muted">
                      <td className="py-2 px-3">{risk.name}</td>
                      <td className="py-2 px-3">{Math.round(risk.probability * 100)}%</td>
                      <td className="py-2 px-3">{Math.round(risk.impact * 100)}%</td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: getRiskColor(risk.probability * risk.impact) }}
                          ></div>
                          {Math.round(risk.probability * risk.impact * 100)}%
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <Button variant="ghost" size="sm">View Strategy</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Dependencies Tab */}
        <TabsContent value="dependency-network" className="mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Dependency Network</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 border border-muted rounded-md p-4">
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground text-center">
                    Interactive dependency network visualization would appear here.<br />
                    This would typically be implemented with a graph visualization library like D3.js or Cytoscape.js.
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-medium mb-3">Critical Dependencies</h3>
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="py-2 px-3 text-left">Source Component</th>
                      <th className="py-2 px-3 text-left">Dependent Component</th>
                      <th className="py-2 px-3 text-left">Dependency Type</th>
                      <th className="py-2 px-3 text-left">Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dependencyData.map((dep) => (
                      <tr key={dep.id} className="border-b border-muted">
                        <td className="py-2 px-3">{dep.source}</td>
                        <td className="py-2 px-3">{dep.target}</td>
                        <td className="py-2 px-3">{dep.type}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            dep.severity === 'high' ? 'bg-error/20 text-error' :
                            dep.severity === 'medium' ? 'bg-warning/20 text-warning' :
                            'bg-success/20 text-success'
                          }`}>
                            {dep.severity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Bottlenecks Tab */}
        <TabsContent value="bottlenecks" className="mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Bottleneck Impact Quantification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={bottleneckData}
                        layout="vertical"
                        margin={{
                          top: 5,
                          right: 30,
                          left: 100,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip 
                          formatter={(value) => [`${value} days`, 'Schedule Impact']} 
                        />
                        <Legend />
                        <Bar 
                          dataKey="value" 
                          name="Schedule Impact (Days)" 
                          fill="#ef4444"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={bottleneckData}
                        layout="vertical"
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={(value) => `$${value}`} />
                        <YAxis dataKey="name" type="category" hide />
                        <Tooltip 
                          formatter={(value) => [`$${value.toLocaleString()}`, 'Cost Impact']} 
                        />
                        <Legend />
                        <Bar 
                          dataKey="limit" 
                          name="Cost Impact ($)" 
                          fill="#3b82f6"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-medium mb-3">Mitigation Recommendations</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-error p-4 bg-error/5 rounded-r-md">
                    <h4 className="font-medium mb-1">Database Schema Migration</h4>
                    <p className="text-sm mb-2">Highest risk with 9-day potential impact and $12,000 cost exposure.</p>
                    <div className="text-sm">
                      <strong>Recommendation:</strong> Schedule early spike to validate approach and consider parallel implementation track.
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-warning p-4 bg-warning/5 rounded-r-md">
                    <h4 className="font-medium mb-1">Auth System Integration</h4>
                    <p className="text-sm mb-2">Second highest risk with 4-day potential delay and $8,000 cost impact.</p>
                    <div className="text-sm">
                      <strong>Recommendation:</strong> Engage with vendor early and establish fallback authentication mechanism.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Sensitivity Analysis Tab */}
        <TabsContent value="sensitivity" className="mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Critical Path Sensitivity Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sensitivityData}
                    layout="horizontal"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="parameter" />
                    <YAxis tickFormatter={(value) => value.toFixed(1)} domain={[0, 1]} />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="impact" 
                      name="Schedule Impact" 
                      fill="#3b82f6"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6">
                <h3 className="font-medium mb-3">Sensitivity Analysis Insights</h3>
                <div className="text-sm space-y-2">
                  <p>
                    <strong>Schedule Impact:</strong> Measures how sensitive the project timeline is to changes in each variable.
                    Higher values indicate that small changes in this factor have larger effects on the schedule.
                  </p>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>External Dependencies (0.9):</strong> Has the highest impact on schedule - a 10% change in dependency timing could cause a 9% shift in the delivery date.</li>
                    <li><strong>Team Size (0.8):</strong> Second most influential factor - adding or removing team members has significant impact.</li>
                    <li><strong>Technical Complexity (0.7):</strong> Underestimating complexity could significantly extend the timeline.</li>
                    <li><strong>Requirements Stability (0.6):</strong> Changes in requirements have moderate impact on delivery.</li>
                    <li><strong>Sprint Length (0.3):</strong> Has minimal impact on overall timeline.</li>
                  </ul>
                </div>
                
                <div className="mt-4 border-l-4 border-info p-4 bg-info/5 rounded-r-md">
                  <h4 className="font-medium mb-1">Risk Mitigation Strategy Recommendation</h4>
                  <p className="text-sm">
                    Focus efforts on managing external dependencies and maintaining team stability as these factors have the 
                    highest potential impact on delivery. Consider implementing a buffer for integration with external systems 
                    and establish a contingency plan for team changes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RiskAnalysis;
