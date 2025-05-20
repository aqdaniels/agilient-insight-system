
import React from "react";
import { ScenarioSummary } from "../containers/ComparisonWorkspace";
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

interface ComparisonMatrixProps {
  scenarios: ScenarioSummary[];
}

const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({ scenarios }) => {
  // Prepare data for charts
  const durationData = scenarios.map(s => ({
    name: s.name,
    value: s.metrics.duration,
    scenario: s.id
  }));
  
  const costData = scenarios.map(s => ({
    name: s.name,
    value: s.metrics.cost,
    scenario: s.id
  }));
  
  const confidenceData = scenarios.map(s => ({
    name: s.name,
    value: s.metrics.confidence,
    scenario: s.id
  }));
  
  // Find best metrics
  const bestDuration = Math.min(...scenarios.map(s => s.metrics.duration));
  const bestCost = Math.min(...scenarios.map(s => s.metrics.cost));
  const bestConfidence = Math.max(...scenarios.map(s => s.metrics.confidence));

  // Custom colors for each scenario
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

  // Get color for a specific scenario
  const getScenarioColor = (index: number) => colors[index % colors.length];

  // Format currency
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-2">Metric</th>
              {scenarios.map((scenario, i) => (
                <th 
                  key={scenario.id} 
                  className="px-4 py-2"
                  style={{ color: getScenarioColor(i) }}
                >
                  {scenario.name}
                </th>
              ))}
              <th className="px-4 py-2">Variance</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border">
              <td className="px-4 py-2 font-medium">Duration</td>
              {scenarios.map((scenario, i) => (
                <td 
                  key={scenario.id} 
                  className={`px-4 py-2 ${scenario.metrics.duration === bestDuration ? 'font-bold text-success' : ''}`}
                >
                  {scenario.metrics.duration} days
                </td>
              ))}
              <td className="px-4 py-2">
                {Math.max(...scenarios.map(s => s.metrics.duration)) - 
                 Math.min(...scenarios.map(s => s.metrics.duration))} days
              </td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-4 py-2 font-medium">Cost</td>
              {scenarios.map((scenario, i) => (
                <td 
                  key={scenario.id} 
                  className={`px-4 py-2 ${scenario.metrics.cost === bestCost ? 'font-bold text-success' : ''}`}
                >
                  {formatCurrency(scenario.metrics.cost)}
                </td>
              ))}
              <td className="px-4 py-2">
                {formatCurrency(Math.max(...scenarios.map(s => s.metrics.cost)) - 
                Math.min(...scenarios.map(s => s.metrics.cost)))}
              </td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-4 py-2 font-medium">Confidence</td>
              {scenarios.map((scenario, i) => (
                <td 
                  key={scenario.id} 
                  className={`px-4 py-2 ${scenario.metrics.confidence === bestConfidence ? 'font-bold text-success' : ''}`}
                >
                  {scenario.metrics.confidence}%
                </td>
              ))}
              <td className="px-4 py-2">
                {Math.max(...scenarios.map(s => s.metrics.confidence)) - 
                Math.min(...scenarios.map(s => s.metrics.confidence))}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="h-64">
          <h4 className="text-sm font-medium mb-2">Duration Comparison</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={durationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value} days`, 'Duration']} />
              <Bar dataKey="value">
                {durationData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getScenarioColor(index)} 
                    stroke={entry.value === bestDuration ? '#28a745' : getScenarioColor(index)} 
                    strokeWidth={entry.value === bestDuration ? 2 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="h-64">
          <h4 className="text-sm font-medium mb-2">Cost Comparison</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000)}k`} 
                label={{ value: 'Cost ($)', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip formatter={(value) => [formatCurrency(value as number), 'Cost']} />
              <Bar dataKey="value">
                {costData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getScenarioColor(index)}
                    stroke={entry.value === bestCost ? '#28a745' : getScenarioColor(index)} 
                    strokeWidth={entry.value === bestCost ? 2 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="h-64">
          <h4 className="text-sm font-medium mb-2">Confidence Comparison</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={confidenceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                label={{ value: 'Confidence (%)', angle: -90, position: 'insideLeft' }} 
                domain={[0, 100]}
              />
              <Tooltip formatter={(value) => [`${value}%`, 'Confidence']} />
              <Bar dataKey="value">
                {confidenceData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getScenarioColor(index)}
                    stroke={entry.value === bestConfidence ? '#28a745' : getScenarioColor(index)} 
                    strokeWidth={entry.value === bestConfidence ? 2 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-4 bg-muted/30 rounded-lg">
        <h4 className="text-sm font-medium mb-2">Analysis Summary</h4>
        <ul className="space-y-2">
          <li className="text-sm">
            <span className="font-medium">Duration:</span> Scenario "{scenarios.find(s => s.metrics.duration === bestDuration)?.name}" 
            offers the shortest timeline at {bestDuration} days.
          </li>
          <li className="text-sm">
            <span className="font-medium">Cost:</span> Scenario "{scenarios.find(s => s.metrics.cost === bestCost)?.name}" 
            is most economical at {formatCurrency(bestCost)}.
          </li>
          <li className="text-sm">
            <span className="font-medium">Confidence:</span> Scenario "{scenarios.find(s => s.metrics.confidence === bestConfidence)?.name}" 
            has the highest confidence level at {bestConfidence}%.
          </li>
          {scenarios.length >= 3 && (
            <li className="text-sm">
              <span className="font-medium">Trade-offs:</span> Consider balancing the {Math.max(...scenarios.map(s => s.metrics.duration)) - bestDuration} day time savings 
              against the additional {formatCurrency(Math.max(...scenarios.map(s => s.metrics.cost)) - bestCost)} cost.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ComparisonMatrix;
