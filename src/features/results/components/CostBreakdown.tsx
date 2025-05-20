
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
  Cell,
  ReferenceLine
} from "recharts";

interface CostItem {
  category: string;
  planned: number;
  actual: number;
}

interface CostBreakdownProps {
  costData: CostItem[];
}

const CostBreakdown: React.FC<CostBreakdownProps> = ({ costData }) => {
  // Calculate total planned and actual costs
  const totalPlanned = costData.reduce((sum, item) => sum + item.planned, 0);
  const totalActual = costData.reduce((sum, item) => sum + item.actual, 0);
  const variance = totalActual - totalPlanned;
  const variancePercent = Math.round((variance / totalPlanned) * 100);
  
  // Calculate variances for each category
  const dataWithVariance = costData.map(item => ({
    ...item,
    variance: item.actual - item.planned,
    variancePercent: Math.round(((item.actual - item.planned) / item.planned) * 100)
  }));
  
  // Sort categories by variance (highest first)
  const sortedByVariance = [...dataWithVariance].sort((a, b) => 
    Math.abs(b.variance) - Math.abs(a.variance)
  );

  // Calculate category distribution
  const categoryDistribution = costData.map(item => ({
    name: item.category,
    value: item.actual,
    percentage: Math.round((item.actual / totalActual) * 100)
  }));

  // Currency formatter
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-muted/30 p-3 rounded-md">
          <div className="text-xs text-muted-foreground">Planned Budget</div>
          <div className="text-xl font-bold">{formatCurrency(totalPlanned)}</div>
        </div>
        <div className="bg-muted/30 p-3 rounded-md">
          <div className="text-xs text-muted-foreground">Actual Cost</div>
          <div className="text-xl font-bold">{formatCurrency(totalActual)}</div>
        </div>
        <div className={`p-3 rounded-md ${
          variance <= 0 ? 'bg-success/15 text-success' : 'bg-error/15 text-error'
        }`}>
          <div className="text-xs">Variance</div>
          <div className="text-xl font-bold">
            {variance <= 0 ? '-' : '+'}{formatCurrency(Math.abs(variance))} ({variancePercent}%)
          </div>
        </div>
      </div>

      <div className="h-80">
        <h4 className="text-sm font-medium mb-4">Cost Comparison by Category</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={costData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="category" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tickFormatter={(value) => `$${(value / 1000)}k`}
            />
            <Tooltip 
              formatter={(value) => formatCurrency(value as number)}
            />
            <Legend />
            <Bar dataKey="planned" name="Planned" fill="#8884d8" />
            <Bar dataKey="actual" name="Actual" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-4">Budget Variance by Category</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Planned</th>
                <th className="px-4 py-2">Actual</th>
                <th className="px-4 py-2">Variance</th>
                <th className="px-4 py-2">Variance %</th>
              </tr>
            </thead>
            <tbody>
              {sortedByVariance.map((item) => (
                <tr 
                  key={item.category} 
                  className={`border-t border-border ${
                    item.variance === 0 ? '' : 
                    item.variance < 0 ? 'bg-success/5' : 'bg-error/5'
                  }`}
                >
                  <td className="px-4 py-2 font-medium">{item.category}</td>
                  <td className="px-4 py-2">{formatCurrency(item.planned)}</td>
                  <td className="px-4 py-2">{formatCurrency(item.actual)}</td>
                  <td className="px-4 py-2">
                    <span className={item.variance < 0 ? 'text-success' : (item.variance > 0 ? 'text-error' : '')}>
                      {item.variance === 0 ? '-' : (item.variance < 0 ? '-' : '+')}
                      {formatCurrency(Math.abs(item.variance))}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={item.variance < 0 ? 'text-success' : (item.variance > 0 ? 'text-error' : '')}>
                      {item.variance === 0 ? '-' : (item.variance < 0 ? '-' : '+')}
                      {Math.abs(item.variancePercent)}%
                    </span>
                  </td>
                </tr>
              ))}
              <tr className="border-t border-border font-medium bg-muted/30">
                <td className="px-4 py-2">Total</td>
                <td className="px-4 py-2">{formatCurrency(totalPlanned)}</td>
                <td className="px-4 py-2">{formatCurrency(totalActual)}</td>
                <td className="px-4 py-2">
                  <span className={variance < 0 ? 'text-success' : (variance > 0 ? 'text-error' : '')}>
                    {variance === 0 ? '-' : (variance < 0 ? '-' : '+')}
                    {formatCurrency(Math.abs(variance))}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span className={variance < 0 ? 'text-success' : (variance > 0 ? 'text-error' : '')}>
                    {variance === 0 ? '-' : (variance < 0 ? '-' : '+')}
                    {Math.abs(variancePercent)}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CostBreakdown;
