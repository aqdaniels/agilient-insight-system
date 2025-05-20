
export interface AdoptionPoint {
  timePoint: number;
  effectivenessPercent: number;
}

export interface TaskTypeImpact {
  taskType: string;
  impactFactor: number;
}

export interface GenAIAccelerator {
  id: string;
  name: string;
  description: string;
  applicableSkills: string[];
  taskTypeImpacts: Record<string, number>;
  adoptionCurve: AdoptionPoint[];
  implementationCost: number;
  trainingOverhead: number;
  tags?: string[];
  aiCapabilities?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ROIAnalysis {
  breakEvenSprint: number;
  totalCost: number;
  totalBenefit: number;
  netBenefit: number;
  confidenceInterval: [number, number];
  monthlySavings: number;
}

export type CurveTemplate = 'linear' | 's-curve' | 'exponential' | 'plateau' | 'custom';
