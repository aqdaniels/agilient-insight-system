
import React, { useState, useEffect } from 'react';
import { TeamConfiguration } from '../containers/TeamConfigurator';
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/design-system";
import { Calendar } from "@/components/ui/calendar";
import { Clock, Calendar as CalendarIcon, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface WorkingPatternConfigProps {
  team: TeamConfiguration;
  isEditing: boolean;
  onPatternChange: (updatedTeam: TeamConfiguration) => void;
}

const WorkingPatternConfig: React.FC<WorkingPatternConfigProps> = ({
  team,
  isEditing,
  onPatternChange
}) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [calculatedCapacity, setCalculatedCapacity] = useState<number>(team.capacityPerSprint);

  useEffect(() => {
    calculateTeamCapacity();
  }, [team.members, team.sprintLength, team.ceremonyOverhead]);

  const handleSprintLengthChange = (value: string) => {
    const newSprintLength = parseInt(value);
    onPatternChange({
      ...team,
      sprintLength: newSprintLength,
      workingDaysPerSprint: calculateWorkingDays(newSprintLength)
    });
  };

  const handleCeremonyOverheadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOverhead = parseInt(e.target.value);
    onPatternChange({
      ...team,
      ceremonyOverhead: newOverhead
    });
  };

  const calculateWorkingDays = (sprintLength: number): number => {
    // Simple calculation - average working days in a sprint
    // In a more complex implementation, this would account for holidays, etc.
    return sprintLength * 5; // 5 working days per week
  };

  const calculateTeamCapacity = () => {
    // Basic capacity calculation
    const totalMemberHours = team.members.reduce((total, member) => {
      const memberWorkingDays = member.workingDays.filter(day => day).length;
      const daysPerSprint = team.sprintLength * memberWorkingDays;
      const availableHoursPerDay = 8 * (member.availability / 100);
      return total + (daysPerSprint * availableHoursPerDay);
    }, 0);
    
    // Subtract ceremony overhead
    const netCapacityHours = totalMemberHours - team.ceremonyOverhead;
    
    // Convert hours to story points using a conversion factor
    // This is oversimplified - in real systems, this would be based on team velocity history
    const hourToPointRatio = 2; // 2 hours per story point
    const capacityInPoints = Math.round(netCapacityHours / hourToPointRatio);
    
    setCalculatedCapacity(capacityInPoints);
    
    if (isEditing) {
      onPatternChange({
        ...team,
        capacityPerSprint: capacityInPoints
      });
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Toggle date selection
      const dateStr = date.toDateString();
      const isSelected = selectedDates.some(d => d.toDateString() === dateStr);
      
      if (isSelected) {
        setSelectedDates(selectedDates.filter(d => d.toDateString() !== dateStr));
      } else {
        setSelectedDates([...selectedDates, date]);
      }
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Working Pattern Configuration</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Sprint Length</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={16} className="text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The number of weeks in each sprint cycle.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <Select 
              value={team.sprintLength.toString()} 
              onValueChange={handleSprintLengthChange}
              disabled={!isEditing}
            >
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="Select sprint length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Week</SelectItem>
                <SelectItem value="2">2 Weeks</SelectItem>
                <SelectItem value="3">3 Weeks</SelectItem>
                <SelectItem value="4">4 Weeks</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Ceremony Overhead (hours/sprint)</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={16} className="text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total time spent on ceremonies (planning, review, retrospective, etc.) per sprint.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="flex items-center space-x-4 max-w-xs">
              <Input
                type="number"
                value={team.ceremonyOverhead}
                onChange={handleCeremonyOverheadChange}
                disabled={!isEditing}
                min={0}
                max={40}
                className="w-24"
              />
              <div className="flex-1">
                <Slider
                  value={[team.ceremonyOverhead]}
                  min={0}
                  max={40}
                  step={1}
                  onValueChange={(value) => 
                    onPatternChange({...team, ceremonyOverhead: value[0]})
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            {isEditing && (
              <p className="text-xs text-muted-foreground">
                Recommended: 4-8 hours per week of sprint length
              </p>
            )}
          </div>

          <div className="space-y-2 pt-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Team Capacity</h4>
              <div className="text-2xl font-bold text-primary">
                {calculatedCapacity} <span className="text-sm text-muted-foreground">points/sprint</span>
              </div>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CalendarIcon size={18} />
                  <span className="text-sm font-medium">Working Days</span>
                </div>
                <span>{team.workingDaysPerSprint} days/sprint</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span className="text-sm font-medium">Ceremony Overhead</span>
                </div>
                <span>{team.ceremonyOverhead} hours/sprint</span>
              </div>
              
              <div className="border-t border-border pt-3 mt-2">
                <div className="flex justify-between items-center font-medium">
                  <span>Effective Capacity</span>
                  <span>{calculatedCapacity} points</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Holiday Calendar</h4>
            <p className="text-xs text-muted-foreground mb-2">
              {isEditing ? 
                "Select dates to mark as holidays or non-working days" : 
                "Holidays and non-working days impact team capacity"}
            </p>
            
            <div className="border rounded-md p-2">
              <Calendar
                mode="multiple"
                selected={selectedDates}
                onSelect={handleDateSelect}
                disabled={!isEditing}
                className="rounded-md border"
              />
            </div>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Working Pattern Summary</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Sprint Length:</span>
                <span className="font-medium">{team.sprintLength} {team.sprintLength === 1 ? 'week' : 'weeks'}</span>
              </li>
              <li className="flex justify-between">
                <span>Working Days per Sprint:</span>
                <span className="font-medium">{team.workingDaysPerSprint} days</span>
              </li>
              <li className="flex justify-between">
                <span>Average Team Availability:</span>
                <span className="font-medium">
                  {Math.round(team.members.reduce((sum, m) => sum + m.availability, 0) / team.members.length)}%
                </span>
              </li>
              <li className="flex justify-between">
                <span>Non-working Days:</span>
                <span className="font-medium">{selectedDates.length} marked</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkingPatternConfig;
