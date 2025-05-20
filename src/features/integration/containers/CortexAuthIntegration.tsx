import React from "react";
import { Button } from "@/components/design-system";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/design-system"; 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  AlertCircle, 
  Check, 
  ChevronRight, 
  Key, 
  Lock, 
  RefreshCw, 
  Shield, 
  User, 
  UserPlus, 
  Users 
} from "lucide-react";

const CortexAuthIntegration: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Authentication & Authorization</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" leftIcon={<RefreshCw size={16} />}>
            Test Connection
          </Button>
          <Button variant="primary" leftIcon={<Check size={16} />}>
            Save Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sso" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="sso">Single Sign-On</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sso" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SSO Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Authentication Provider</Label>
                  <Select defaultValue="azure">
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="azure">Azure AD</SelectItem>
                      <SelectItem value="okta">Okta</SelectItem>
                      <SelectItem value="auth0">Auth0</SelectItem>
                      <SelectItem value="custom">Custom OIDC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Connection Status</Label>
                  <div className="flex items-center gap-2 h-10 px-3 border rounded-md bg-success/10 border-success text-success">
                    <Check size={16} />
                    <span>Connected & Verified</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Client ID</Label>
                  <Input value="8f4b7c9e-1d2a-4b3c-8d7e-5f6g7h8j9k0l" />
                </div>
                
                <div className="space-y-2">
                  <Label>Tenant ID</Label>
                  <Input value="dxc-cortex-prod" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Redirect URI</Label>
                  <Input value="https://app.cortex.dxc.com/auth/callback" />
                </div>
                
                <div className="space-y-2">
                  <Label>Logout URL</Label>
                  <Input value="https://app.cortex.dxc.com/auth/logout" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Client Secret</Label>
                <div className="flex gap-2">
                  <Input type="password" value="••••••••••••••••••••••••••••••" className="flex-grow" />
                  <Button variant="outline">Show</Button>
                  <Button variant="outline" leftIcon={<RefreshCw size={16} />}>Rotate</Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-0.5">
                  <Label>Enable SSO</Label>
                  <div className="text-sm text-muted-foreground">Allow users to sign in with corporate credentials</div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Force SSO</Label>
                  <div className="text-sm text-muted-foreground">Require all users to authenticate via SSO</div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-provision Users</Label>
                  <div className="text-sm text-muted-foreground">Automatically create user accounts on first login</div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Session Timeout</Label>
                  <div className="text-sm text-muted-foreground">Time in minutes before requiring re-authentication</div>
                </div>
                <div className="w-24">
                  <Input type="number" defaultValue="60" min="5" max="1440" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>JWT Token Lifetime</Label>
                  <div className="text-sm text-muted-foreground">Time in minutes before token expiration</div>
                </div>
                <div className="w-24">
                  <Input type="number" defaultValue="30" min="5" max="60" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="mt-6 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>User Directory</CardTitle>
              <Button variant="outline" leftIcon={<UserPlus size={16} />}>Add User</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">John Smith</TableCell>
                    <TableCell>john.smith@dxc.com</TableCell>
                    <TableCell>
                      <Badge variant="outline">Admin</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="success">Active</Badge>
                    </TableCell>
                    <TableCell>2 hours ago</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sarah Johnson</TableCell>
                    <TableCell>sarah.johnson@dxc.com</TableCell>
                    <TableCell>
                      <Badge variant="outline">Editor</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="success">Active</Badge>
                    </TableCell>
                    <TableCell>1 day ago</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Michael Chen</TableCell>
                    <TableCell>michael.chen@dxc.com</TableCell>
                    <TableCell>
                      <Badge variant="outline">Viewer</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="warning">Pending</Badge>
                    </TableCell>
                    <TableCell>Never</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Emma Wilson</TableCell>
                    <TableCell>emma.wilson@dxc.com</TableCell>
                    <TableCell>
                      <Badge variant="outline">Editor</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="error">Disabled</Badge>
                    </TableCell>
                    <TableCell>30 days ago</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Groups</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span className="font-medium">Administrators</span>
                  </div>
                  <Badge variant="outline">5 users</Badge>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span className="font-medium">Data Scientists</span>
                  </div>
                  <Badge variant="outline">12 users</Badge>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span className="font-medium">Engineers</span>
                  </div>
                  <Badge variant="outline">8 users</Badge>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span className="font-medium">Analysts</span>
                  </div>
                  <Badge variant="outline">15 users</Badge>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Roles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                  <div className="flex items-center gap-2">
                    <Shield size={16} />
                    <span className="font-medium">Admin</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Full system access</div>
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                  <div className="flex items-center gap-2">
                    <Shield size={16} />
                    <span className="font-medium">Editor</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Create and modify content</div>
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                  <div className="flex items-center gap-2">
                    <Shield size={16} />
                    <span className="font-medium">Viewer</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Read-only access</div>
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                  <div className="flex items-center gap-2">
                    <Shield size={16} />
                    <span className="font-medium">Guest</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Limited dashboard access</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="permissions" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Permission Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Editor</TableHead>
                    <TableHead>Viewer</TableHead>
                    <TableHead>Guest</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Digital Twins</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="success">Full</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="success">Edit</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="success">View</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="error">None</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Simulations</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="success">Full</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="success">Edit</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="success">View</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="error">None</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Reports</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="success">Full</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="success">Edit</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="success">View</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="success">View</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">User Management</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="success">Full</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="error">None</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="error">None</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="error">None</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">API Access</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="success">Full</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="success">Limited</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="warning">Read</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="error">None</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">System Settings</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="success">Full</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="error">None</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="error">None</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="error">None</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <div className="text-sm text-muted-foreground">Require 2FA for all admin users</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>IP Restrictions</Label>
                    <div className="text-sm text-muted-foreground">Limit access to specific IP ranges</div>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Audit Logging</Label>
                    <div className="text-sm text-muted-foreground">Track all user actions</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Password Policy</Label>
                    <div className="text-sm text-muted-foreground">Enforce strong password requirements</div>
                  </div>
                  <Select defaultValue="high">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Basic</SelectItem>
                      <SelectItem value="medium">Standard</SelectItem>
                      <SelectItem value="high">Strong</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>API Authentication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-md bg-muted/30 flex items-start gap-3">
                  <AlertCircle size={18} className="text-warning mt-0.5" />
                  <div>
                    <h4 className="font-medium">API Keys</h4>
                    <p className="text-sm text-muted-foreground">
                      API keys provide access to Cortex APIs. Treat them like passwords and do not share them.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Active API Keys</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-2">
                        <Key size={16} />
                        <span className="font-mono text-sm">cortex-prod-key-1</span>
                      </div>
                      <Badge variant="outline">Created 30 days ago</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-2">
                        <Key size={16} />
                        <span className="font-mono text-sm">cortex-dev-key-1</span>
                      </div>
                      <Badge variant="outline">Created 60 days ago</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between gap-2">
                  <Button variant="outline" className="w-full" leftIcon={<Key size={16} />}>
                    Generate New Key
                  </Button>
                  <Button variant="outline" className="w-full" leftIcon={<Lock size={16} />}>
                    Manage Keys
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CortexAuthIntegration;
