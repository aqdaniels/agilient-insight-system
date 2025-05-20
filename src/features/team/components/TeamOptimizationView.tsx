
import React, { useMemo } from 'react';
import { TeamConfiguration } from '../containers/TeamConfigurator';
import { 
  Users, 
  LineChart,
  Gauge, 
  Grid2X2,
  AlertTriangle,
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';

interface TeamOptimizationViewProps {
  team: TeamConfiguration;
}

const TeamOptimizationView: React.FC<TeamOptimizationViewProps> = ({ team }) => {
  // Calculate all the team optimization metrics
  
  const skillCoverage = useMemo(() => {
    // Get a list of all skills across the team
    const allSkills = new Set<string>();
    team.members.forEach(member => {
      member.skills.forEach(skill => {
        allSkills.add(skill.name);
      });
    });
    
    // Calculate coverage for each skill
    const skillMap: Record<string, { 
      coverage: number; 
      averageLevel: number;
      peopleCount: number;
      isBottleneck: boolean; 
    }> = {};
    
    allSkills.forEach(skillName => {
      const membersWithSkill = team.members.filter(member => 
        member.skills.some(skill => skill.name === skillName)
      );
      
      const coverage = membersWithSkill.length / team.members.length;
      const averageLevel = membersWithSkill.reduce((sum, member) => {
        const skill = member.skills.find(s => s.name === skillName);
        return sum + (skill?.level || 0);
      }, 0) / membersWithSkill.length;
      
      skillMap[skillName] = { 
        coverage,
        averageLevel,
        peopleCount: membersWithSkill.length,
        isBottleneck: coverage < 0.25 && averageLevel > 3 // Just an example heuristic
      };
    });
    
    return skillMap;
  }, [team.members]);

  // Calculate specialty vs generalist ratio
  const specialtyRatio = useMemo(() => {
    const totalMembers = team.members.length;
    if (totalMembers === 0) return 0;
    
    const specialists = team.members.filter(member => {
      // Determine if they have one skill that's much higher than others
      const skills = member.skills;
      if (skills.length <= 1) return true; // Only one skill = specialist
      
      const maxLevel = Math.max(...skills.map(s => s.level));
      const otherSkillsMax = Math.max(...skills.filter(s => s.level < maxLevel).map(s => s.level) || [0]);
      
      return maxLevel - otherSkillsMax >= 2; // Gap of 2+ levels = specialist
    });
    
    return specialists.length / totalMembers;
  }, [team.members]);

  // Calculate optimal team size
  const optimalTeamSize = useMemo(() => {
    // This is a simplified model and would be more sophisticated in a real app
    
    // Amazon's two-pizza team rule suggests 6-10 people
    // Based on velocity and capacity, we can adjust this
    
    const baseTeamSize = 7; // Ideal scrum team size
    
    // If team is underperforming relative to capacity, might need more people
    const velocityToCapacityRatio = team.averageVelocity / team.capacityPerSprint;
    
    let adjustedSize = baseTeamSize;
    
    if (velocityToCapacityRatio < 0.8) {
      // Team is significantly underperforming - might need more people
      adjustedSize += 1;
    } else if (velocityToCapacityRatio > 1.1) {
      // Team is overperforming - might be running at an unsustainable pace
      adjustedSize -= 0.5;
    }
    
    // Look at variance in sprint completion
    const completionRates = team.velocityHistory.map(v => v.completionRate);
    const avgCompletionRate = completionRates.reduce((sum, rate) => sum + rate, 0) / completionRates.length;
    const variance = completionRates.reduce((sum, rate) => sum + Math.pow(rate - avgCompletionRate, 2), 0) / completionRates.length;
    const stdDev = Math.sqrt(variance);
    
    if (stdDev > 15) {
      // High variance in sprint completion suggests team may be understaffed or have skill gaps
      adjustedSize += 0.5;
    }
    
    return {
      min: Math.round(adjustedSize - 1),
      ideal: Math.round(adjustedSize),
      max: Math.round(adjustedSize + 2)
    };
  }, [team.averageVelocity, team.capacityPerSprint, team.velocityHistory]);

  const velocityTrend = useMemo(() => {
    if (team.velocityHistory.length < 3) {
      return { trend: 0, isPositive: false };
    }
    
    const recentVelocities = team.velocityHistory
      .slice(-3)
      .map(v => v.completedPoints);
    
    const firstValue = recentVelocities[0];
    const lastValue = recentVelocities[recentVelocities.length - 1];
    
    const trend = ((lastValue - firstValue) / firstValue) * 100;
    
    return {
      trend: Math.round(trend),
      isPositive: trend > 0
    };
  }, [team.velocityHistory]);

  // Get color based on value (0-1)
  const getHeatMapColor = (value: number) => {
    if (value >= 0.8) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'; 
    if (value >= 0.5) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    if (value >= 0.3) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  };

  // Get color class for skill level (1-5)
  const getSkillLevelColor = (level: number) => {
    if (level >= 4.5) return 'bg-green-200 text-green-900';
    if (level >= 3.5) return 'bg-green-100 text-green-800';
    if (level >= 2.5) return 'bg-blue-100 text-blue-800';
    if (level >= 1.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Team Optimization Analysis</h3>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Grid2X2 size={20} />
              <h4 className="text-base font-medium">Skill Coverage Heat Map</h4>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(skillCoverage).map(([skill, data]) => (
                <div 
                  key={skill}
                  className={`p-3 rounded-lg ${getHeatMapColor(data.coverage)}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-medium">{skill}</h5>
                      <div className="text-xs opacity-80">
                        {Math.round(data.coverage * 100)}% coverage ({data.peopleCount} {data.peopleCount === 1 ? 'person' : 'people'})
                      </div>
                    </div>
                    {data.isBottleneck && (
                      <AlertTriangle size={18} className="text-amber-500" />
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Avg. Proficiency</span>
                      <span className={`px-1.5 rounded ${getSkillLevelColor(data.averageLevel)}`}>
                        {data.averageLevel.toFixed(1)}/5
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                      <div 
                        className="bg-current h-1.5 rounded-full" 
                        style={{ width: `${(data.averageLevel/5)*100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 bg-card">
              <div className="flex items-center gap-2 mb-3">
                <LineChart size={18} />
                <h4 className="text-base font-medium">Velocity Trend</h4>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    {velocityTrend.isPositive ? (
                      <TrendingUp size={36} className="text-success mr-2" />
                    ) : (
                      <TrendingDown size={36} className={velocityTrend.trend === 0 ? "text-muted-foreground" : "text-destructive"} />
                    )}
                    <span className={`text-3xl font-bold ${
                      velocityTrend.trend > 0 ? 'text-success' : 
                      velocityTrend.trend < 0 ? 'text-destructive' : ''
                    }`}>
                      {velocityTrend.trend > 0 ? '+' : ''}{velocityTrend.trend}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Over last 3 sprints</p>
                  
                  <div className="mt-4 text-sm">
                    {velocityTrend.trend > 10 ? (
                      <p className="text-success">Strong positive trend indicates team is improving well</p>
                    ) : velocityTrend.trend > 0 ? (
                      <p className="text-success">Slight improvement in team velocity</p>
                    ) : velocityTrend.trend === 0 ? (
                      <p>Stable team velocity</p>
                    ) : velocityTrend.trend > -10 ? (
                      <p className="text-amber-500">Minor decline in velocity</p>
                    ) : (
                      <p className="text-destructive">Significant velocity decline needs attention</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 bg-card">
              <div className="flex items-center gap-2 mb-3">
                <Users size={18} />
                <h4 className="text-base font-medium">Team Composition Analysis</h4>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Specialists vs. Generalists</span>
                    <span className="text-sm font-medium">
                      {Math.round(specialtyRatio * 100)}% / {Math.round((1-specialtyRatio) * 100)}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${specialtyRatio * 100}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between mt-1">
                    <span className="text-xs">Specialists</span>
                    <span className="text-xs">Generalists</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="text-sm text-muted-foreground mb-1">Skill Distribution</div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(skillCoverage)
                      .sort((a, b) => b[1].peopleCount - a[1].peopleCount)
                      .slice(0, 5)
                      .map(([skill, data]) => (
                        <div key={skill} className="text-xs bg-muted px-2 py-1 rounded-full">
                          {skill}: {data.peopleCount}
                        </div>
                      ))
                    }
                  </div>
                </div>
                
                <div className="mt-2">
                  <div className="text-sm text-muted-foreground mb-1">Potential Bottlenecks</div>
                  <div className="space-y-1">
                    {Object.entries(skillCoverage)
                      .filter(([_, data]) => data.isBottleneck)
                      .map(([skill, data]) => (
                        <div key={skill} className="flex items-center gap-1.5 text-xs text-amber-500">
                          <AlertTriangle size={14} />
                          <span>{skill} ({data.peopleCount} member{data.peopleCount !== 1 ? 's' : ''})</span>
                        </div>
                      ))
                    }
                    {Object.entries(skillCoverage).filter(([_, data]) => data.isBottleneck).length === 0 && (
                      <div className="text-xs text-success">No significant bottlenecks detected</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="border rounded-lg p-4 bg-card">
            <h4 className="font-medium mb-3">Team Size Recommendation</h4>
            
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-primary">{optimalTeamSize.ideal}</div>
              <div className="text-sm text-muted-foreground">
                Recommended team size
              </div>
              
              <div className="flex items-center justify-center gap-3">
                <div className="text-sm">
                  <div className="font-medium">{optimalTeamSize.min}</div>
                  <div className="text-xs text-muted-foreground">Minimum</div>
                </div>
                
                <div className="h-6 border-r border-border"></div>
                
                <div className="text-sm">
                  <div className="font-medium">{optimalTeamSize.max}</div>
                  <div className="text-xs text-muted-foreground">Maximum</div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border">
              <div className="text-sm font-medium mb-2">Current Size: {team.members.length}</div>
              
              {team.members.length < optimalTeamSize.min && (
                <div className="text-sm text-amber-500">
                  Your team is understaffed. Consider adding {optimalTeamSize.min - team.members.length} more members to improve capacity.
                </div>
              )}
              
              {team.members.length > optimalTeamSize.max && (
                <div className="text-sm text-amber-500">
                  Your team may be too large. Consider splitting into smaller teams for better efficiency.
                </div>
              )}
              
              {team.members.length >= optimalTeamSize.min && team.members.length <= optimalTeamSize.max && (
                <div className="text-sm text-success">
                  Your team size is within the optimal range.
                </div>
              )}
            </div>
          </div>
          
          <div className="border rounded-lg p-4 bg-card">
            <h4 className="font-medium mb-3">Utilization Analysis</h4>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Capacity Utilization</span>
                  <span className="text-sm font-medium">
                    {Math.round((team.averageVelocity / team.capacityPerSprint) * 100)}%
                  </span>
                </div>
                
                <div className="relative">
                  <div className="flex items-center justify-center">
                    <Gauge size={120} className="text-muted-foreground" />
                    <div className="absolute text-lg font-bold">
                      {Math.round((team.averageVelocity / team.capacityPerSprint) * 100)}%
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-2 text-sm space-y-2">
                {team.averageVelocity / team.capacityPerSprint > 0.95 && (
                  <p className="text-success">Team is working at optimal capacity</p>
                )}
                
                {team.averageVelocity / team.capacityPerSprint < 0.7 && (
                  <p className="text-amber-500">Team may have untapped capacity</p>
                )}
                
                {team.averageVelocity / team.capacityPerSprint > 1.1 && (
                  <p className="text-destructive">Team may be overextended</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 bg-card">
            <h4 className="font-medium mb-3">Team AI Adoption</h4>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Average AI Adoption</span>
                <span className="text-sm font-medium">
                  {Math.round(team.members.reduce((sum, m) => sum + m.aiAdoptionLevel, 0) / team.members.length)}%
                </span>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ 
                    width: `${Math.round(team.members.reduce((sum, m) => sum + m.aiAdoptionLevel, 0) / team.members.length)}%` 
                  }}
                />
              </div>
            </div>
            
            <div className="mt-4 text-sm">
              <p>
                {Math.round(team.members.reduce((sum, m) => sum + m.aiAdoptionLevel, 0) / team.members.length) > 70 
                  ? "Team shows strong AI adoption, which may boost productivity." 
                  : "Consider AI training to improve team efficiency."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamOptimizationView;
