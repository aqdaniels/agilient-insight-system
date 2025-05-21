
export interface ApplicationHoursBreakdown {
  development: number;
  testing: number;
  management: number;
}

export interface SimulationApplication {
  id: string;
  name: string;
  hoursBreakdown: ApplicationHoursBreakdown;
  totalHours: number;
  storyPoints?: number;
  complexity: 'low' | 'medium' | 'high';
}

export interface ComplexityMapping {
  low: number;  // hours per story point
  medium: number;
  high: number;
}

export interface ApplicationSimulationConfig {
  applications: SimulationApplication[];
  teamSize: number;
  acceleratorId: string | null;
  complexityMapping: ComplexityMapping;
  hoursPerSprint: number;
  sprintLength: number; // in weeks
}

export interface ApplicationSimulationResult {
  totalStoryPoints: number;
  totalHours: number;
  sprintsRequired: number;
  totalDuration: number; // in weeks
  applicationBreakdown: {
    applicationId: string;
    name: string;
    sprints: number;
  }[];
  withAccelerator: {
    sprintsRequired: number;
    totalDuration: number;
    timeSaved: number;
  } | null;
}
