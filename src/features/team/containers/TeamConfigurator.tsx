
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/design-system";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/design-system";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Users, BarChart2, Gauge, Calendar, Lightbulb, UserPlus } from "lucide-react";
import { toast } from "sonner";

import TeamCompositionEditor from "../components/TeamCompositionEditor";
import TeamCompositionChart from "../components/TeamCompositionChart";
import VelocityTrendChart from "../components/VelocityTrendChart";
import TeamOptimizationView from "../components/TeamOptimizationView";
import WorkingPatternConfig from "../components/WorkingPatternConfig";
import VelocityDataTable from "../components/VelocityDataTable";
import { v4 as uuidv4 } from "uuid";

// Types
export interface Skill {
  name: string;
  level: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  skills: Skill[];
  costRate: number;
  availability: number; // percentage of time available
  aiAdoptionLevel: number; // 0-100 scale
  workingDays: boolean[]; // array of 5 booleans, one for each day of the work week
}

export interface VelocityData {
  sprintId: string;
  sprintName: string;
  plannedPoints: number;
  completedPoints: number;
  completionRate: number;
  date: string;
}

export interface TeamConfiguration {
  id: string;
  name: string;
  members: TeamMember[];
  velocityHistory: VelocityData[];
  averageVelocity: number;
  capacityPerSprint: number;
  workingDaysPerSprint: number;
  sprintLength: number; // in weeks
  ceremonyOverhead: number; // in hours per sprint
}

// Mock API call
const fetchTeamConfiguration = async (): Promise<TeamConfiguration> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: "team-001",
    name: "Core Development Team",
    members: [
      {
        id: "tm-001",
        name: "Alex Morgan",
        role: "Senior Developer",
        skills: [
          { name: "Frontend", level: 4 },
          { name: "Backend", level: 3 },
          { name: "DevOps", level: 3 }
        ],
        costRate: 120,
        availability: 100,
        aiAdoptionLevel: 75,
        workingDays: [true, true, true, true, true]
      },
      {
        id: "tm-002",
        name: "Jamie Taylor",
        role: "UX Designer",
        skills: [
          { name: "UI Design", level: 5 },
          { name: "Research", level: 4 },
          { name: "Frontend", level: 2 }
        ],
        costRate: 100,
        availability: 80,
        aiAdoptionLevel: 60,
        workingDays: [true, true, true, true, false]
      },
      {
        id: "tm-003",
        name: "Casey Zhang",
        role: "Backend Developer",
        skills: [
          { name: "Backend", level: 5 },
          { name: "Database", level: 4 },
          { name: "DevOps", level: 3 }
        ],
        costRate: 110,
        availability: 100,
        aiAdoptionLevel: 70,
        workingDays: [true, true, true, true, true]
      },
      {
        id: "tm-004",
        name: "Riley Johnson",
        role: "QA Engineer",
        skills: [
          { name: "Testing", level: 4 },
          { name: "Automation", level: 4 },
          { name: "Frontend", level: 2 }
        ],
        costRate: 95,
        availability: 90,
        aiAdoptionLevel: 65,
        workingDays: [true, true, true, true, true]
      }
    ],
    velocityHistory: [
      { sprintId: "s1", sprintName: "Sprint 1", plannedPoints: 25, completedPoints: 20, completionRate: 80, date: "2025-01-15" },
      { sprintId: "s2", sprintName: "Sprint 2", plannedPoints: 28, completedPoints: 26, completionRate: 93, date: "2025-01-29" },
      { sprintId: "s3", sprintName: "Sprint 3", plannedPoints: 30, completedPoints: 29, completionRate: 97, date: "2025-02-12" },
      { sprintId: "s4", sprintName: "Sprint 4", plannedPoints: 32, completedPoints: 30, completionRate: 94, date: "2025-02-26" },
      { sprintId: "s5", sprintName: "Sprint 5", plannedPoints: 35, completedPoints: 33, completionRate: 94, date: "2025-03-12" },
      { sprintId: "s6", sprintName: "Sprint 6", plannedPoints: 35, completedPoints: 36, completionRate: 103, date: "2025-03-26" },
    ],
    averageVelocity: 29,
    capacityPerSprint: 32,
    workingDaysPerSprint: 10,
    sprintLength: 2,
    ceremonyOverhead: 8
  };
};

const TeamConfigurator: React.FC = () => {
  const { data: teamConfig, isLoading, error } = useQuery({
    queryKey: ['teamConfiguration'],
    queryFn: fetchTeamConfiguration,
  });
  
  const [activeTeam, setActiveTeam] = useState<TeamConfiguration | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Set activeTeam once data is loaded
  React.useEffect(() => {
    if (teamConfig && !activeTeam) {
      setActiveTeam(teamConfig);
    }
  }, [teamConfig, activeTeam]);
  
  const handleTeamUpdate = (updatedTeam: TeamConfiguration) => {
    setActiveTeam(updatedTeam);
  };
  
  const handleSaveConfiguration = () => {
    console.log("Saving team configuration:", activeTeam);
    // Implementation would save the team configuration
    toast.success("Team configuration saved successfully");
    setIsEditing(false);
  };
  
  const handleEditConfiguration = () => {
    setIsEditing(true);
  };

  const handleAddMember = () => {
    if (!activeTeam) return;
    
    const newMember: TeamMember = {
      id: uuidv4(),
      name: "New Team Member",
      role: "Developer",
      skills: [],
      costRate: 100,
      availability: 100,
      aiAdoptionLevel: 50,
      workingDays: [true, true, true, true, true]
    };
    
    setActiveTeam({
      ...activeTeam,
      members: [...activeTeam.members, newMember]
    });
    
    toast.success("New team member added");
  };
  
  const handleRemoveMember = (memberId: string) => {
    if (!activeTeam) return;
    
    setActiveTeam({
      ...activeTeam,
      members: activeTeam.members.filter(member => member.id !== memberId)
    });
    
    toast.success("Team member removed");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Team Configuration</h2>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-error">Error loading team configuration: {error.toString()}</div>;
  }

  if (!activeTeam) {
    return <div className="text-error">No team configuration found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Configuration</h2>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={handleAddMember}
                leftIcon={<UserPlus size={16} />}
              >
                Add Team Member
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSaveConfiguration}
                leftIcon={<Save size={16} />}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              onClick={handleEditConfiguration}
            >
              Edit Configuration
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="composition" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="composition" className="flex items-center gap-2">
            <Users size={16} />
            <span>Team Composition</span>
          </TabsTrigger>
          <TabsTrigger value="velocity" className="flex items-center gap-2">
            <BarChart2 size={16} />
            <span>Velocity Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <Lightbulb size={16} />
            <span>Optimization</span>
          </TabsTrigger>
          <TabsTrigger value="patterns" className="flex items-center gap-2">
            <Calendar size={16} />
            <span>Working Patterns</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="composition" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="h-full">
                <TeamCompositionEditor 
                  team={activeTeam} 
                  onTeamChange={handleTeamUpdate} 
                  isEditing={isEditing} 
                  onAddMember={handleAddMember}
                  onRemoveMember={handleRemoveMember}
                />
              </Card>
            </div>
            <div>
              <Card>
                <TeamCompositionChart members={activeTeam.members} />
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="velocity" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <VelocityTrendChart velocityHistory={activeTeam.velocityHistory} />
              </Card>
            </div>
            <div>
              <Card className="h-full">
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-3">Velocity Metrics</h3>
                  <div className="space-y-4">
                    <div className="bg-muted/30 p-4 rounded-md">
                      <div className="text-3xl font-bold text-center">{activeTeam.averageVelocity}</div>
                      <div className="text-sm text-center text-muted-foreground">Average Velocity</div>
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-md">
                      <div className="text-3xl font-bold text-center">{activeTeam.capacityPerSprint}</div>
                      <div className="text-sm text-center text-muted-foreground">Capacity Per Sprint</div>
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-md">
                      <div className="flex items-center justify-center">
                        <Gauge className="w-8 h-8 text-primary mr-2" />
                        <span className="text-xl font-semibold">
                          {Math.round((activeTeam.averageVelocity / activeTeam.capacityPerSprint) * 100)}%
                        </span>
                      </div>
                      <div className="text-sm text-center text-muted-foreground">Capacity Utilization</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          
          <Card>
            <VelocityDataTable 
              velocityData={activeTeam.velocityHistory} 
              isEditing={isEditing}
              onDataChange={(updatedData) => {
                handleTeamUpdate({
                  ...activeTeam,
                  velocityHistory: updatedData
                });
              }}
            />
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <TeamOptimizationView team={activeTeam} />
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <WorkingPatternConfig 
              team={activeTeam}
              isEditing={isEditing}
              onPatternChange={(updatedTeam) => handleTeamUpdate(updatedTeam)}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamConfigurator;
