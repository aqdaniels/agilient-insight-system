
import React, { useState } from "react";
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  Badge,
  DataCard,
  Tabs,
  Breadcrumbs,
  ProgressBar,
  StatusIndicator,
  EmptyState,
  Avatar
} from "@/components/design-system";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart3, 
  Calendar, 
  ChevronsRight, 
  Clock, 
  FileBarChart, 
  LayoutDashboard, 
  List, 
  Plus, 
  Search, 
  Settings, 
  User,
  Check,
  FileCheck,
  Clock3,
  AlertCircle
} from "lucide-react";

// Sample project data
const projects = [
  {
    id: 1,
    name: "Infrastructure Upgrade",
    progress: 68,
    status: "on-track",
    dueDate: "Jun 15, 2025",
    tasks: 24,
    completedTasks: 16
  },
  {
    id: 2,
    name: "Software Integration",
    progress: 42,
    status: "at-risk",
    dueDate: "Jul 28, 2025",
    tasks: 37,
    completedTasks: 14
  },
  {
    id: 3,
    name: "Data Migration",
    progress: 91,
    status: "on-track",
    dueDate: "May 30, 2025",
    tasks: 18,
    completedTasks: 16
  }
];

// Sample KPI data
const kpiData = [
  {
    title: "On-time Delivery",
    value: "87%",
    caption: "Last 30 days",
    icon: <Clock3 size={20} />,
    trend: {
      value: 5.2,
      isPositive: true
    }
  },
  {
    title: "Resource Utilization",
    value: "72%",
    caption: "Current quarter",
    icon: <User size={20} />,
    trend: {
      value: 2.1,
      isPositive: true
    }
  },
  {
    title: "Budget Variance",
    value: "-3.8%",
    caption: "Annual target: ±5%",
    icon: <FileBarChart size={20} />,
    trend: {
      value: 1.5,
      isPositive: false
    }
  },
  {
    title: "Quality Score",
    value: "94",
    caption: "Target: 90+",
    icon: <FileCheck size={20} />,
    trend: {
      value: 2,
      isPositive: true
    }
  }
];

// Main Dashboard Component
const Index = () => {
  // Tabs state
  const [activeTab, setActiveTab] = useState("overview");
  
  // Breadcrumbs items
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Project Portfolio" }
  ];
  
  // Tab items
  const tabItems = [
    {
      id: "overview",
      label: "Overview",
      content: <OverviewTab projects={projects} kpiData={kpiData} />
    },
    {
      id: "projects",
      label: "Projects",
      content: <ProjectsTab projects={projects} />
    },
    {
      id: "resources",
      label: "Resources",
      content: <ResourcesTab />
    },
    {
      id: "analytics",
      label: "Analytics",
      content: <AnalyticsTab />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-foreground mr-8">Agilient</h1>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-primary font-medium">Dashboard</a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Projects</a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Resources</a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Reports</a>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Search size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings size={20} />
              </Button>
              <Avatar size="sm" status="online" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <Breadcrumbs items={breadcrumbItems} className="mb-4" />
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">Project Portfolio</h2>
            <div className="flex space-x-3">
              <Button variant="outline" leftIcon={<Calendar size={16} />}>
                May 2025
              </Button>
              <Button variant="primary" leftIcon={<Plus size={16} />}>
                New Project
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs navigation */}
        <Tabs
          items={tabItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          variant="underlined"
          className="mb-8"
        />
      </main>
    </div>
  );
};

// Tab Components
const OverviewTab = ({ projects, kpiData }) => {
  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <DataCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            caption={kpi.caption}
            icon={kpi.icon}
            trend={kpi.trend}
          />
        ))}
      </div>

      {/* Project Status Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Project Status Summary</CardTitle>
              <CardDescription>Overall portfolio health and progress</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              View All <ChevronsRight size={16} className="ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className="font-medium">{project.name}</h4>
                    <div className="flex items-center mt-1">
                      <StatusIndicator 
                        status={project.status === "on-track" ? "success" : "warning"} 
                        size="sm" 
                      />
                      <span className="text-sm text-muted-foreground ml-2">
                        {project.status === "on-track" ? "On Track" : "At Risk"}
                      </span>
                      <span className="text-sm text-muted-foreground mx-2">•</span>
                      <span className="text-sm text-muted-foreground">Due {project.dueDate}</span>
                    </div>
                  </div>
                  <Badge 
                    variant={project.status === "on-track" ? "success" : "warning"}
                  >
                    {project.completedTasks}/{project.tasks} Tasks
                  </Badge>
                </div>
                <ProgressBar 
                  value={project.progress} 
                  variant={project.status === "on-track" ? "success" : "warning"} 
                  size="md"
                  showValue
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resource Allocation Chart Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resource Allocation</CardTitle>
            <CardDescription>Current team utilization by project</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 size={48} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">Resource allocation chart visualization</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Milestones</CardTitle>
            <CardDescription>Next 30 days critical milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-start">
                  <div className="bg-muted rounded-full p-2 mr-3">
                    <Clock size={16} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h5 className="font-medium text-sm">Technical Design Review</h5>
                      <Badge variant="outline" size="sm">May 25</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Infrastructure Upgrade Project
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ProjectsTab = ({ projects }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Active Projects</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" leftIcon={<List size={16} />}>
            List View
          </Button>
          <Button variant="outline" size="sm" leftIcon={<LayoutDashboard size={16} />}>
            Board View
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <Card key={project.id} variant="interactive" className="cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{project.name}</h4>
                  <div className="flex items-center mt-1">
                    <StatusIndicator 
                      status={project.status === "on-track" ? "success" : "warning"} 
                      size="sm" 
                    />
                    <span className="text-sm text-muted-foreground ml-2">
                      {project.status === "on-track" ? "On Track" : "At Risk"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <Badge 
                    variant={project.status === "on-track" ? "success" : "warning"}
                  >
                    {project.progress}% Complete
                  </Badge>
                  <span className="text-sm text-muted-foreground mt-1">Due {project.dueDate}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <ProgressBar 
                  value={project.progress} 
                  variant={project.status === "on-track" ? "success" : "warning"} 
                  size="md"
                />
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <Avatar key={i} size="sm" className="border-2 border-background" />
                  ))}
                </div>
                <div className="flex items-center">
                  <Check size={16} className="text-success mr-1" />
                  <span className="text-sm">
                    {project.completedTasks}/{project.tasks} Tasks
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ResourcesTab = () => {
  return (
    <EmptyState
      icon={<User size={48} />}
      title="Resource Management"
      description="Assign team members to projects, track resource utilization, and manage capacity planning."
      action={{
        label: "Explore Resources",
        onClick: () => console.log("Explore resources clicked")
      }}
      variant="card"
      className="max-w-3xl mx-auto border-muted"
    />
  );
};

const AnalyticsTab = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Performance Metrics</CardTitle>
            <CardDescription>Key productivity indicators</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="mb-4">
                <Skeleton className="h-40 w-full" />
              </div>
              <p className="text-sm text-muted-foreground">
                Performance visualization will appear here
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>Project risk assessment</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="mb-4">
                <Skeleton className="h-40 w-full" />
              </div>
              <p className="text-sm text-muted-foreground">
                Risk visualization will appear here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Delivery Simulation Results</CardTitle>
              <CardDescription>Projected outcomes based on current data</CardDescription>
            </div>
            <Button variant="outline" size="sm" leftIcon={<AlertCircle size={16} />}>
              Insights
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="font-medium">Metric</span>
              <span className="font-medium">Projected Value</span>
            </div>
            {[
              { metric: "Project Completion Date", value: "Aug 18, 2025 (±3 days)" },
              { metric: "Final Budget", value: "$1,245,000 (±2.3%)" },
              { metric: "Resource Utilization", value: "84% (±5%)" },
              { metric: "Quality Score", value: "91/100 (±4)" }
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm">{item.metric}</span>
                <span className="text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
