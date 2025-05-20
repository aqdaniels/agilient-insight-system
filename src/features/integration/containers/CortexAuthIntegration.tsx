
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/design-system";
import { UserCheck, Shield, Settings, RefreshCw, Clock, Check, X } from "lucide-react";

// Role mapping types
interface Role {
  id: string;
  name: string;
  description: string;
  source: "agilient" | "cortex";
}

interface RoleMapping {
  aglientRole: string;
  cortexRole: string;
  isActive: boolean;
}

const CortexAuthIntegration: React.FC = () => {
  const [ssoEnabled, setSsoEnabled] = useState(true);
  const [userSyncEnabled, setUserSyncEnabled] = useState(true);
  const [auditEnabled, setAuditEnabled] = useState(true);

  // Sample role data
  const aglientRoles: Role[] = [
    { id: "admin", name: "Administrator", description: "Full system access", source: "agilient" },
    { id: "manager", name: "Project Manager", description: "Manage projects and teams", source: "agilient" },
    { id: "analyst", name: "Business Analyst", description: "Configure and analyze scenarios", source: "agilient" },
    { id: "viewer", name: "Viewer", description: "Read-only access", source: "agilient" },
  ];

  const cortexRoles: Role[] = [
    { id: "cortex-admin", name: "Cortex Administrator", description: "Full Cortex access", source: "cortex" },
    { id: "cortex-author", name: "Twin Author", description: "Create and edit twins", source: "cortex" },
    { id: "cortex-analyst", name: "Data Analyst", description: "Analyze twin data", source: "cortex" },
    { id: "cortex-viewer", name: "Twin Viewer", description: "View-only access to twins", source: "cortex" },
  ];

  // Sample role mappings
  const [roleMappings, setRoleMappings] = useState<RoleMapping[]>([
    { aglientRole: "admin", cortexRole: "cortex-admin", isActive: true },
    { aglientRole: "manager", cortexRole: "cortex-author", isActive: true },
    { aglientRole: "analyst", cortexRole: "cortex-analyst", isActive: true },
    { aglientRole: "viewer", cortexRole: "cortex-viewer", isActive: true },
  ]);

  // Find role details by ID
  const getRoleDetails = (id: string): Role | undefined => {
    return [...aglientRoles, ...cortexRoles].find(role => role.id === id);
  };

  // Toggle mapping status
  const toggleMappingStatus = (aglientRole: string, cortexRole: string) => {
    setRoleMappings(prev => 
      prev.map(mapping => 
        mapping.aglientRole === aglientRole && mapping.cortexRole === cortexRole
          ? { ...mapping, isActive: !mapping.isActive }
          : mapping
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Authentication Integration</h2>
        <Button 
          variant="primary" 
          leftIcon={<RefreshCw size={16} />}
        >
          Sync Authentication Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <UserCheck size={18} />
              <span>SSO Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Enable Single Sign-On</Label>
              <Switch checked={ssoEnabled} onCheckedChange={setSsoEnabled} />
            </div>
            <div className="space-y-2">
              <Label>Identity Provider</Label>
              <Select defaultValue="azure">
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="azure">Azure AD</SelectItem>
                  <SelectItem value="okta">Okta</SelectItem>
                  <SelectItem value="google">Google Workspace</SelectItem>
                  <SelectItem value="auth0">Auth0</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>SSO Login URL</Label>
              <Input 
                value="https://login.microsoftonline.com/tenant-id/oauth2/v2.0/authorize" 
                onChange={() => {}}
              />
            </div>
            <div className="space-y-2">
              <Label>Logout URL</Label>
              <Input 
                value="https://login.microsoftonline.com/tenant-id/oauth2/v2.0/logout" 
                onChange={() => {}}
              />
            </div>
            <Button className="w-full" variant="outline">
              Test SSO Connection
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Shield size={18} />
              <span>Permission Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Default Role for New Users</Label>
              <Select defaultValue="viewer">
                <SelectTrigger>
                  <SelectValue placeholder="Select default role" />
                </SelectTrigger>
                <SelectContent>
                  {aglientRoles.map(role => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-between items-center">
              <Label>Enable Permission Inheritance</Label>
              <Switch defaultChecked />
            </div>
            
            <div className="flex justify-between items-center">
              <Label>Auto-provision New Users</Label>
              <Switch defaultChecked />
            </div>
            
            <div className="flex justify-between items-center">
              <Label>Require Email Verification</Label>
              <Switch defaultChecked />
            </div>
            
            <div className="pt-2">
              <Button className="w-full" variant="outline">
                Advanced Permission Settings
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Settings size={18} />
              <span>Sync Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <Label>User Synchronization</Label>
                <p className="text-sm text-muted-foreground">Sync users between systems</p>
              </div>
              <Switch checked={userSyncEnabled} onCheckedChange={setUserSyncEnabled} />
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <Label>Audit Logging</Label>
                <p className="text-sm text-muted-foreground">Track authentication events</p>
              </div>
              <Switch checked={auditEnabled} onCheckedChange={setAuditEnabled} />
            </div>
            
            <div className="space-y-2">
              <Label>Sync Frequency</Label>
              <Select defaultValue="6h">
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Every hour</SelectItem>
                  <SelectItem value="6h">Every 6 hours</SelectItem>
                  <SelectItem value="12h">Every 12 hours</SelectItem>
                  <SelectItem value="24h">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-muted/30 p-3 rounded-md flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-muted-foreground" />
                <div className="text-sm">Last sync completed</div>
              </div>
              <div className="font-medium">Today, 10:42 AM</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Role Mapping Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Agilient Role</TableHead>
                <TableHead className="w-[200px]">Cortex Role</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[80px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roleMappings.map((mapping) => {
                const aglientRole = getRoleDetails(mapping.aglientRole);
                const cortexRole = getRoleDetails(mapping.cortexRole);
                
                return (
                  <TableRow key={`${mapping.aglientRole}-${mapping.cortexRole}`}>
                    <TableCell>
                      <Badge variant="secondary">{aglientRole?.name || mapping.aglientRole}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{cortexRole?.name || mapping.cortexRole}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {aglientRole?.description} → {cortexRole?.description}
                    </TableCell>
                    <TableCell>
                      {mapping.isActive ? (
                        <Badge variant="success" className="inline-flex items-center gap-1">
                          <Check size={12} />
                          <span>Active</span>
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="inline-flex items-center gap-1">
                          <X size={12} />
                          <span>Disabled</span>
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleMappingStatus(mapping.aglientRole, mapping.cortexRole)}
                      >
                        {mapping.isActive ? "Disable" : "Enable"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="flex justify-end mt-4">
            <Button variant="outline">Add New Mapping</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Authentication Audit Log</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center bg-muted/30 rounded-md">
          <div className="text-center">
            <Shield className="h-10 w-10 mx-auto text-muted-foreground" />
            <p className="mt-2">Authentication audit log will appear here</p>
            <p className="text-sm text-muted-foreground">Tracking login attempts, permission changes, and system access</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CortexAuthIntegration;
