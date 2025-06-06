
import React from "react";
import { TeamMember } from "../containers/TeamConfigurator";
import { Card } from "@/components/design-system";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

interface TeamCompositionChartProps {
  members: TeamMember[];
}

const TeamCompositionChart: React.FC<TeamCompositionChartProps> = ({ members }) => {
  // Calculate role distribution
  const roleDistribution = members.reduce((acc, member) => {
    const role = member.role;
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const roleData = Object.keys(roleDistribution).map(role => ({
    name: role,
    value: roleDistribution[role]
  }));

  // Calculate skill distribution (aggregated across all team members)
  const skillsMap: Record<string, number> = {};
  members.forEach(member => {
    member.skills.forEach(skill => {
      skillsMap[skill.name] = (skillsMap[skill.name] || 0) + skill.level;
    });
  });

  const skillData = Object.keys(skillsMap).map(skill => ({
    name: skill,
    value: skillsMap[skill] / members.length // Average skill level across team
  }));

  // Custom colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-4">
          <h4 className="text-sm font-medium text-center mb-4">Role Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => {
                    if (typeof percent === 'number') {
                      return `${name}: ${(percent * 100).toFixed(0)}%`;
                    }
                    return `${name}`;
                  }}
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} member(s)`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="text-sm font-medium text-center mb-4">Team Skills</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={skillData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#82ca9d"
                  dataKey="value"
                  label={({ name }) => name}
                >
                  {skillData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => {
                  const numValue = typeof value === 'number' ? value.toFixed(1) : value;
                  return [`Level: ${numValue}/5`, 'Avg. Proficiency'];
                }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Team Summary</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-muted/30 p-3 rounded-md text-center">
            <div className="text-2xl font-bold">{members.length}</div>
            <div className="text-xs text-muted-foreground">Team Size</div>
          </div>
          <div className="bg-muted/30 p-3 rounded-md text-center">
            <div className="text-2xl font-bold">
              ${members.reduce((sum, member) => sum + member.costRate, 0)}/hr
            </div>
            <div className="text-xs text-muted-foreground">Total Cost Rate</div>
          </div>
          <div className="bg-muted/30 p-3 rounded-md text-center">
            <div className="text-2xl font-bold">
              {(members.reduce((sum, member) => sum + member.availability, 0) / members.length).toFixed(0)}%
            </div>
            <div className="text-xs text-muted-foreground">Avg. Availability</div>
          </div>
          <div className="bg-muted/30 p-3 rounded-md text-center">
            <div className="text-2xl font-bold">{Object.keys(skillsMap).length}</div>
            <div className="text-xs text-muted-foreground">Distinct Skills</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCompositionChart;
