
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/design-system';
import { Database, Link2 } from 'lucide-react';

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Agilient Platform</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg shadow-md p-6 border border-border/50 hover:border-border transition-colors">
          <h2 className="text-xl font-semibold mb-2">Team Configuration</h2>
          <p className="text-muted-foreground mb-4">
            Configure team composition, analyze velocity, and optimize working patterns.
          </p>
          <Link to="/team">
            <Button>View Team Config</Button>
          </Link>
        </div>
        
        <div className="bg-card rounded-lg shadow-md p-6 border border-border/50 hover:border-primary transition-colors">
          <h2 className="text-xl font-semibold mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              GenAI Accelerator
            </span>
          </h2>
          <p className="text-muted-foreground mb-4">
            Define, analyze and compare AI tools to accelerate your development process.
          </p>
          <Link to="/genai">
            <Button variant="primary">Explore GenAI Tools</Button>
          </Link>
        </div>
        
        <div className="bg-card rounded-lg shadow-md p-6 border border-border/50 hover:border-border transition-colors">
          <h2 className="text-xl font-semibold mb-2">Simulation Dashboard</h2>
          <p className="text-muted-foreground mb-4">
            Run simulations to predict project outcomes and optimize resource allocation.
          </p>
          <Link to="/simulation">
            <Button variant="secondary">View Simulations</Button>
          </Link>
        </div>
        
        <div className="bg-card rounded-lg shadow-md p-6 border border-border/50 hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-semibold">Cortex Digital Twin</h2>
            <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">New</div>
          </div>
          <p className="text-muted-foreground mb-4">
            Connect with DXC Cortex Digital Twin to enhance your delivery simulations with historical data.
          </p>
          <Link to="/integration/cortex">
            <Button variant="outline" leftIcon={<Link2 size={16} />}>
              Configure Integration
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
