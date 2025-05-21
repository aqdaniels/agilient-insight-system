
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from '@/components/design-system';
import { 
  Database, 
  Link2, 
  BarChart2, 
  Users, 
  ArrowRight, 
  Play
} from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

const Index = () => {
  const { accelerators } = useAppContext();
  const hasAccelerators = accelerators.length > 0;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Agilient Platform</h1>
        <p className="text-muted-foreground">Project delivery simulation and optimization platform</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card variant="default" padding="md" className="flex flex-col">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-primary/10 mr-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Team Configuration</h2>
            </div>
            {hasAccelerators && (
              <div className="bg-green-500/10 text-green-500 text-xs font-medium px-2 py-1 rounded-full">
                Ready
              </div>
            )}
          </div>
          <p className="text-muted-foreground mb-6 flex-grow">
            Configure team composition, analyze velocity, and optimize working patterns.
          </p>
          <div className="space-y-2 mt-auto">
            <Link to="/team" className="w-full">
              <Button variant="primary" className="w-full">Configure Team</Button>
            </Link>
            {hasAccelerators && (
              <Link to="/simulation" className="w-full">
                <Button variant="outline" className="w-full" leftIcon={<Play size={16} />}>
                  Run Simulation
                </Button>
              </Link>
            )}
          </div>
        </Card>
        
        <Card variant="default" padding="md" className="flex flex-col">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-primary/10 mr-3">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                  GenAI Accelerators
                </span>
              </h2>
            </div>
            <div className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
              {hasAccelerators ? `${accelerators.length} Defined` : 'New'}
            </div>
          </div>
          <p className="text-muted-foreground mb-6 flex-grow">
            Define, analyze and compare AI tools to accelerate your development process.
          </p>
          <div className="space-y-2 mt-auto">
            <Link to="/genai" className="w-full">
              <Button variant="primary" className="w-full">
                {hasAccelerators ? 'Manage Accelerators' : 'Create Accelerators'}
              </Button>
            </Link>
            {hasAccelerators && (
              <Link to="/simulation" className="w-full">
                <Button variant="outline" className="w-full" leftIcon={<ArrowRight size={16} />}>
                  Use in Simulation
                </Button>
              </Link>
            )}
          </div>
        </Card>
        
        <Card variant="default" padding="md" className="flex flex-col">
          <div className="mb-4 flex items-center">
            <div className="p-2 rounded-md bg-primary/10 mr-3">
              <BarChart2 className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Simulation Dashboard</h2>
          </div>
          <p className="text-muted-foreground mb-6 flex-grow">
            Run simulations to predict project outcomes and optimize resource allocation using your team and AI configurations.
          </p>
          <div className="space-y-2 mt-auto">
            <Link to="/simulation" className="w-full">
              <Button variant="primary" className="w-full" leftIcon={<Play size={16} />}>
                Run Simulation
              </Button>
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/genai" className="w-full">
                <Button variant="outline" className="w-full text-xs" size="sm">
                  AI Accelerators
                </Button>
              </Link>
              <Link to="/team" className="w-full">
                <Button variant="outline" className="w-full text-xs" size="sm">
                  Team Config
                </Button>
              </Link>
            </div>
          </div>
        </Card>
        
        <Card variant="default" padding="md" className="flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-primary/10 mr-3">
                <Link2 className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Cortex Digital Twin</h2>
            </div>
            <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">New</div>
          </div>
          <p className="text-muted-foreground mb-6 flex-grow">
            Connect with DXC Cortex Digital Twin to enhance your delivery simulations with historical data.
          </p>
          <div className="space-y-2 mt-auto">
            <Link to="/integration/cortex" className="w-full">
              <Button variant="outline" className="w-full" leftIcon={<Link2 size={16} />}>
                Configure Integration
              </Button>
            </Link>
          </div>
        </Card>
      </div>
      
      <div className="bg-muted/30 border border-border/50 rounded-lg p-6 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg font-medium">Recommended Workflow</h3>
            <p className="text-muted-foreground text-sm mt-1">
              For best results, follow this workflow to optimize your delivery process
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/team">
              <Button variant="outline" size="sm" leftIcon={<ArrowRight size={14} />}>
                1. Configure Team
              </Button>
            </Link>
            <span className="text-muted-foreground self-center">→</span>
            <Link to="/genai">
              <Button variant="outline" size="sm" leftIcon={<ArrowRight size={14} />}>
                2. Define AI Accelerators
              </Button>
            </Link>
            <span className="text-muted-foreground self-center">→</span>
            <Link to="/simulation">
              <Button variant="primary" size="sm" leftIcon={<Play size={14} />}>
                3. Run Simulation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
