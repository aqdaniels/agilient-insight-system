
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/design-system";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { BacklogItem } from "../containers/BacklogManager";
import { v4 as uuidv4 } from 'uuid';
import { RefreshCw, Plus } from "lucide-react";

interface StoryGeneratorProps {
  documentText: string;
  onStoriesGenerated: (stories: BacklogItem[]) => void;
  teamRoles: string[];
}

interface GeneratedStory {
  id: string;
  title: string;
  type: BacklogItem['type'];
  priority: BacklogItem['priority'];
  estimate: number;
  status: BacklogItem['status'];
  tags: string[];
  role: string;
}

const StoryGenerator: React.FC<StoryGeneratorProps> = ({
  documentText,
  onStoriesGenerated,
  teamRoles
}) => {
  const [generatedStories, setGeneratedStories] = useState<GeneratedStory[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Simple NLP to extract user stories from text
  const generateStoriesFromText = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      // This is a simplified mock of NLP processing
      // In a real implementation, you'd use a more sophisticated algorithm or AI service
      
      const lines = documentText.split('\n').filter(line => line.trim());
      const stories: GeneratedStory[] = [];
      
      // Simple pattern matching for "As a [role], I want [feature] so that [benefit]"
      const userStoryPattern = /As an? ([^,]+),\s*I want (?:to )?([^,\.]+)(?:,? so that ([^\.]+))?/i;
      
      for (const line of lines) {
        const match = line.match(userStoryPattern);
        
        if (match) {
          const [, role, want, benefit] = match;
          
          // Generate a user story
          stories.push({
            id: uuidv4(),
            title: `${want.trim()}${benefit ? ` (${benefit.trim()})` : ''}`,
            type: 'story',
            priority: 'medium',
            estimate: Math.floor(Math.random() * 5) + 1,
            status: 'todo',
            tags: [role.toLowerCase().trim()],
            role: role.trim()
          });
        } else if (line.toLowerCase().includes('bug') || line.toLowerCase().includes('fix')) {
          // Identify potential bugs
          stories.push({
            id: uuidv4(),
            title: line,
            type: 'bug',
            priority: 'high',
            estimate: Math.floor(Math.random() * 3) + 1,
            status: 'todo',
            tags: ['bug'],
            role: teamRoles[Math.floor(Math.random() * teamRoles.length)]
          });
        } else if (line.length > 10 && !line.startsWith('#')) {
          // Any other substantial line becomes a task
          stories.push({
            id: uuidv4(),
            title: line,
            type: 'task',
            priority: 'medium',
            estimate: Math.floor(Math.random() * 3) + 1,
            status: 'todo',
            tags: [],
            role: teamRoles[Math.floor(Math.random() * teamRoles.length)]
          });
        }
      }
      
      setGeneratedStories(stories);
      setIsGenerating(false);
    }, 1500); // Simulate processing time
  };
  
  const handleStoryChange = (id: string, field: keyof GeneratedStory, value: any) => {
    setGeneratedStories(prev => 
      prev.map(story => 
        story.id === id ? { ...story, [field]: value } : story
      )
    );
  };
  
  const handleAddToBacklog = () => {
    // Convert to backlog items
    const backlogItems: BacklogItem[] = generatedStories.map(({ role, ...story }) => ({
      ...story,
      assignee: role // Use role as assignee for now
    }));
    
    onStoriesGenerated(backlogItems);
  };
  
  const addNewStory = () => {
    setGeneratedStories(prev => [
      ...prev,
      {
        id: uuidv4(),
        title: '',
        type: 'story',
        priority: 'medium',
        estimate: 3,
        status: 'todo',
        tags: [],
        role: teamRoles[0] || ''
      }
    ]);
  };
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Generated User Stories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between mb-4">
          <Button
            variant="outline"
            leftIcon={<RefreshCw size={16} />}
            onClick={generateStoriesFromText}
            disabled={isGenerating || !documentText}
          >
            {isGenerating ? 'Generating...' : 'Generate Stories'}
          </Button>
          
          <Button
            variant="primary"
            onClick={handleAddToBacklog}
            disabled={generatedStories.length === 0}
          >
            Add to Backlog
          </Button>
        </div>
        
        {generatedStories.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Story</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Estimate</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {generatedStories.map((story) => (
                  <TableRow key={story.id}>
                    <TableCell>
                      <Input
                        value={story.title}
                        onChange={(e) => handleStoryChange(story.id, 'title', e.target.value)}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={story.type}
                        onValueChange={(value: BacklogItem['type']) => 
                          handleStoryChange(story.id, 'type', value)
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="story">Story</SelectItem>
                          <SelectItem value="bug">Bug</SelectItem>
                          <SelectItem value="task">Task</SelectItem>
                          <SelectItem value="epic">Epic</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={story.priority}
                        onValueChange={(value: BacklogItem['priority']) => 
                          handleStoryChange(story.id, 'priority', value)
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Slider
                          min={1}
                          max={13}
                          step={1}
                          value={[story.estimate]}
                          onValueChange={(values) => 
                            handleStoryChange(story.id, 'estimate', values[0])
                          }
                          className="w-24"
                        />
                        <span className="text-sm">{story.estimate}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={story.role}
                        onValueChange={(value) => 
                          handleStoryChange(story.id, 'role', value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamRoles.map(role => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="border rounded-md p-12 text-center bg-muted/20">
            <p className="text-muted-foreground">
              {isGenerating ? 'Generating stories...' : 'No stories generated yet. Click "Generate Stories" to begin.'}
            </p>
          </div>
        )}
        
        {generatedStories.length > 0 && (
          <Button
            variant="outline"
            className="mt-2"
            leftIcon={<Plus size={16} />}
            onClick={addNewStory}
          >
            Add Story
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default StoryGenerator;
