import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/design-system";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { RiskFactor } from "../../simulation/types";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  BarChart,
  Bar,
  ReferenceLine
} from "recharts";

interface RiskAnalysisProps {
  riskFactors: RiskFactor[];
}

// Sample data for dependency network - in a real app this would come from the API
const dependencyData = [
  { id: 'risk-001', source: 'Authentication Component', target: 'User Profile', type: 'implementation', severity: 'medium' },
  { id: 'risk-002', source: 'Database Schema', target: 'API Layer', type: 'technical', severity: 'high' },
  { id: 'risk-003', source: 'Payment Gateway', target: 'Order Processing', type: 'external', severity: 'high' },
  { id: 'risk-004', source: 'Asset Pipeline', target: 'Frontend Build', type: 'technical', severity: 'low' },
  { id: 'risk-005', source: 'API Layer', target: 'Mobile Client', type: 'implementation', severity: 'medium' }
];

// Sample data for impact analysis
const bottleneckImpactData = [
  { name: 'Database Schema Migration', impact: 9, delay: 3, cost: 12000 },
  { name: 'Auth System Integration', impact: 7, delay: 4, cost: 8000 },
  { name: 'Payment Gateway API', impact: 5, delay: 2, cost: 5000 },
  { name: 'CI/CD Pipeline Setup', impact: 3, delay: 1, cost: 3000 },
  { name: 'Load Testing Infrastructure', impact: 6, delay: 2, cost: 7000 },
];

// Sample data for sensitivity analysis
const sensitivityData = [
  { name: 'Team Size', elasticity: 0.8, impact: 8 },
  { name: 'Sprint Length', elasticity: 0.3, impact: 3 },
  { name: 'Technical Complexity', elasticity: 0.7, impact: 7 },
  { name: 'External Dependencies', elasticity: 0.9, impact: 9 },
  { name: 'Requirements Stability', elasticity: 0.6, impact: 6 },
];

const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ riskFactors }) => {
  const [activeTab, setActiveTab] = useState("matrix");
  
  // Transform risk factors for scatter plot
  const riskMatrixData = riskFactors.map(risk => ({
    name: risk.name,
    x: risk.probability, // x-axis: probability
    y: risk.impact, // y-axis: impact
    z: 10, // bubble size
    score: risk.probability * risk.impact
  }));
  
  const getRiskColor = (score: number) => {
    if (score >= 0.6) return "#ef4444"; // High risk - red
    if (score >= 0.3) return "#f59e0b"; // Medium risk - amber
    return "#10b981"; // Low risk - green
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="matrix">Risk Matrix</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
          <TabsTrigger value="bottlenecks">Bottleneck Impact</TabsTrigger>
          <TabsTrigger value="sensitivity">Sensitivity Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="matrix" className="pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Risk Categorization Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid />
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      name="probability" 
                      domain={[0, 1]} 
                      label={{ value: 'Probability', position: 'bottom' }}
                      tickFormatter={(value) => `${Math.round(value * 100)}%`}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      name="impact" 
                      domain={[0, 1]} 
                      label={{ value: 'Impact', angle: -90, position: 'left' }}
                      tickFormatter={(value) => `${Math.round(value * 100)}%`}
                    />
                    <ZAxis 
                      type="number" 
                      dataKey="z" 
                      range={[50, 400]} 
                      name="score" 
                      unit="points" 
                    />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      formatter={(value, name, props) => {
                        if (name === 'probability' || name === 'impact') {
                          return [`${Math.round(Number(value) * 100)}%`, name];
                        }
                        return [value, name];
                      }}
                    />
                    <ReferenceLine x={0.5} stroke="#666" strokeDasharray="3 3" />
                    <ReferenceLine y={0.5} stroke="#666" strokeDasharray="3 3" />
                    <Scatter name="Risks" data={riskMatrixData} shape="circle">
                      {riskMatrixData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getRiskColor(entry.score)} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full bg-error"></span>
                  <span>High Risk (P*I ≥ 0.6)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full bg-warning"></span>
                  <span>Medium Risk (0.3 ≤ P*I < 0.6)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full bg-success"></span>
                  <span>Low Risk (P*I < 0.3)</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
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
                    {riskFactors.map((risk, index) => (
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
          </div>
        </TabsContent>
        
        <TabsContent value="dependencies" className="pt-4">
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
        
        <TabsContent value="bottlenecks" className="pt-4">
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
                        data={bottleneckImpactData}
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
                          dataKey="delay" 
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
                        data={bottleneckImpactData}
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
                          dataKey="cost" 
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
        
        <TabsContent value="sensitivity" className="pt-4">
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
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => value.toFixed(1)} domain={[0, 1]} />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="elasticity" 
                      name="Schedule Elasticity" 
                      fill="#3b82f6"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6">
                <h3 className="font-medium mb-3">Sensitivity Analysis Insights</h3>
                <div className="text-sm space-y-2">
                  <p>
                    <strong>Schedule Elasticity:</strong> Measures how sensitive the project timeline is to changes in each variable.
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
