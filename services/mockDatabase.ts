
import { VerificationLog, Verdict } from '../types';

const STORAGE_KEY = 'truthguard_logs';

export const getLogs = (): VerificationLog[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveLog = (log: VerificationLog) => {
  const logs = getLogs();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([log, ...logs]));
};

export const updateVotes = (id: string, type: 'agree' | 'disagree') => {
  const logs = getLogs();
  const updated = logs.map(log => {
    if (log.id === id) {
      return {
        ...log,
        votes: {
          ...log.votes,
          [type]: log.votes[type as keyof typeof log.votes] + 1
        }
      };
    }
    return log;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getStats = () => {
  const logs = getLogs();
  const total = logs.length;
  const fake = logs.filter(l => l.verdict === Verdict.FAKE).length;
  const real = logs.filter(l => l.verdict === Verdict.REAL).length;
  const mixed = logs.filter(l => l.verdict === Verdict.MIXED).length;
  
  return {
    total,
    fake,
    real,
    mixed,
    accuracyTrend: [
      { name: 'Jan', acc: 85 },
      { name: 'Feb', acc: 88 },
      { name: 'Mar', acc: 92 },
      { name: 'Apr', acc: 94 },
    ]
  };
};
