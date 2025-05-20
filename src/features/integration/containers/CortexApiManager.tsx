
import React, { useState } from "react";
import { Button } from "@/components/design-system";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { StatusIndicator } from "@/components/design-system";
import { Check, Link, Link2, RefreshCw, Settings, Calendar, Info } from "lucide-react";

interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  method: string;
  status: "online" | "offline" | "warning";
  lastCheck: string;
  responseTime: number;
}

const CortexApiManager: React.FC = () => {
  const [environment, setEnvironment] = useState("production");
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [loggingEnabled, setLoggingEnabled] = useState(true);
  const [throttlingEnabled, setThrottlingEnabled] = useState(true);
  
  // Sample API endpoints data
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([
    {
      id: "twin-api",
      name: "Twin Management API",
      url: "https://cortex-api.dxc.com/twin",
      method: "GET",
      status: "online",
      lastCheck: "2025-05-20T10:15:00Z",
      responseTime: 234
    },
    {
      id: "scenario-api",
      name: "Scenario Modeling API",
      url: "https://cortex-api.dxc.com/scenarios",
      method: "POST",
      status: "online",
      lastCheck: "2025-05-20T10:14:30Z",
      responseTime: 187
    },
    {
      id: "data-api",
      name: "Data Ingestion API",
      url: "https://cortex-api.dxc.com/data",
      method: "PUT",
      status: "warning",
      lastCheck: "2025-05-20T10:12:45Z",
      responseTime: 543
    },
    {
      id: "reporting-api",
      name: "Reporting API",
      url: "https://cortex-api.dxc.com/reports",
      method: "GET",
      status: "offline",
      lastCheck: "2025-05-20T09:45:12Z",
      responseTime: 0
    }
  ]);

  const handleTestConnection = () => {
    setIsTestingConnection(true);
    // Simulate API connection test
    setTimeout(() => {
      setIsTestingConnection(false);
      // Refresh status of endpoints after testing
      setEndpoints(prev => 
        prev.map(endpoint => ({
          ...endpoint,
          status: Math.random() > 0.2 ? "online" : "warning",
          lastCheck: new Date().toISOString(),
          responseTime: Math.floor(Math.random() * 400) + 100
        }))
      );
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">API Connection Manager</h2>
        <Button 
          variant="primary" 
          onClick={handleTestConnection} 
          isLoading={isTestingConnection}
          leftIcon={<RefreshCw size={16} />}
        >
          Test All Connections
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Environment</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={environment} onValueChange={setEnvironment}>
              <SelectTrigger>
                <SelectValue placeholder="Select environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="production">Production</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Base URL</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Input 
              value="https://cortex-api.dxc.com" 
              onChange={() => {}}
              className="flex-grow"
            />
            <Button variant="outline" size="icon">
              <Settings size={16} />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">API Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Success Rate</div>
                <div className="text-xl font-bold text-success">98.2%</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Avg Response</div>
                <div className="text-xl font-bold">241ms</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Endpoint Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">URL</th>
                  <th className="text-left px-4 py-3">Method</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Last Check</th>
                  <th className="text-left px-4 py-3">Response Time</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {endpoints.map((endpoint) => (
                  <tr key={endpoint.id} className="border-b border-border">
                    <td className="px-4 py-3">{endpoint.name}</td>
                    <td className="px-4 py-3 font-mono text-xs">{endpoint.url}</td>
                    <td className="px-4 py-3">
                      <span className={`
                        rounded px-2 py-1 text-xs font-medium
                        ${endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : ''}
                        ${endpoint.method === 'POST' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                        ${endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : ''}
                        ${endpoint.method === 'DELETE' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : ''}
                      `}>
                        {endpoint.method}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusIndicator 
                        status={endpoint.status === "online" ? "success" : 
                               endpoint.status === "warning" ? "warning" : "error"} 
                        label={endpoint.status === "online" ? "Online" : 
                               endpoint.status === "warning" ? "Degraded" : "Offline"}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(endpoint.lastCheck).toLocaleTimeString()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {endpoint.status !== "offline" ? `${endpoint.responseTime}ms` : "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Link size={14} className="mr-1" />
                          Test
                        </Button>
                        <Button variant="outline" size="sm">
                          <Info size={14} className="mr-1" />
                          Logs
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>API Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <Label>Request/Response Logging</Label>
                <p className="text-sm text-muted-foreground">Store API communication history</p>
              </div>
              <Switch checked={loggingEnabled} onCheckedChange={setLoggingEnabled} />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <Label>Traffic Throttling</Label>
                <p className="text-sm text-muted-foreground">Rate limit API requests</p>
              </div>
              <Switch checked={throttlingEnabled} onCheckedChange={setThrottlingEnabled} />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <Label>Request Timeout</Label>
                <p className="text-sm text-muted-foreground">Maximum wait time for responses</p>
              </div>
              <div className="w-24">
                <Input type="number" value="30" min="1" max="120" className="text-right" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>API Key Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>API Key</Label>
              <div className="relative">
                <Input type="password" value="••••••••••••••••••••••••••••••" readOnly />
                <Button variant="ghost" size="sm" className="absolute right-1 top-1">
                  Show
                </Button>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last rotated:</span>
              <span>April 12, 2025</span>
            </div>
            <div className="flex justify-between gap-2">
              <Button variant="outline" className="w-1/2">Generate New Key</Button>
              <Button variant="outline" className="w-1/2">Manage Permissions</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>API Traffic Visualization</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center bg-muted/30 rounded-md">
          <div className="text-center">
            <BarChart className="h-10 w-10 mx-auto text-muted-foreground" />
            <p className="mt-2">API traffic visualization will appear here</p>
            <p className="text-sm text-muted-foreground">Showing request volume, success rates, and response times</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CortexApiManager;
