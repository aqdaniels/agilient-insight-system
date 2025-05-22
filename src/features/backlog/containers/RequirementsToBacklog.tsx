
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/design-system";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';
import RequirementsUploader from '../components/RequirementsUploader';
import StoryGenerator from '../components/StoryGenerator';
import { BacklogItem } from './BacklogManager';
import TeamRoleVelocity, { TeamMember } from '@/features/team/components/TeamRoleVelocity';
import { Play, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const defaultTeamMembers: TeamMember[] = [
  {
    id: uuidv4(),
    name: 'John Smith',
    role: 'Developer',
    skills: ['JavaScript', 'React', 'Node.js'],
    velocity: 10,
    capacityPerSprint: 80
  },
  {
    id: uuidv4(),
    name: 'Jane Doe',
    role: 'Designer',
    skills: ['UI/UX', 'Figma', 'CSS'],
    velocity: 8,
    capacityPerSprint: 70
  },
  {
    id: uuidv4(),
    name: 'Mike Johnson',
    role: 'QA',
    skills: ['Testing', 'Automation', 'Performance'],
    velocity: 12,
    capacityPerSprint: 75
  }
];

const RequirementsToBacklog: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("requirements");
  const [documentText, setDocumentText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [backlogItems, setBacklogItems] = useState<BacklogItem[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(defaultTeamMembers);
  const [teamRoles, setTeamRoles] = useState<string[]>(['Developer', 'Designer', 'QA']);
  
  // Process the uploaded document
  const handleDocumentProcessed = (text: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setDocumentText(text);
      setIsProcessing(false);
      setActiveTab("stories");
      
      toast({
        title: "Document processed",
        description: "Your requirements document has been processed and is ready for story generation."
      });
    }, 1000);
  };
  
  // Add generated stories to the backlog
  const handleStoriesGenerated = (stories: BacklogItem[]) => {
    setBacklogItems(stories);
    setActiveTab("team");
    
    toast({
      title: "Stories generated",
      description: `${stories.length} user stories have been generated and are ready for team assignment.`
    });
  };
  
  // Update team members
  const handleTeamUpdate = (members: TeamMember[]) => {
    setTeamMembers(members);
  };
  
  // Update team roles
  const handleRolesUpdate = (roles: string[]) => {
    setTeamRoles(roles);
  };
  
  // Start the simulation with the current backlog and team configuration
  const startSimulation = () => {
    // In a real implementation, this would prepare the data and redirect to the simulation page
    // For now, we'll just navigate to the simulation page
    toast({
      title: "Starting simulation",
      description: "Preparing backlog items and team configuration for simulation."
    });
    
    // Typically, you would store this data in a context or pass via state
    // For this demo, we'll just redirect to the simulation page
    navigate('/simulation');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Requirements to Backlog</h2>
        <Button 
          variant="primary" 
          leftIcon={<Play size={16} />}
          onClick={startSimulation}
          disabled={activeTab !== "team" || backlogItems.length === 0}
        >
          Start Simulation
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="requirements">
            1. Upload Requirements
          </TabsTrigger>
          <TabsTrigger value="stories" disabled={!documentText}>
            2. Generate Stories
          </TabsTrigger>
          <TabsTrigger value="team" disabled={backlogItems.length === 0}>
            3. Team Configuration
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="requirements" className="mt-6">
          <RequirementsUploader 
            onDocumentProcessed={handleDocumentProcessed}
            isProcessing={isProcessing}
          />
          
          {documentText && (
            <div className="mt-6 flex justify-end">
              <Button 
                variant="primary"
                rightIcon={<ArrowRight size={16} />}
                onClick={() => setActiveTab("stories")}
              >
                Next: Generate Stories
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="stories" className="mt-6">
          {documentText ? (
            <StoryGenerator 
              documentText={documentText}
              onStoriesGenerated={handleStoriesGenerated}
              teamRoles={teamRoles}
            />
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">Please upload a requirements document first.</p>
              </CardContent>
            </Card>
          )}
          
          {backlogItems.length > 0 && (
            <div className="mt-6 flex justify-end">
              <Button 
                variant="primary"
                rightIcon={<ArrowRight size={16} />}
                onClick={() => setActiveTab("team")}
              >
                Next: Team Configuration
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="team" className="mt-6">
          <TeamRoleVelocity 
            teamMembers={teamMembers}
            onTeamUpdate={handleTeamUpdate}
            onRolesUpdate={handleRolesUpdate}
          />
          
          {backlogItems.length > 0 && (
            <div className="mt-6 flex justify-end">
              <Button 
                variant="primary"
                leftIcon={<Play size={16} />}
                onClick={startSimulation}
              >
                Start Simulation
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RequirementsToBacklog;
