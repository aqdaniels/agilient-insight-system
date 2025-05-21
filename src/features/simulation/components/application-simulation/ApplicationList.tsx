
import React from 'react';
import { SimulationApplication, ComplexityMapping } from "../../types/application-simulation";
import { Badge } from "@/components/design-system";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ApplicationListProps {
  applications: SimulationApplication[];
  onRemoveApplication: (id: string) => void;
  complexityMapping: ComplexityMapping;
}

const ApplicationList: React.FC<ApplicationListProps> = ({
  applications,
  onRemoveApplication,
  complexityMapping
}) => {
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  if (applications.length === 0) {
    return (
      <div className="text-center p-6 bg-muted/20 rounded-md">
        <p className="text-muted-foreground">No applications added yet. Add an application to begin simulation.</p>
      </div>
    );
  }

  const calculateStoryPoints = (app: SimulationApplication) => {
    const hoursPerPoint = complexityMapping[app.complexity];
    return Math.ceil(app.totalHours / hoursPerPoint);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Applications ({applications.length})</h3>
        <p className="text-sm text-muted-foreground">
          Total Hours: {applications.reduce((sum, app) => sum + app.totalHours, 0)}
        </p>
      </div>
      
      <div className="space-y-3">
        {applications.map(app => (
          <div 
            key={app.id} 
            className="p-4 border rounded-md transition-all duration-200 hover:bg-muted/10 hover:shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{app.name}</h4>
                  <Badge variant={getComplexityColor(app.complexity) as any}>
                    {app.complexity.charAt(0).toUpperCase() + app.complexity.slice(1)} Complexity
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Development</span>
                    <span>{app.hoursBreakdown.development} hours</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Testing</span>
                    <span>{app.hoursBreakdown.testing} hours</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Management</span>
                    <span>{app.hoursBreakdown.management} hours</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Total Hours</div>
                  <div className="text-lg font-semibold">{app.totalHours}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Story Points</div>
                  <div className="text-lg font-semibold">{calculateStoryPoints(app)}</div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onRemoveApplication(app.id)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationList;
