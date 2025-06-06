
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/design-system";
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";

interface RiskFactor {
  name: string;
  impact: number;
  probability: number;
}

interface RiskAnalysisProps {
  riskFactors: RiskFactor[];
}

const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ riskFactors }) => {
  // Calculate risk score
  const calculateRiskScore = (impact: number, probability: number) => impact * probability;
  
  // Sort risks by score (highest first)
  const sortedRisks = [...riskFactors].sort(
    (a, b) => calculateRiskScore(b.impact, b.probability) - calculateRiskScore(a.impact, a.probability)
  );
  
  // Prepare data for chart
  const chartData = sortedRisks.map(risk => ({
    name: risk.name.length > 15 ? risk.name.substring(0, 15) + '...' : risk.name,
    score: calculateRiskScore(risk.impact, risk.probability).toFixed(2),
    impact: risk.impact.toFixed(2),
    probability: risk.probability.toFixed(2),
  }));

  // Define risk levels
  const getRiskLevel = (score: number) => {
    if (score >= 0.6) return "high";
    if (score >= 0.3) return "medium";
    return "low";
  };

  // Get color based on risk level
  const getRiskColor = (score: number) => {
    const level = getRiskLevel(score);
    if (level === "high") return "#ef4444";
    if (level === "medium") return "#f59e0b";
    return "#10b981";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle size={18} className="mr-2 text-warning" />
              Risk Summary
            </CardTitle>
            <CardDescription>Overview of project risks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center transition-all duration-200 hover:bg-muted/20 p-2 rounded-md">
                <span className="text-sm font-medium">Total Risks</span>
                <Badge variant="outline" className="animate-in fade-in-50 duration-300">{riskFactors.length}</Badge>
              </div>
              
              <div className="flex justify-between items-center transition-all duration-200 hover:bg-muted/20 p-2 rounded-md">
                <span className="text-sm font-medium">High Risk Items</span>
                <Badge variant="error" className="animate-in fade-in-50 duration-300">
                  {riskFactors.filter(r => getRiskLevel(calculateRiskScore(r.impact, r.probability)) === "high").length}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center transition-all duration-200 hover:bg-muted/20 p-2 rounded-md">
                <span className="text-sm font-medium">Medium Risk Items</span>
                <Badge variant="warning" className="animate-in fade-in-50 duration-300">
                  {riskFactors.filter(r => getRiskLevel(calculateRiskScore(r.impact, r.probability)) === "medium").length}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center transition-all duration-200 hover:bg-muted/20 p-2 rounded-md">
                <span className="text-sm font-medium">Low Risk Items</span>
                <Badge variant="success" className="animate-in fade-in-50 duration-300">
                  {riskFactors.filter(r => getRiskLevel(calculateRiskScore(r.impact, r.probability)) === "low").length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2 transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Risk Distribution</CardTitle>
            <CardDescription>Risk score by factor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  className="transition-all duration-300 ease-out"
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis 
                    domain={[0, 1]} 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value.toFixed(1)}
                  />
                  <Tooltip 
                    formatter={(value: any, name: any) => {
                      if (name === "score") return [value, "Risk Score"];
                      return [value, name.charAt(0).toUpperCase() + name.slice(1)];
                    }}
                    labelFormatter={(label) => {
                      const risk = riskFactors.find(r => 
                        r.name.startsWith(label.split("...")[0])
                      );
                      return risk ? risk.name : label;
                    }}
                    animationDuration={200}
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Bar dataKey="score" fill="#8884d8" className="transition-opacity duration-200 hover:opacity-90">
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getRiskColor(Number(entry.score))}
                        className="transition-all duration-300 hover:filter hover:brightness-110"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Risk Factor Details</CardTitle>
          <CardDescription>Comprehensive breakdown of identified risks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>Risk Factor</TableHead>
                  <TableHead>Impact</TableHead>
                  <TableHead>Probability</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRisks.map((risk, index) => {
                  const score = calculateRiskScore(risk.impact, risk.probability);
                  const level = getRiskLevel(score);
                  
                  return (
                    <TableRow key={index} className="transition-all duration-200 hover:bg-muted/10 group">
                      <TableCell className="font-medium group-hover:translate-x-1 transition-transform duration-200">{risk.name}</TableCell>
                      <TableCell className="transition-all duration-200 group-hover:font-medium">{(risk.impact * 10).toFixed(1)} / 10</TableCell>
                      <TableCell className="transition-all duration-200 group-hover:font-medium">{Math.round(risk.probability * 100)}%</TableCell>
                      <TableCell className="transition-all duration-200 group-hover:font-medium">{score.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={level === "high" ? "error" : level === "medium" ? "warning" : "success"}
                          className="transition-all duration-300 group-hover:scale-105"
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {index % 2 === 0 ? 
                          <TrendingUp size={18} className="text-success transition-all duration-200 group-hover:scale-110" /> : 
                          <TrendingDown size={18} className="text-destructive transition-all duration-200 group-hover:scale-110" />
                        }
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAnalysis;
