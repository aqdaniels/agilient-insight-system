
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/design-system";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, FileDown, Settings, Search } from "lucide-react";

// Types
interface JiraProject {
  id: string;
  key: string;
  name: string;
  description?: string;
  issueCount: number;
  lastSynced?: string;
}

// Mock API call
const fetchJiraProjects = async (): Promise<JiraProject[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: "10001",
      key: "PROJ",
      name: "Project Alpha",
      description: "Mobile application development project",
      issueCount: 126,
      lastSynced: "2025-05-15T09:30:00Z"
    },
    {
      id: "10002",
      key: "INFRA",
      name: "Infrastructure Updates",
      description: "Cloud migration initiative",
      issueCount: 89,
      lastSynced: "2025-05-14T14:45:00Z"
    },
    {
      id: "10003",
      key: "MOB",
      name: "Mobile Revamp",
      description: "Mobile application redesign",
      issueCount: 65,
    },
    {
      id: "10004",
      key: "PORT",
      name: "Portfolio Dashboard",
      description: "Executive reporting system",
      issueCount: 42,
    }
  ];
};

const JiraIntegrator: React.FC = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>("10001");
  
  const { data: jiraProjects, isLoading, error } = useQuery({
    queryKey: ['jiraProjects'],
    queryFn: fetchJiraProjects,
    enabled: isConnected
  });
  
  const [connectionSettings, setConnectionSettings] = useState({
    jiraInstance: "company.atlassian.net",
    apiToken: "••••••••••••••••",
    username: "admin@company.com"
  });

  const handleConnect = () => {
    // Implementation would connect to Jira
    console.log("Connecting to Jira");
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    // Implementation would disconnect from Jira
    console.log("Disconnecting from Jira");
    setIsConnected(false);
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConnectionSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSettings = () => {
    console.log("Saving connection settings", connectionSettings);
    setIsConfiguring(false);
  };
  
  const handleImportBacklog = () => {
    console.log("Importing backlog from", selectedProject);
    // Implementation would import the backlog
  };

  // Filter projects based on search query
  const filteredProjects = jiraProjects?.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Jira Integration</h2>
        </div>
        
        <div className="border rounded-lg p-8 bg-card text-center">
          <h3 className="text-lg font-medium mb-6">Connect to Jira</h3>
          <div className="space-y-4 max-w-md mx-auto">
            <div>
              <label className="block text-sm font-medium mb-1 text-left">Jira Instance</label>
              <input
                type="text"
                name="jiraInstance"
                value={connectionSettings.jiraInstance}
                onChange={handleSettingsChange}
                className="w-full border border-input rounded-md bg-transparent px-3 py-2 text-sm"
                placeholder="your-company.atlassian.net"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-left">API Token</label>
              <input
                type="password"
                name="apiToken"
                value={connectionSettings.apiToken}
                onChange={handleSettingsChange}
                className="w-full border border-input rounded-md bg-transparent px-3 py-2 text-sm"
                placeholder="Enter your API token"
              />
              <p className="text-xs text-muted-foreground mt-1 text-left">
                Create a token in your Jira account settings
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-left">Username/Email</label>
              <input
                type="text"
                name="username"
                value={connectionSettings.username}
                onChange={handleSettingsChange}
                className="w-full border border-input rounded-md bg-transparent px-3 py-2 text-sm"
                placeholder="your.email@company.com"
              />
            </div>
            <Button 
              variant="primary" 
              onClick={handleConnect}
              className="w-full mt-2"
            >
              Connect to Jira
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Jira Integration</h2>
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-error">Error loading Jira projects: {error.toString()}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Jira Integration</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsConfiguring(!isConfiguring)}
            leftIcon={<Settings size={16} />}
          >
            {isConfiguring ? "Hide Settings" : "Settings"}
          </Button>
          <Button
            variant="primary"
            onClick={handleImportBacklog}
            leftIcon={<FileDown size={16} />}
            disabled={!selectedProject}
          >
            Import Backlog
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-success/10 border-success/30 border rounded-md">
        <Check className="text-success" size={24} />
        <div>
          <h3 className="font-medium">Connected to Jira</h3>
          <p className="text-sm text-muted-foreground">
            Instance: {connectionSettings.jiraInstance} | User: {connectionSettings.username}
          </p>
        </div>
      </div>

      {isConfiguring && (
        <div className="border rounded-lg p-4 bg-card">
          <h3 className="font-medium text-lg mb-4">Connection Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Jira Instance</label>
              <input
                type="text"
                name="jiraInstance"
                value={connectionSettings.jiraInstance}
                onChange={handleSettingsChange}
                className="w-full border border-input rounded-md bg-transparent px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">API Token</label>
              <input
                type="password"
                name="apiToken"
                value={connectionSettings.apiToken}
                onChange={handleSettingsChange}
                className="w-full border border-input rounded-md bg-transparent px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Username/Email</label>
              <input
                type="text"
                name="username"
                value={connectionSettings.username}
                onChange={handleSettingsChange}
                className="w-full border border-input rounded-md bg-transparent px-3 py-2 text-sm"
              />
            </div>
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setIsConfiguring(false)}
              >
                Cancel
              </Button>
              <div className="space-x-2">
                <Button
                  variant="destructive"
                  onClick={handleDisconnect}
                >
                  Disconnect
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveSettings}
                >
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
        <input
          type="text"
          placeholder="Search projects..."
          className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="border rounded-lg bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Select</th>
                <th className="px-4 py-3">Key</th>
                <th className="px-4 py-3">Project Name</th>
                <th className="px-4 py-3">Issues</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects?.map((project) => (
                <tr 
                  key={project.id} 
                  className={`border-t border-border hover:bg-muted/30 ${
                    selectedProject === project.id ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedProject(project.id)}
                >
                  <td className="px-4 py-3">
                    <input
                      type="radio"
                      checked={selectedProject === project.id}
                      onChange={() => setSelectedProject(project.id)}
                      className="rounded-full border-input bg-transparent h-4 w-4 accent-primary"
                    />
                  </td>
                  <td className="px-4 py-3 font-mono">{project.key}</td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{project.name}</div>
                      {project.description && (
                        <div className="text-xs text-muted-foreground">{project.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">{project.issueCount}</td>
                  <td className="px-4 py-3">
                    {project.lastSynced ? (
                      <span className="text-success flex items-center gap-1">
                        <Check size={14} />
                        <span>Synced {new Date(project.lastSynced).toLocaleDateString()}</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Not imported</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredProjects?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                    No projects match your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProject && (
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={handleImportBacklog}
            leftIcon={<FileDown size={16} />}
          >
            Import Selected Project Backlog
          </Button>
        </div>
      )}
    </div>
  );
};

export default JiraIntegrator;
