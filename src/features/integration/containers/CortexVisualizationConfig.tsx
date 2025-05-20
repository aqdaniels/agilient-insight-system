import React, { useState } from "react";
import { Button } from "@/components/design-system";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { 
  LayoutDashboard,
  Layers,
  Eye,
  Palette,
  Code,
  Copy,
  Check,
  Plus,
  X
} from "lucide-react";

interface TemplateCard {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  category: string;
}

const CortexVisualizationConfig: React.FC = () => {
  const [themeSyncEnabled, setThemeSyncEnabled] = useState(true);
  const [embedCode, setEmbedCode] = useState('<iframe src="https://cortex.dxc.com/embed/agilient/dashboard/1" width="100%" height="500" frameborder="0"></iframe>');
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  // Template library data
  const templates: TemplateCard[] = [
    {
      id: "project-dashboard",
      name: "Project Dashboard",
      description: "Overview of project metrics and KPIs",
      category: "dashboard"
    },
    {
      id: "team-performance",
      name: "Team Performance",
      description: "Team velocity and productivity metrics",
      category: "dashboard"
    },
    {
      id: "risk-matrix",
      name: "Risk Matrix Visualization",
      description: "Interactive risk assessment visualization",
      category: "widget"
    },
    {
      id: "backlog-analyzer",
      name: "Backlog Analyzer",
      description: "Visualization of backlog items with priority indicators",
      category: "widget"
    },
    {
      id: "genai-impact",
      name: "GenAI Impact Analysis",
      description: "Shows impact of AI tools on development metrics",
      category: "dashboard"
    },
    {
      id: "timeline-view",
      name: "Project Timeline",
      description: "Gantt chart view of project milestones",
      category: "widget"
    }
  ];
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Visualization Integration</h2>
        <div className="flex items-center gap-3">
          <Button variant="outline" leftIcon={<Eye size={16} />}>
            Preview Embedded Views
          </Button>
          <Button variant="primary" leftIcon={<Layers size={16} />}>
            Publish Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <LayoutDashboard size={18} />
              <span>Embeddable View Generator</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>View Type</Label>
              <Select defaultValue="dashboard">
                <SelectTrigger>
                  <SelectValue placeholder="Select view type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dashboard">Full Dashboard</SelectItem>
                  <SelectItem value="widget">Single Widget</SelectItem>
                  <SelectItem value="report">Report</SelectItem>
                  <SelectItem value="custom">Custom View</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Source Content</Label>
              <Select defaultValue="simulation">
                <SelectTrigger>
                  <SelectValue placeholder="Select content source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simulation">Simulation Results</SelectItem>
                  <SelectItem value="team">Team Analytics</SelectItem>
                  <SelectItem value="genai">GenAI Accelerators</SelectItem>
                  <SelectItem value="backlog">Backlog Items</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Embed Size</Label>
                <span className="text-sm text-muted-foreground">800 x 500</span>
              </div>
              <div className="flex gap-2">
                <Input type="number" placeholder="Width" defaultValue="800" className="w-1/2" />
                <Input type="number" placeholder="Height" defaultValue="500" className="w-1/2" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Auto Refresh</Label>
                <Switch defaultChecked />
              </div>
              <Select defaultValue="5m">
                <SelectTrigger>
                  <SelectValue placeholder="Select refresh interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">Every minute</SelectItem>
                  <SelectItem value="5m">Every 5 minutes</SelectItem>
                  <SelectItem value="15m">Every 15 minutes</SelectItem>
                  <SelectItem value="30m">Every 30 minutes</SelectItem>
                  <SelectItem value="1h">Every hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-2">
              <Button className="w-full">Generate Embed Code</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Code size={18} />
              <span>Embed Code</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              value={embedCode}
              onChange={(e) => setEmbedCode(e.target.value)}
              className="font-mono text-sm h-[180px]"
            />
            
            <div className="flex justify-between">
              <Button variant="outline" leftIcon={<Check size={16} />}>
                Validate
              </Button>
              <Button 
                variant="outline" 
                leftIcon={copiedCode ? <Check size={16} /> : <Copy size={16} />}
                onClick={handleCopyCode}
              >
                {copiedCode ? "Copied!" : "Copy Code"}
              </Button>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-md text-sm">
              <h4 className="font-medium mb-1">Integration Instructions:</h4>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Copy the embed code above</li>
                <li>Paste it into your Cortex Digital Twin portal</li>
                <li>Adjust sizing parameters as needed</li>
                <li>Save changes in your portal</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="templates">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Layout Templates</TabsTrigger>
          <TabsTrigger value="theme">Theme Synchronization</TabsTrigger>
          <TabsTrigger value="custom">Custom Styling</TabsTrigger>
        </TabsList>
        
        <Card className="mt-6 border-t-0 rounded-t-none">
          <CardContent className="pt-6">
            <TabsContent value="templates" className="mt-0 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Template Library</h3>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter templates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Templates</SelectItem>
                    <SelectItem value="dashboard">Dashboards</SelectItem>
                    <SelectItem value="widget">Widgets</SelectItem>
                    <SelectItem value="custom">Custom Views</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer transition-all hover:border-primary ${
                      selectedTemplate === template.id ? 'border-primary ring-1 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardContent className="p-4">
                      <div className="h-32 bg-muted/30 rounded-md mb-3 flex items-center justify-center">
                        <LayoutDashboard size={24} className="text-muted-foreground" />
                      </div>
                      <h4 className="font-medium mb-1">{template.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-muted/50 py-1 px-2 rounded-full">{template.category}</span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">Preview</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[700px]">
                            <DialogHeader>
                              <DialogTitle>{template.name}</DialogTitle>
                              <DialogDescription>{template.description}</DialogDescription>
                            </DialogHeader>
                            <div className="h-[400px] bg-muted/30 rounded-md flex items-center justify-center">
                              <p className="text-muted-foreground">Template preview</p>
                            </div>
                            <DialogFooter>
                              <Button variant="outline">Cancel</Button>
                              <Button>Use This Template</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Add new template card */}
                <Card className="border-dashed cursor-pointer hover:border-primary">
                  <CardContent className="p-4 h-full flex flex-col items-center justify-center text-center">
                    <div className="h-20 w-20 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                      <Plus size={24} className="text-muted-foreground" />
                    </div>
                    <h4 className="font-medium mb-1">Create Custom Template</h4>
                    <p className="text-sm text-muted-foreground">Build a new visualization layout</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-end">
                <Button disabled={!selectedTemplate} variant="primary">
                  Apply Selected Template
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="theme" className="mt-0">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">Theme Synchronization</h3>
                    <p className="text-sm text-muted-foreground">Keep visual styling consistent between systems</p>
                  </div>
                  <Switch checked={themeSyncEnabled} onCheckedChange={setThemeSyncEnabled} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Agilient Theme</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <Label className="text-sm">Primary Color</Label>
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 rounded-md bg-primary"></div>
                          <Input defaultValue="#8B5CF6" className="font-mono" />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label className="text-sm">Secondary Color</Label>
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 rounded-md bg-secondary"></div>
                          <Input defaultValue="#D946EF" className="font-mono" />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label className="text-sm">Font Family</Label>
                        <Select defaultValue="inter">
                          <SelectTrigger>
                            <SelectValue placeholder="Select font" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inter">Inter</SelectItem>
                            <SelectItem value="roboto">Roboto</SelectItem>
                            <SelectItem value="opensans">Open Sans</SelectItem>
                            <SelectItem value="system">System Default</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Cortex Theme</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <Label className="text-sm">Primary Color</Label>
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 rounded-md bg-blue-600"></div>
                          <Input defaultValue="#2563EB" className="font-mono" />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label className="text-sm">Secondary Color</Label>
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 rounded-md bg-sky-500"></div>
                          <Input defaultValue="#0EA5E9" className="font-mono" />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label className="text-sm">Font Family</Label>
                        <Select defaultValue="arial">
                          <SelectTrigger>
                            <SelectValue placeholder="Select font" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="arial">Arial</SelectItem>
                            <SelectItem value="helvetica">Helvetica</SelectItem>
                            <SelectItem value="verdana">Verdana</SelectItem>
                            <SelectItem value="system">System Default</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Palette size={18} />
                      <span>Theme Preview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/30 rounded-md h-[200px] flex items-center justify-center">
                      <div className="text-center">
                        <p>Theme preview will appear here</p>
                        <p className="text-sm text-muted-foreground">Showing how your styles will appear in Cortex</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-end gap-3">
                  <Button variant="outline">Reset to Default</Button>
                  <Button variant="primary">Apply Theme Changes</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="mt-0">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Custom CSS Injection</h3>
                  <DrawerTrigger asChild>
                    <Button variant="outline" size="sm">View Guide</Button>
                  </DrawerTrigger>
                  <Drawer>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Custom CSS Guide</DrawerTitle>
                        <DrawerDescription>
                          Guidelines for creating custom styling for Cortex integration
                        </DrawerDescription>
                      </DrawerHeader>
                      <div className="px-4">
                        <div className="space-y-4">
                          <h4 className="font-medium">Best Practices</h4>
                          <ul className="list-disc list-inside space-y-2">
                            <li>Use specific selectors to avoid style conflicts</li>
                            <li>Test thoroughly on both systems before deploying</li>
                            <li>Keep CSS modifications minimal and focused</li>
                            <li>Document your changes for future reference</li>
                          </ul>
                          
                          <h4 className="font-medium">Example Patterns</h4>
                          <pre className="bg-muted p-4 rounded-md text-xs font-mono overflow-x-auto">
                            {`.cortex-container .my-chart { /* styles */ }\n.agilient-widget { /* styles */ }`}
                          </pre>
                          
                          <h4 className="font-medium">Common Scenarios</h4>
                          <ul className="list-disc list-inside space-y-2">
                            <li>Adjusting chart colors and dimensions</li>
                            <li>Customizing container styles</li>
                            <li>Modifying text appearance</li>
                            <li>Changing layout behavior</li>
                          </ul>
                        </div>
                      </div>
                      <DrawerFooter>
                        <DrawerClose asChild>
                          <Button variant="outline">Close Guide</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                </div>
                
                <Textarea 
                  placeholder="/* Enter your custom CSS here */&#10;&#10;.cortex-widget {&#10;  border-radius: 8px;&#10;  box-shadow: 0 2px 8px rgba(0,0,0,0.1);&#10;}&#10;&#10;.cortex-chart text {&#10;  font-family: inherit;&#10;}"
                  className="font-mono text-sm h-[300px]"
                />
                
                <div className="flex justify-between">
                  <Button variant="outline" leftIcon={<X size={16} />}>
                    Clear CSS
                  </Button>
                  <div className="space-x-3">
                    <Button variant="outline">Preview Changes</Button>
                    <Button variant="primary">Apply Custom CSS</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Integration Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center bg-muted/30 rounded-md">
            <div className="text-center">
              <LayoutDashboard className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="mt-2">Visualization integration health metrics will appear here</p>
              <p className="text-sm text-muted-foreground">Tracking load times, refresh rates, and rendering performance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CortexVisualizationConfig;
