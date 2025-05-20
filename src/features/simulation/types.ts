
export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  baselineScenarioId?: string;
  projectId: string;
  teamConfiguration: TeamConfiguration;
  backlogConfiguration: BacklogConfiguration;
  genAIConfiguration: GenAIConfiguration;
  processParameters: ProcessParameters;
  simulationParameters: SimulationParameters;
  results?: SimulationResults;
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
  tags: string[];
}

export interface TeamConfiguration {
  teamSize: number;
  skills: string[];
  averageVelocity: number;
  seniorityLevel: number;
  onboardingTime: number;
  attritionRisk: number;
}

export interface BacklogConfiguration {
  totalStoryPoints: number;
  storyDistribution: Record<string, number>;
  dependencies: Dependency[];
  prioritizationStrategy: string;
}

export interface Dependency {
  sourceId: string;
  targetId: string;
  type: 'blocks' | 'is-blocked-by' | 'relates-to';
}

export interface GenAIConfiguration {
  accelerators: string[];
  adoptionRate: AdoptionPoint[];
  effectivenessMultiplier: number;
  coveragePercentage: number;
}

export interface AdoptionPoint {
  timePoint: number;
  effectivenessPercent: number;
}

export interface ProcessParameters {
  sprintLength: number;
  ceremonyOverhead: number;
  workItemAgingEffect: number;
  contextSwitchingImpact: number;
}

export interface SimulationParameters {
  resolution: 'day' | 'week' | 'sprint';
  iterationCount: number;
  confidenceInterval: number;
  includeHolidays: boolean;
  includePTOEffect: boolean;
}

export interface SimulationResults {
  completionDate: Date;
  confidenceLevel: number;
  velocityTrend: VelocityPoint[];
  completionDistribution: CompletionPoint[];
  riskFactors: RiskFactor[];
  comparisonToBaseline?: BaselineComparison;
}

export interface VelocityPoint {
  sprint: number;
  velocity: number;
}

export interface CompletionPoint {
  date: Date;
  probability: number;
}

export interface RiskFactor {
  name: string;
  impact: number;
  probability: number;
}

export interface BaselineComparison {
  timeReduction: number;
  costReduction: number;
  qualityImprovement: number;
}

// Templates for scenario creation
export const scenarioTemplates = [
  {
    name: "Standard Delivery",
    description: "Basic delivery scenario with standard parameters"
  },
  {
    name: "Aggressive Timeline",
    description: "Optimized for speed with increased resources"
  },
  {
    name: "Cost Optimized",
    description: "Balanced approach focusing on resource efficiency"
  },
  {
    name: "Quality Focused",
    description: "Emphasizes thorough testing and review cycles"
  },
  {
    name: "GenAI Accelerated",
    description: "Leverages AI tools to enhance team productivity"
  }
];
