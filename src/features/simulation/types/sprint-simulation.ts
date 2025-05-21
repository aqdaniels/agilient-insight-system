
export interface SprintData {
  sprintNumber: number;
  velocityPoints: number;
  completedStoryPoints: number;
  remainingBacklog: number;
  teamUtilization: number; // percentage
  acceleratorImpact?: number; // additional points completed due to accelerator
}

export interface AgileKPI {
  name: string;
  value: number;
  target?: number;
  unit: string;
}

export interface SprintSimulationConfig {
  initialBacklogSize: number; // in story points
  baselineVelocity: number; // story points per sprint
  teamSize: number;
  sprintsToSimulate: number;
  kpis: AgileKPI[];
  acceleratorId: string | null;
  velocityVariability: number; // percentage of variation between sprints
}

export interface SprintSimulationResult {
  sprints: SprintData[];
  totalDuration: number; // in weeks
  averageVelocity: number;
  backlogBurndown: {
    sprintNumber: number;
    remainingPoints: number;
  }[];
  kpiTrends: {
    kpiName: string;
    values: number[];
  }[];
  withAccelerator: {
    averageVelocity: number;
    sprintsRequired: number;
    improvementPercentage: number;
  } | null;
}
