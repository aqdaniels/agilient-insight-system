
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/design-system";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TeamMember, Skill } from '../containers/TeamConfigurator';
import { Plus, X, HelpCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface MemberFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (member: TeamMember) => void;
  member: TeamMember | null;
  isEditing: boolean;
}

const roles = [
  "Developer",
  "Senior Developer",
  "Lead Developer",
  "QA Engineer",
  "UX Designer",
  "Product Manager",
  "Scrum Master",
  "DevOps Engineer",
  "Data Scientist",
  "Business Analyst"
];

const skillOptions = [
  "Frontend",
  "Backend",
  "DevOps",
  "Database",
  "UI Design",
  "Research",
  "Testing",
  "Automation",
  "Mobile",
  "API Development",
  "Cloud",
  "Security",
  "Performance",
  "Machine Learning",
  "Project Management"
];

const MemberFormDialog: React.FC<MemberFormDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  member, 
  isEditing 
}) => {
  const [formData, setFormData] = useState<TeamMember>({
    id: "",
    name: "",
    role: "",
    skills: [],
    costRate: 100,
    availability: 100,
    aiAdoptionLevel: 50,
    workingDays: [true, true, true, true, true]
  });

  const [newSkill, setNewSkill] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState<number>(3);

  useEffect(() => {
    if (member) {
      setFormData(member);
    } else {
      setFormData({
        id: uuidv4(),
        name: "",
        role: "",
        skills: [],
        costRate: 100,
        availability: 100,
        aiAdoptionLevel: 50,
        workingDays: [true, true, true, true, true]
      });
    }
  }, [member]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddSkill = () => {
    if (newSkill && !formData.skills.some(skill => skill.name === newSkill)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, { name: newSkill, level: newSkillLevel }]
      });
      setNewSkill("");
      setNewSkillLevel(3);
    }
  };

  const handleRemoveSkill = (skillName: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill.name !== skillName)
    });
  };

  const handleSliderChange = (name: string, value: number[]) => {
    setFormData({
      ...formData,
      [name]: value[0]
    });
  };

  const handleNewSkillLevelChange = (value: number[]) => {
    setNewSkillLevel(value[0]);
  };

  const handleWorkingDayToggle = (index: number) => {
    const newWorkingDays = [...formData.workingDays];
    newWorkingDays[index] = !newWorkingDays[index];
    setFormData({
      ...formData,
      workingDays: newWorkingDays
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Team Member" : "Add New Team Member"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the details for this team member." : "Add a new member to your team."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Member name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cost Rate ($/hr)</label>
              <Input
                name="costRate"
                type="number"
                value={formData.costRate}
                onChange={handleInputChange}
                min={0}
                max={500}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Availability (%)</label>
                <span className="text-sm">{formData.availability}%</span>
              </div>
              <Slider
                value={[formData.availability]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => handleSliderChange("availability", value)}
                className="py-4"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <label className="text-sm font-medium">AI Adoption Level</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle size={16} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>How comfortable this team member is with AI tools and technologies. Higher levels indicate greater ability to leverage AI for productivity.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-sm">{formData.aiAdoptionLevel}%</span>
            </div>
            <Slider
              value={[formData.aiAdoptionLevel]}
              min={0}
              max={100}
              step={5}
              onValueChange={(value) => handleSliderChange("aiAdoptionLevel", value)}
              className="py-4"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Working Days</label>
            <div className="flex gap-2 justify-between">
              {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => (
                <button
                  key={day}
                  type="button"
                  className={`rounded-md px-3 py-2 text-sm ${
                    formData.workingDays[index]
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                  onClick={() => handleWorkingDayToggle(index)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Skills</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.skills.map((skill) => (
                <div 
                  key={skill.name}
                  className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-sm"
                >
                  <span>{skill.name} (Level: {skill.level})</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill.name)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Select value={newSkill} onValueChange={setNewSkill}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {skillOptions
                      .filter(skill => !formData.skills.some(s => s.name === skill))
                      .map((skill) => (
                        <SelectItem key={skill} value={skill}>
                          {skill}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-32">
                <label className="text-xs font-medium">Level: {newSkillLevel}</label>
                <Slider
                  value={[newSkillLevel]}
                  min={1}
                  max={5}
                  step={1}
                  onValueChange={handleNewSkillLevelChange}
                  className="py-2"
                />
              </div>

              <Button 
                type="button"
                onClick={handleAddSkill}
                variant="outline"
                size="sm"
                leftIcon={<Plus size={14} />}
                className="mb-1"
              >
                Add
              </Button>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update Member" : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MemberFormDialog;
