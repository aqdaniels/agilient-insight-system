
import { SimulationResults, RiskFactor, VelocityPoint } from "../simulation/types";

export interface AnalysisResult {
  simulationId: string;
  results: SimulationResults;
  insights: {
    timeline: TimelineInsight[];
    resources: ResourceInsight[];
    delivery: DeliveryInsight[];
    cost: CostInsight[];
    risks: RiskInsight[];
    optimization: OptimizationRecommendation[];
  };
}

export interface TimelineInsight {
  type: 'milestone' | 'critical-path' | 'dependency' | 'variance';
  description: string;
  impact: number; // -1 to 1, negative values are negative impact
  sprintRange?: [number, number]; // Affected sprint range
  related?: string[]; // Related entities
}

export interface ResourceInsight {
  type: 'bottleneck' | 'under-utilized' | 'skill-gap' | 'allocation';
  resource: string;
  description: string;
  impact: number;
  sprints?: number[];
}

export interface DeliveryInsight {
  type: 'velocity-trend' | 'completion-rate' | 'work-distribution';
  description: string;
  value: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  impact: 'positive' | 'negative' | 'neutral';
}

export interface CostInsight {
  type: 'variance' | 'trend' | 'roi';
  category?: string;
  description: string;
  amount: number;
  percentChange: number;
}

export interface RiskInsight {
  risk: RiskFactor;
  mitigationStrategy: string;
  potentialImpact: {
    schedule: number; // days
    cost: number; // currency
    quality: number; // 0-10 scale
  };
}

export interface OptimizationRecommendation {
  type: 'team' | 'skill' | 'process' | 'backlog' | 'genai';
  description: string;
  impact: number; // 0-10 scale
  effort: number; // 0-10 scale
  timeToImplement: number; // weeks
  priority: number; // 0-10 scale
}

export interface ComparisonMetric {
  name: string;
  baseline: number;
  current: number;
  difference: number;
  percentChange: number;
  isPositive: boolean;
}
