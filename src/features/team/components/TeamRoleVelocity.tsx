
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/design-system";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  skills: string[];
  velocity: number;
  capacityPerSprint: number;
}

interface TeamRoleVelocityProps {
  teamMembers: TeamMember[];
  onTeamUpdate: (members: TeamMember[]) => void;
  onRolesUpdate: (roles: string[]) => void;
}

const TeamRoleVelocity: React.FC<TeamRoleVelocityProps> = ({
  teamMembers,
  onTeamUpdate,
  onRolesUpdate,
}) => {
  const { toast } = useToast();
  const [newRole, setNewRole] = useState('');
  const [isAddingRole, setIsAddingRole] = useState(false);
  
  // Generate unique roles from team members
  const roles = Array.from(new Set(teamMembers.map(member => member.role)));
  
  const handleMemberChange = (id: string, field: keyof TeamMember, value: any) => {
    const updatedMembers = teamMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    );
    onTeamUpdate(updatedMembers);
    
    // Update roles if a new role was assigned
    if (field === 'role') {
      const updatedRoles = Array.from(new Set(updatedMembers.map(member => member.role)));
      onRolesUpdate(updatedRoles);
    }
  };
  
  const addRole = () => {
    if (!newRole.trim()) {
      toast({
        title: "Role name required",
        description: "Please enter a name for the new role",
        variant: "destructive"
      });
      return;
    }
    
    if (roles.includes(newRole)) {
      toast({
        title: "Role already exists",
        description: `The role "${newRole}" already exists`,
        variant: "destructive"
      });
      return;
    }
    
    // Add the role by updating a team member's role or creating a placeholder
    onRolesUpdate([...roles, newRole]);
    setNewRole('');
    setIsAddingRole(false);
    
    toast({
      title: "Role added",
      description: `The role "${newRole}" has been added`,
    });
  };
  
  const handleDeleteRole = (role: string) => {
    // Check if any team members have this role
    const membersWithRole = teamMembers.filter(member => member.role === role);
    
    if (membersWithRole.length > 0) {
      toast({
        title: "Cannot delete role",
        description: `The role "${role}" is assigned to ${membersWithRole.length} team member(s)`,
        variant: "destructive"
      });
      return;
    }
    
    const updatedRoles = roles.filter(r => r !== role);
    onRolesUpdate(updatedRoles);
    
    toast({
      title: "Role deleted",
      description: `The role "${role}" has been deleted`,
    });
  };
  
  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users size={18} className="text-primary" />
          <CardTitle className="text-lg">Team Roles & Velocity</CardTitle>
        </div>
        
        <div className="flex space-x-2">
          {isAddingRole ? (
            <>
              <Input 
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="New role name"
                className="w-40 h-9"
              />
              <Button 
                size="sm" 
                onClick={addRole}
              >
                Add
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setIsAddingRole(false)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button 
              size="sm" 
              variant="outline" 
              leftIcon={<Plus size={16} />}
              onClick={() => setIsAddingRole(true)}
            >
              Add Role
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Available Roles</h3>
            <div className="flex flex-wrap gap-2">
              {roles.map(role => (
                <Badge key={role} className="flex items-center gap-1 py-1 px-3">
                  {role}
                  <button 
                    onClick={() => handleDeleteRole(role)}
                    className="text-xs opacity-60 hover:opacity-100 ml-1"
                  >
                    <Trash2 size={12} />
                  </button>
                </Badge>
              ))}
              {roles.length === 0 && (
                <p className="text-sm text-muted-foreground">No roles defined yet. Add team members or create new roles.</p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Team Members</h3>
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Velocity (Story Points/Sprint)</TableHead>
                    <TableHead>Capacity (Hours/Sprint)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map(member => (
                    <TableRow key={member.id}>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>
                        <Select
                          value={member.role}
                          onValueChange={(value) => handleMemberChange(member.id, 'role', value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map(role => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {member.skills.map(skill => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Slider
                            min={1}
                            max={20}
                            step={1}
                            value={[member.velocity]}
                            onValueChange={([value]) => 
                              handleMemberChange(member.id, 'velocity', value)
                            }
                            className="w-32"
                          />
                          <span className="text-sm font-medium">{member.velocity}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Slider
                            min={10}
                            max={80}
                            step={5}
                            value={[member.capacityPerSprint]}
                            onValueChange={([value]) => 
                              handleMemberChange(member.id, 'capacityPerSprint', value)
                            }
                            className="w-32"
                          />
                          <span className="text-sm font-medium">{member.capacityPerSprint}h</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamRoleVelocity;
