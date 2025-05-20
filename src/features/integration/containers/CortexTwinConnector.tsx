
import React, { useState } from "react";
import { Button } from "@/components/design-system";
import { Settings, Link2, Check } from "lucide-react";

const CortexTwinConnector: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [connectionSettings, setConnectionSettings] = useState({
    apiEndpoint: "https://cortex-api.dxc.com/twin",
    apiKey: "",
    projectId: "",
    syncInterval: "daily"
  });

  const handleConnect = () => {
    // Implementation would connect to DXC Cortex Digital Twin
    console.log("Connecting to DXC Cortex Digital Twin");
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    // Implementation would disconnect from DXC Cortex Digital Twin
    console.log("Disconnecting from DXC Cortex Digital Twin");
    setIsConnected(false);
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">DXC Cortex Digital Twin Integration</h2>
        {isConnected && (
          <Button
            variant="outline"
            onClick={() => setIsConfiguring(!isConfiguring)}
            leftIcon={<Settings size={16} />}
          >
            {isConfiguring ? "Hide Settings" : "Configure"}
          </Button>
        )}
      </div>

      {isConnected ? (
        <>
          <div className="flex items-center gap-3 p-4 bg-success/10 border-success/30 border rounded-md">
            <Check className="text-success" size={24} />
            <div>
              <h3 className="font-medium">Connected to DXC Cortex Digital Twin</h3>
              <p className="text-sm text-muted-foreground">
                Live synchronization active - Last updated: {new Date().toLocaleString()}
              </p>
            </div>
          </div>

          {isConfiguring ? (
            <div className="border rounded-lg p-4 bg-card">
              <h3 className="font-medium text-lg mb-4">Connection Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">API Endpoint</label>
                  <input
                    type="text"
                    name="apiEndpoint"
                    value={connectionSettings.apiEndpoint}
                    onChange={handleSettingsChange}
                    className="w-full border border-input rounded-md bg-transparent px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">API Key</label>
                  <input
                    type="password"
                    name="apiKey"
                    value={connectionSettings.apiKey}
                    onChange={handleSettingsChange}
                    placeholder="••••••••••••••••"
                    className="w-full border border-input rounded-md bg-transparent px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Project ID</label>
                  <input
                    type="text"
                    name="projectId"
                    value={connectionSettings.projectId}
                    onChange={handleSettingsChange}
                    className="w-full border border-input rounded-md bg-transparent px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sync Schedule</label>
                  <select
                    name="syncInterval"
                    value={connectionSettings.syncInterval}
                    onChange={handleSettingsChange}
                    className="w-full border border-input rounded-md bg-transparent px-3 py-2 text-sm"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="manual">Manual Only</option>
                  </select>
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4 bg-card">
                <h3 className="font-medium text-lg mb-4">Digital Twin Data</h3>
                <div className="space-y-4">
                  <div className="bg-muted/30 p-3 rounded-md">
                    <div className="text-xs text-muted-foreground">Project Models</div>
                    <div className="text-xl font-bold">4</div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-md">
                    <div className="text-xs text-muted-foreground">Historical Datasets</div>
                    <div className="text-xl font-bold">12</div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-md">
                    <div className="text-xs text-muted-foreground">Available Templates</div>
                    <div className="text-xl font-bold">7</div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-card">
                <h3 className="font-medium text-lg mb-4">Synchronized Data</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm pb-2 border-b border-border">
                    <Check size={16} className="text-success" />
                    <span>Historical Velocity Data</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm pb-2 border-b border-border">
                    <Check size={16} className="text-success" />
                    <span>Resource Allocation Templates</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm pb-2 border-b border-border">
                    <Check size={16} className="text-success" />
                    <span>Risk Factor Models</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check size={16} className="text-success" />
                    <span>Cost Performance Benchmarks</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    Manually Sync Data
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="border rounded-lg p-8 bg-card text-center">
          <div className="mb-4">
            <Link2 className="mx-auto text-primary" size={48} />
          </div>
          <h3 className="text-lg font-medium mb-2">Connect to DXC Cortex Digital Twin</h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Enhance your delivery simulations with historical data and advanced models from DXC Cortex Digital Twin.
            Connect your instance to enable AI-powered predictive capabilities.
          </p>
          <div className="space-y-4 max-w-md mx-auto">
            <div>
              <label className="block text-sm font-medium mb-1 text-left">API Endpoint</label>
              <input
                type="text"
                name="apiEndpoint"
                value={connectionSettings.apiEndpoint}
                onChange={handleSettingsChange}
                className="w-full border border-input rounded-md bg-transparent px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-left">API Key</label>
              <input
                type="password"
                name="apiKey"
                value={connectionSettings.apiKey}
                onChange={handleSettingsChange}
                placeholder="Enter your API key"
                className="w-full border border-input rounded-md bg-transparent px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-left">Project ID</label>
              <input
                type="text"
                name="projectId"
                value={connectionSettings.projectId}
                onChange={handleSettingsChange}
                placeholder="Enter your project ID"
                className="w-full border border-input rounded-md bg-transparent px-3 py-2 text-sm"
              />
            </div>
            <Button 
              variant="primary" 
              onClick={handleConnect}
              className="w-full mt-2"
              disabled={!connectionSettings.apiKey || !connectionSettings.projectId}
            >
              Connect
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CortexTwinConnector;
