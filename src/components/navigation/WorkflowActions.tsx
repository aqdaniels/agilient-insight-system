
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { Button } from '@/components/design-system';
import { ArrowRight, Play } from 'lucide-react';

const WorkflowActions: React.FC = () => {
  const location = useLocation();
  const { accelerators, selectedAcceleratorId } = useAppContext();
  
  const renderGenAIActions = () => {
    const hasAccelerators = accelerators.length > 0;
    
    return (
      <div className="flex flex-col sm:flex-row gap-2">
        {hasAccelerators && (
          <Link to="/simulation">
            <Button 
              variant="primary" 
              leftIcon={<Play className="h-4 w-4" />}
            >
              Simulate with Accelerators
            </Button>
          </Link>
        )}
        <Link to="/team">
          <Button 
            variant="outline"
            leftIcon={<ArrowRight className="h-4 w-4" />}
          >
            Configure Team
          </Button>
        </Link>
      </div>
    );
  };
  
  const renderTeamActions = () => (
    <div className="flex flex-col sm:flex-row gap-2">
      <Link to="/simulation">
        <Button 
          variant="primary"
          leftIcon={<Play className="h-4 w-4" />}
        >
          Run Simulation
        </Button>
      </Link>
      <Link to="/genai">
        <Button 
          variant="outline"
          leftIcon={<ArrowRight className="h-4 w-4" />}
        >
          Configure AI Accelerators
        </Button>
      </Link>
    </div>
  );
  
  const renderSimulationActions = () => (
    <div className="flex flex-col sm:flex-row gap-2">
      <Link to="/genai">
        <Button 
          variant="outline"
          leftIcon={<ArrowRight className="h-4 w-4" />}
        >
          Manage AI Accelerators
        </Button>
      </Link>
      <Link to="/team">
        <Button 
          variant="outline"
          leftIcon={<ArrowRight className="h-4 w-4" />}
        >
          Configure Team
        </Button>
      </Link>
    </div>
  );
  
  const getContextActions = () => {
    const path = location.pathname;
    
    if (path === '/genai' || path.startsWith('/genai/')) {
      return renderGenAIActions();
    } else if (path === '/team' || path.startsWith('/team/')) {
      return renderTeamActions();
    } else if (path === '/simulation' || path.startsWith('/simulation/')) {
      return renderSimulationActions();
    }
    
    return null;
  };
  
  const actions = getContextActions();
  
  if (!actions) {
    return null;
  }
  
  return (
    <div className="mt-4 p-4 border border-border/50 rounded-lg bg-muted/20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h3 className="text-sm font-medium text-muted-foreground">Next Steps</h3>
        {actions}
      </div>
    </div>
  );
};

export default WorkflowActions;
