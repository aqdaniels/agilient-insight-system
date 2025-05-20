
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/design-system";
import CortexTwinConnector from "./CortexTwinConnector";
import CortexApiManager from "./CortexApiManager";
import CortexAuthIntegration from "./CortexAuthIntegration";
import CortexVisualizationConfig from "./CortexVisualizationConfig";
import { Database, Link2, UserCheck, LayoutDashboard } from "lucide-react";

const CortexIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState("twin-config");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">DXC Cortex Integration</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline">Documentation</Button>
          <Button variant="primary">Save Configuration</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="twin-config" className="flex items-center gap-2">
            <Database size={16} />
            <span>Digital Twin</span>
          </TabsTrigger>
          <TabsTrigger value="api-manager" className="flex items-center gap-2">
            <Link2 size={16} />
            <span>API Connection</span>
          </TabsTrigger>
          <TabsTrigger value="auth-integration" className="flex items-center gap-2">
            <UserCheck size={16} />
            <span>Authentication</span>
          </TabsTrigger>
          <TabsTrigger value="visualization" className="flex items-center gap-2">
            <LayoutDashboard size={16} />
            <span>Visualization</span>
          </TabsTrigger>
        </TabsList>

        <Card className="mt-6 border-t-0 rounded-t-none">
          <CardContent className="pt-6">
            <TabsContent value="twin-config" className="mt-0">
              <CortexTwinConnector />
            </TabsContent>
            <TabsContent value="api-manager" className="mt-0">
              <CortexApiManager />
            </TabsContent>
            <TabsContent value="auth-integration" className="mt-0">
              <CortexAuthIntegration />
            </TabsContent>
            <TabsContent value="visualization" className="mt-0">
              <CortexVisualizationConfig />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default CortexIntegration;
