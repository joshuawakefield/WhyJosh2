
// This file runs on the server and uses the Zod library for schema validation.
// import { z } from 'zod';

// As Zod is not available in this environment, we'll represent the schema structure.
// The following is a representation of the Zod schema for type-checking and documentation.

export const BriefSchema = {
  // Zod schema would be here in a Node.js environment
  // Example: z.object({ ... })
};

export type Brief = {
  fit_score: number; // min(55).max(96)
  rationale: string; // max(200)
  summary_bullets: {
    text: string; // max(160)
    evidence_ids: string[];
  }[]; // min(6).max(8)
  skills_matrix: {
    skill: string;
    status: 'Proven' | 'Working' | 'Ramp-in-2-weeks';
    ramp_note?: string;
  }[]; // min(8).max(12)
  outcomes_alignment: {
    jd_outcome: string;
    evidence_id: string;
    metric?: string;
  }[]; // min(2).max(4)
  ramp_2w: string[]; // min(3).max(5)
  plan_30_60_90: {
    '30': string;
    '60': string;
    '90': string;
  };
  risks: {
    risk: string;
    mitigation: string;
  }[]; // min(2).max(3)
  cta: string; // max(120)
  jd_fields: {
    role: string;
    company: string;
  };
};
