
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/design-system';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GenAIAccelerator } from '../types';
import { X, Plus } from 'lucide-react';

// Predefined task types
const TASK_TYPES = [
  'Code Generation', 'Code Refactoring', 'Code Review', 'Documentation', 
  'Testing', 'Debugging', 'Research', 'Planning', 'Design', 'Analysis'
];

// Predefined AI capabilities
const AI_CAPABILITIES = [
  'Text Generation', 'Code Completion', 'Natural Language Understanding',
  'Image Generation', 'Data Analysis', 'Pair Programming', 'Knowledge Retrieval',
  'Test Generation', 'Automated Documentation', 'Code Explanation'
];

interface AcceleratorDefinitionProps {
  accelerator: GenAIAccelerator;
  onSave: (accelerator: GenAIAccelerator) => void;
}

const AcceleratorDefinition: React.FC<AcceleratorDefinitionProps> = ({ accelerator, onSave }) => {
  const [editedAccelerator, setEditedAccelerator] = useState<GenAIAccelerator>({...accelerator});
  const [newTag, setNewTag] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newCapability, setNewCapability] = useState('');
  const [newTaskType, setNewTaskType] = useState('');
  const [impactValue, setImpactValue] = useState('');

  useEffect(() => {
    setEditedAccelerator({...accelerator});
  }, [accelerator]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedAccelerator(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !editedAccelerator.tags?.includes(newTag.trim())) {
      setEditedAccelerator(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditedAccelerator(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !editedAccelerator.applicableSkills.includes(newSkill.trim())) {
      setEditedAccelerator(prev => ({
        ...prev,
        applicableSkills: [...prev.applicableSkills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setEditedAccelerator(prev => ({
      ...prev,
      applicableSkills: prev.applicableSkills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addCapability = () => {
    if (newCapability.trim() && !editedAccelerator.aiCapabilities?.includes(newCapability.trim())) {
      setEditedAccelerator(prev => ({
        ...prev,
        aiCapabilities: [...(prev.aiCapabilities || []), newCapability.trim()]
      }));
      setNewCapability('');
    }
  };

  const removeCapability = (capabilityToRemove: string) => {
    setEditedAccelerator(prev => ({
      ...prev,
      aiCapabilities: (prev.aiCapabilities || []).filter(cap => cap !== capabilityToRemove)
    }));
  };

  const addTaskImpact = () => {
    if (newTaskType.trim() && !isNaN(Number(impactValue))) {
      setEditedAccelerator(prev => ({
        ...prev,
        taskTypeImpacts: {
          ...prev.taskTypeImpacts,
          [newTaskType.trim()]: Number(impactValue)
        }
      }));
      setNewTaskType('');
      setImpactValue('');
    }
  };

  const removeTaskImpact = (taskType: string) => {
    const { [taskType]: _, ...remainingImpacts } = editedAccelerator.taskTypeImpacts;
    setEditedAccelerator(prev => ({
      ...prev,
      taskTypeImpacts: remainingImpacts
    }));
  };

  const handleSave = () => {
    onSave(editedAccelerator);
  };

  return (
    <form 
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Accelerator Name</Label>
            <Input
              id="name"
              name="name"
              value={editedAccelerator.name}
              onChange={handleInputChange}
              placeholder="Enter a name for this AI accelerator"
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              value={editedAccelerator.description}
              onChange={handleInputChange}
              placeholder="Describe what this AI tool does and how it helps"
              className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm"
              required
            />
          </div>

          {/* Tags Section */}
          <div>
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {editedAccelerator.tags?.map(tag => (
                <div key={tag} className="bg-muted px-2 py-1 rounded-md flex items-center gap-1 text-sm">
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex mt-2 gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button
                type="button"
                onClick={addTag}
                variant="secondary"
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* AI Capabilities Section */}
          <div>
            <Label>AI Capabilities</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {editedAccelerator.aiCapabilities?.map(capability => (
                <div key={capability} className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md flex items-center gap-1 text-sm">
                  <span>{capability}</span>
                  <button
                    type="button"
                    onClick={() => removeCapability(capability)}
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex mt-2 gap-2">
              <Select 
                value={newCapability} 
                onValueChange={setNewCapability}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select capability" />
                </SelectTrigger>
                <SelectContent>
                  {AI_CAPABILITIES.map(capability => (
                    <SelectItem key={capability} value={capability}>
                      {capability}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={addCapability}
                variant="secondary"
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Applicable Skills Section */}
          <div>
            <Label>Applicable Skills</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {editedAccelerator.applicableSkills.map(skill => (
                <div key={skill} className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-md flex items-center gap-1 text-sm">
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex mt-2 gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <Button
                type="button"
                onClick={addSkill}
                variant="secondary"
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Task Type Impact Matrix */}
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="text-md font-medium mb-3">Task Type Impact Matrix</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {Object.entries(editedAccelerator.taskTypeImpacts).map(([taskType, impact]) => (
            <div key={taskType} className="bg-background p-3 rounded-md border flex justify-between items-center">
              <div>
                <div className="font-medium">{taskType}</div>
                <div className="text-sm text-muted-foreground">Impact: {impact}x</div>
              </div>
              <button
                type="button"
                onClick={() => removeTaskImpact(taskType)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Label>Task Type</Label>
            <Select value={newTaskType} onValueChange={setNewTaskType}>
              <SelectTrigger>
                <SelectValue placeholder="Select task type" />
              </SelectTrigger>
              <SelectContent>
                {TASK_TYPES
                  .filter(task => !Object.keys(editedAccelerator.taskTypeImpacts).includes(task))
                  .map(task => (
                    <SelectItem key={task} value={task}>
                      {task}
                    </SelectItem>
                  ))}
                <SelectItem value="custom">Custom Task Type...</SelectItem>
              </SelectContent>
            </Select>
            {newTaskType === 'custom' && (
              <Input 
                className="mt-2"
                placeholder="Enter custom task type"
                value={newTaskType === 'custom' ? '' : newTaskType}
                onChange={(e) => setNewTaskType(e.target.value)}
              />
            )}
          </div>
          <div className="w-24">
            <Label>Impact (x)</Label>
            <Input
              type="number"
              min="0.1"
              step="0.1"
              value={impactValue}
              onChange={(e) => setImpactValue(e.target.value)}
              placeholder="1.5"
            />
          </div>
          <Button
            type="button"
            onClick={addTaskImpact}
            variant="secondary"
            disabled={!newTaskType || !impactValue || newTaskType === 'custom' && !newTaskType.trim()}
          >
            Add Impact
          </Button>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" variant="primary">
          Save Accelerator Definition
        </Button>
      </div>
    </form>
  );
};

export default AcceleratorDefinition;
