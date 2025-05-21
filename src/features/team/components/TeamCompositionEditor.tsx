
import React, { useState } from 'react';
import { TeamConfiguration, TeamMember, Skill } from '../containers/TeamConfigurator';
import { Button } from "@/components/design-system";
import { Plus, X, Edit, UserPlus, Settings } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import MemberFormDialog from './MemberFormDialog';
import { toast } from 'sonner';

interface TeamCompositionEditorProps {
  team: TeamConfiguration;
  onTeamChange: (team: TeamConfiguration) => void;
  isEditing: boolean;
  onAddMember?: () => void;
  onRemoveMember?: (memberId: string) => void;
}

const TeamCompositionEditor: React.FC<TeamCompositionEditorProps> = ({ 
  team, 
  onTeamChange, 
  isEditing,
  onAddMember,
  onRemoveMember 
}) => {
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTeamChange({
      ...team,
      name: e.target.value
    });
  };

  const handleAddMember = () => {
    if (onAddMember) {
      onAddMember();
    } else {
      setIsAddingMember(true);
    }
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
  };

  const handleRemoveMember = (memberId: string) => {
    if (onRemoveMember) {
      onRemoveMember(memberId);
    } else {
      onTeamChange({
        ...team,
        members: team.members.filter(member => member.id !== memberId)
      });
      toast.success("Team member removed");
    }
  };

  const handleMemberFormSubmit = (member: TeamMember) => {
    if (editingMember) {
      // Update existing member
      onTeamChange({
        ...team,
        members: team.members.map(m => m.id === member.id ? member : m)
      });
      setEditingMember(null);
      toast.success("Team member updated");
    } else {
      // Add new member
      onTeamChange({
        ...team,
        members: [...team.members, member]
      });
      setIsAddingMember(false);
      toast.success("New team member added");
    }
  };

  const handleDialogClose = () => {
    setIsAddingMember(false);
    setEditingMember(null);
  };

  const renderSkillBadges = (skills: Skill[]) => {
    return (
      <div className="flex flex-wrap gap-1">
        {skills.map((skill) => (
          <TooltipProvider key={skill.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span 
                  className={`px-2 py-1 rounded-full text-xs font-medium
                    ${getSkillColorClass(skill.level)}`}
                >
                  {skill.name}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Proficiency Level: {skill.level}/5</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    );
  };

  const getSkillColorClass = (level: number) => {
    switch (level) {
      case 5: return "bg-primary/20 text-primary";
      case 4: return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case 3: return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case 2: return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case 1: 
      default: return "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300";
    }
  };

  const renderAIAdoptionLevel = (level: number) => {
    return (
      <div className="flex items-center">
        <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
          <div 
            className={`h-full rounded-full ${getAIAdoptionColorClass(level)}`}
            style={{ width: `${level}%` }}
          />
        </div>
        <span className="text-xs">{level}%</span>
      </div>
    );
  };

  const getAIAdoptionColorClass = (level: number) => {
    if (level >= 80) return "bg-primary";
    if (level >= 60) return "bg-blue-500";
    if (level >= 40) return "bg-green-500";
    if (level >= 20) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Team Composition</h3>
        {isEditing && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddMember}
            leftIcon={<UserPlus size={16} />}
          >
            Add Member
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Team Name</label>
          <Input 
            value={team.name} 
            onChange={handleTeamNameChange}
            placeholder="Enter team name"
            className="max-w-md"
          />
        </div>
      ) : (
        <h2 className="text-xl font-bold mb-4">{team.name}</h2>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>AI Adoption</TableHead>
              {isEditing && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {team.members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>{renderSkillBadges(member.skills)}</TableCell>
                <TableCell>{member.availability}%</TableCell>
                <TableCell>{renderAIAdoptionLevel(member.aiAdoptionLevel)}</TableCell>
                {isEditing && (
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditMember(member)}
                        leftIcon={<Edit size={14} />}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveMember(member.id)}
                        leftIcon={<X size={14} />}
                      >
                        Remove
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Form dialog for adding/editing members */}
      <MemberFormDialog
        isOpen={isAddingMember || editingMember !== null}
        onClose={handleDialogClose}
        onSubmit={handleMemberFormSubmit}
        member={editingMember}
        isEditing={!!editingMember}
      />
    </div>
  );
};

export default TeamCompositionEditor;
