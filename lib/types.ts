export interface Thought {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

export interface BeliefStrengthEntry {
  id: string;
  thought_id: string;
  value: number;
  created_at: string;
}

export {};