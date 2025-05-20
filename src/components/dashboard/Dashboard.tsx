
import React, { useState } from "react";
import { Button } from "@/components/design-system";
import {
  LayoutDashboard,
  BarChart,
  ClipboardList,
  Users,
  Play,
  LineChart,
  FolderGit2,
  Link,
  FileCheck
} from "lucide-react";
import ScenarioManager from "@/features/scenarios/containers/ScenarioManager";
import BacklogManager from "@/features/backlog/containers/BacklogManager";
import TeamConfigurator from "@/features/team/containers/TeamConfigurator";
import SimulationDashboard from "@/features/simulation/containers/SimulationDashboard";
import ResultsAnalyzer from "@/features/results/containers/ResultsAnalyzer";
import ComparisonWorkspace from "@/features/comparison/containers/ComparisonWorkspace";
import CortexTwinConnector from "@/features/integration/containers/CortexTwinConnector";
import JiraIntegrator from "@/features/integration/containers/JiraIntegrator";

// Navigation config
const navItems = [
  {
    id: "scenarios",
    label: "Scenarios",
    icon: <LayoutDashboard size={20} />,
    component: ScenarioManager
  },
  {
    id: "backlog",
    label: "Backlog",
    icon: <ClipboardList size={20} />,
    component: BacklogManager
  },
  {
    id: "team",
    label: "Team",
    icon: <Users size={20} />,
    component: TeamConfigurator
  },
  {
    id: "simulation",
    label: "Simulation",
    icon: <Play size={20} />,
    component: SimulationDashboard
  },
  {
    id: "results",
    label: "Results",
    icon: <BarChart size={20} />,
    component: ResultsAnalyzer
  },
  {
    id: "comparison",
    label: "Comparison",
    icon: <LineChart size={20} />,
    component: ComparisonWorkspace
  },
  {
    id: "cortex",
    label: "Digital Twin",
    icon: <Link size={20} />,
    component: CortexTwinConnector
  },
  {
    id: "jira",
    label: "Jira",
    icon: <FolderGit2 size={20} />,
    component: JiraIntegrator
  },
  {
    id: "reports",
    label: "Reports",
    icon: <FileCheck size={20} />,
    component: () => <div>Reports feature coming soon</div>
  }
];

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState("scenarios");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const ActiveComponent = navItems.find(item => item.id === activeSection)?.component || (() => <div>Section not found</div>);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:w-64 border-r border-border flex-col">
        <div className="py-6 px-4 border-b border-border">
          <h1 className="text-xl font-bold text-primary flex items-center">
            <BarChart className="inline-block mr-2" size={24} />
            Agilient
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Project Delivery Simulation</p>
        </div>
        <nav className="flex-1 py-6 px-2 space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start text-base font-normal h-auto py-2 ${
                activeSection === item.id ? 'bg-primary/10 text-primary' : ''
              }`}
              onClick={() => setActiveSection(item.id)}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Button>
          ))}
        </nav>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-background border-b border-border p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary flex items-center">
          <BarChart className="inline-block mr-2" size={24} />
          Agilient
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? 'Close' : 'Menu'}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-10 bg-background border-b border-border p-2 flex flex-col">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start text-base font-normal h-auto py-2 ${
                activeSection === item.id ? 'bg-primary/10 text-primary' : ''
              }`}
              onClick={() => {
                setActiveSection(item.id);
                setIsMobileMenuOpen(false);
              }}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Button>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 pt-4 md:pt-0">
        <div className="container mx-auto px-4 pt-16 md:pt-6 pb-8">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
