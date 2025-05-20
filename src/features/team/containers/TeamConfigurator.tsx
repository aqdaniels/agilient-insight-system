
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/design-system";
import { Skeleton } from "@/components/ui/skeleton";
import TeamCompositionChart from "../components/TeamCompositionChart";
import VelocityTrendChart from "../components/VelocityTrendChart";
import { Plus, Save } from "lucide-react";

// Types
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  skills: { name: string; level: number }[];
  costRate: number;
  availability: number; // percentage of time available
}

export interface TeamVelocity {
  sprint: string;
  plannedPoints: number;
  completedPoints: number;
  date: string;
}

export interface TeamConfiguration {
  id: string;
  name: string;
  members: TeamMember[];
  velocityHistory: TeamVelocity[];
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
          { name: "Frontend", level: 90 },
          { name: "Backend", level: 75 },
          { name: "DevOps", level: 60 }
        ],
        costRate: 120,
        availability: 100
      },
      {
        id: "tm-002",
        name: "Jamie Taylor",
        role: "UX Designer",
        skills: [
          { name: "UI Design", level: 95 },
          { name: "Research", level: 85 },
          { name: "Frontend", level: 40 }
        ],
        costRate: 100,
        availability: 80
      },
      {
        id: "tm-003",
        name: "Casey Zhang",
        role: "Backend Developer",
        skills: [
          { name: "Backend", level: 95 },
          { name: "Database", level: 90 },
          { name: "DevOps", level: 75 }
        ],
        costRate: 110,
        availability: 100
      },
      {
        id: "tm-004",
        name: "Riley Johnson",
        role: "QA Engineer",
        skills: [
          { name: "Testing", level: 90 },
          { name: "Automation", level: 85 },
          { name: "Frontend", level: 30 }
        ],
        costRate: 95,
        availability: 90
      }
    ],
    velocityHistory: [
      { sprint: "Sprint 1", plannedPoints: 25, completedPoints: 20, date: "2025-01-15" },
      { sprint: "Sprint 2", plannedPoints: 28, completedPoints: 26, date: "2025-01-29" },
      { sprint: "Sprint 3", plannedPoints: 30, completedPoints: 29, date: "2025-02-12" },
      { sprint: "Sprint 4", plannedPoints: 32, completedPoints: 30, date: "2025-02-26" },
      { sprint: "Sprint 5", plannedPoints: 35, completedPoints: 33, date: "2025-03-12" },
      { sprint: "Sprint 6", plannedPoints: 35, completedPoints: 36, date: "2025-03-26" },
    ]
  };
};

const TeamConfigurator: React.FC = () => {
  const { data: teamConfig, isLoading, error } = useQuery({
    queryKey: ['teamConfiguration'],
    queryFn: fetchTeamConfiguration,
  });
  
  const [teamName, setTeamName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  
  const handleAddMember = () => {
    console.log("Adding new team member");
    // Implementation would add a new team member
  };
  
  const handleSaveConfiguration = () => {
    console.log("Saving team configuration");
    // Implementation would save the team configuration
    setIsEditing(false);
  };
  
  const handleEditConfiguration = () => {
    if (teamConfig) {
      setTeamName(teamConfig.name);
    }
    setIsEditing(true);
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

  if (!teamConfig) {
    return <div className="text-error">No team configuration found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Configuration</h2>
        <div className="flex space-x-2">
          {isEditing ? (
            <Button 
              variant="primary" 
              onClick={handleSaveConfiguration}
              leftIcon={<Save size={16} />}
            >
              Save Changes
            </Button>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 bg-card">
          <h3 className="font-medium text-lg mb-4">Team Composition</h3>
          <TeamCompositionChart members={teamConfig.members} />
        </div>
        
        <div className="border rounded-lg p-4 bg-card">
          <h3 className="font-medium text-lg mb-4">Velocity Trends</h3>
          <VelocityTrendChart velocityHistory={teamConfig.velocityHistory} />
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-lg">Team Members</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddMember}
            leftIcon={<Plus size={16} />}
            disabled={!isEditing}
          >
            Add Member
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Skills</th>
                <th className="px-4 py-3">Cost Rate</th>
                <th className="px-4 py-3">Availability</th>
                {isEditing && <th className="px-4 py-3">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {teamConfig.members.map((member) => (
                <tr key={member.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{member.name}</td>
                  <td className="px-4 py-3">{member.role}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {member.skills.map((skill) => (
                        <span 
                          key={skill.name} 
                          className="bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 px-1.5 py-0.5 text-xs rounded"
                          title={`Level: ${skill.level}/100`}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">${member.costRate}/hr</td>
                  <td className="px-4 py-3">{member.availability}%</td>
                  {isEditing && (
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamConfigurator;
