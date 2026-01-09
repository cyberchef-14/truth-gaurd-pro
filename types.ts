
export enum Verdict {
  REAL = 'REAL',
  FAKE = 'FAKE',
  MIXED = 'MIXED',
  UNVERIFIED = 'UNVERIFIED'
}

export interface VerificationLog {
  id: string;
  timestamp: number;
  claim: string;
  verdict: Verdict;
  confidence: number;
  explanation: string;
  sources: Array<{ title: string; uri: string }>;
  hash: string;
  votes: {
    agree: number;
    disagree: number;
  };
  fallacies?: string[];
  reasoning_steps?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export interface AnalysisResponse {
  verdict: Verdict;
  confidence: number;
  explanation: string;
  claims_identified: string[];
  fallacies?: string[];
  reasoning_steps?: string[];
}
