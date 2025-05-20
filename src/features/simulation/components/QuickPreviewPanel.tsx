
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimulationScenario } from "../types";
import { Badge, StatusIndicator } from "@/components/design-system";
import { AlertTriangle, CheckCircle, Clock, Hash, BarChart3 } from "lucide-react";

interface QuickPreviewPanelProps {
  scenario: SimulationScenario;
}

const QuickPreviewPanel: React.FC<QuickPreviewPanelProps> = ({
  scenario,
}) => {
  const validationResults = useMemo(() => {
    // These would be actual calculated values in a real app
    return {
      configurationStatus: scenario.name ? "complete" : "incomplete",
      teamConfigStatus: "valid",
      processConfigStatus: "valid",
      validationWarnings: scenario.name ? [] : ["Scenario name is required"],
      estimationQuality: 0.85,
      expectedDuration: calculateExpectedDuration(),
      confidenceLevel: scenario.simulationParameters.confidenceInterval,
    };
  }, [scenario]);

  function calculateExpectedDuration() {
    // Mock calculation - would be more complex in real app
    const baseVelocity = scenario.teamConfiguration.averageVelocity;
    const totalStoryPoints = scenario.backlogConfiguration.totalStoryPoints;
    const sprintsNeeded = Math.ceil(totalStoryPoints / baseVelocity);
    
    // Apply AI boost if configured
    let aiBoost = 1;
    if (scenario.genAIConfiguration.accelerators.length > 0) {
      aiBoost = 1 - (0.1 * scenario.genAIConfiguration.accelerators.length);
    }
    
    return Math.ceil(sprintsNeeded * scenario.processParameters.sprintLength * aiBoost);
  }

  const getQualityColor = (quality: number) => {
    if (quality >= 0.8) return "success";
    if (quality >= 0.6) return "warning";
    return "error";
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Parameter Summary</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Key Metrics</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-muted/30 p-2 rounded-md">
                <div className="text-xs text-muted-foreground">Team Size</div>
                <div className="font-medium flex items-center">
                  <Hash size={14} className="mr-1 text-muted-foreground" />
                  {scenario.teamConfiguration.teamSize}
                </div>
              </div>
              
              <div className="bg-muted/30 p-2 rounded-md">
                <div className="text-xs text-muted-foreground">Sprint Length</div>
                <div className="font-medium flex items-center">
                  <Clock size={14} className="mr-1 text-muted-foreground" />
                  {scenario.processParameters.sprintLength} weeks
                </div>
              </div>
              
              <div className="bg-muted/30 p-2 rounded-md">
                <div className="text-xs text-muted-foreground">Velocity</div>
                <div className="font-medium flex items-center">
                  <BarChart3 size={14} className="mr-1 text-muted-foreground" />
                  {scenario.teamConfiguration.averageVelocity} pts/sprint
                </div>
              </div>
              
              <div className="bg-muted/30 p-2 rounded-md">
                <div className="text-xs text-muted-foreground">Total Points</div>
                <div className="font-medium">
                  {scenario.backlogConfiguration.totalStoryPoints}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">AI Accelerators</h3>
            <div className="flex flex-wrap gap-1">
              {scenario.genAIConfiguration.accelerators.length > 0 ? (
                scenario.genAIConfiguration.accelerators.map((accelerator) => (
                  <Badge key={accelerator} variant="primary" size="sm">
                    {accelerator === "acc1" ? "Code Copilot Pro" :
                     accelerator === "acc2" ? "Requirements Analyzer" :
                     accelerator === "acc3" ? "Test Generation Suite" :
                     accelerator === "acc4" ? "Documentation Assistant" :
                     accelerator === "acc5" ? "Code Review AI" : 
                     accelerator}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-muted-foreground italic">No accelerators selected</span>
              )}
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-2">Configuration Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Overall status</span>
                <StatusIndicator 
                  status={validationResults.configurationStatus === "complete" ? "success" : "warning"} 
                  label={validationResults.configurationStatus} 
                />
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Team configuration</span>
                <StatusIndicator 
                  status={validationResults.teamConfigStatus === "valid" ? "success" : "error"}
                  label={validationResults.teamConfigStatus}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Process configuration</span>
                <StatusIndicator 
                  status={validationResults.processConfigStatus === "valid" ? "success" : "error"}
                  label={validationResults.processConfigStatus}
                />
              </div>
            </div>
          </div>
          
          {validationResults.validationWarnings.length > 0 && (
            <div className="bg-warning/10 border border-warning/30 rounded-md p-3">
              <div className="flex items-start">
                <AlertTriangle className="text-warning mr-2 mt-0.5" size={16} />
                <div>
                  <h4 className="text-sm font-medium">Validation Warnings</h4>
                  <ul className="text-xs mt-1 space-y-1">
                    {validationResults.validationWarnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Estimation Quality</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Confidence in estimates</span>
            <div className="flex items-center">
              <StatusIndicator 
                status={getQualityColor(validationResults.estimationQuality) as any}
                withPulse={false}
              />
              <span className="ml-2 font-medium">
                {(validationResults.estimationQuality * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          
          <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-primary rounded-full"
              style={{ width: `${validationResults.estimationQuality * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low confidence</span>
            <span>High confidence</span>
          </div>
          
          <div className="pt-3 border-t">
            <h3 className="text-sm font-medium mb-2">Preliminary Forecast</h3>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Expected duration</span>
              <span className="font-medium">{validationResults.expectedDuration} weeks</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Confidence level</span>
              <span className="font-medium">{(validationResults.confidenceLevel * 100).toFixed(0)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {scenario.baselineScenarioId && (
        <Card className="bg-muted/20 border border-dashed">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Baseline Comparison</h3>
              <Badge variant="outline" size="sm">Preview</Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              Run the simulation to see detailed comparison with the baseline scenario.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuickPreviewPanel;
