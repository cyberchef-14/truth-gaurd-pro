
import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Clock, Fingerprint, ShieldAlert, ShieldCheck, Search, Database, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { getLogs, updateVotes } from '../services/mockDatabase';
import { Verdict } from '../types';

const History: React.FC = () => {
  const [logs, setLogs] = useState(getLogs());
  const [searchTerm, setSearchTerm] = useState('');

  const handleVote = (id: string, type: 'agree' | 'disagree') => {
    updateVotes(id, type);
    setLogs(getLogs());
  };

  const filteredLogs = logs.filter(log => 
    log.claim.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.verdict.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 max-w-5xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-slate-900/30 p-10 rounded-[3rem] border border-slate-800/50 backdrop-blur-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <Database className="w-5 h-5 text-blue-400" />
             <span className="text-xs font-black text-blue-400 uppercase tracking-widest">Distributed Ledger</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white leading-none">Integrity Logs</h1>
          <p className="text-slate-400 text-lg font-medium">Cryptographic records signed with SHA-256 for public audit.</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search fingerprints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-6 py-4 bg-black/40 border border-slate-700/50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 w-full md:w-80 transition-all font-bold text-slate-200 placeholder:text-slate-700"
          />
        </div>
      </div>

      <div className="space-y-6">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-32 bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-slate-800 animate-in zoom-in">
            <Database className="w-16 h-16 text-slate-800 mx-auto mb-6" />
            <p className="text-slate-500 font-black uppercase tracking-widest">No verified blocks detected.</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem] p-8 hover:border-blue-500/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/[0.02] rounded-full blur-[60px] pointer-events-none group-hover:bg-blue-500/[0.05] transition-all" />
              
              <div className="flex flex-col md:flex-row gap-10 relative z-10">
                <div className="flex-1 space-y-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 border ${
                      log.verdict === Verdict.REAL ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' :
                      log.verdict === Verdict.FAKE ? 'bg-red-500/5 text-red-400 border-red-500/20' :
                      'bg-amber-500/5 text-amber-400 border-amber-500/20'
                    }`}>
                      {log.verdict === Verdict.REAL ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                      {log.verdict}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1.5 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/30 uppercase tracking-wider">
                      <Clock className="w-3 h-3" />
                      {new Date(log.timestamp).toLocaleDateString()} @ {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    <span className="text-[10px] text-slate-500 font-black flex items-center gap-1.5 bg-blue-500/5 text-blue-400/70 px-3 py-1.5 rounded-lg border border-blue-500/10 uppercase tracking-widest font-mono">
                      <Fingerprint className="w-3 h-3" />
                      {log.id}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-100 leading-tight group-hover:text-blue-100 transition-colors">
                    {log.claim}
                  </h3>
                  
                  <div className="p-5 bg-black/40 rounded-2xl border border-white/5">
                    <p className="text-slate-400 text-sm font-medium leading-relaxed italic line-clamp-2">
                      "{log.explanation}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <LinkIcon className="w-3 h-3 text-slate-600" />
                    <p className="font-mono text-[9px] text-slate-600 break-all select-all hover:text-blue-500 transition-colors">
                      {log.hash}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-8 md:border-l border-slate-800/80 md:pl-10 min-w-[160px]">
                  <div className="text-center group-hover:scale-110 transition-transform">
                    <p className={`text-5xl font-black italic tracking-tighter ${
                      log.verdict === Verdict.REAL ? 'text-emerald-400' :
                      log.verdict === Verdict.FAKE ? 'text-red-400' : 'text-amber-400'
                    }`}>
                      {log.confidence}%
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black mt-1">AI TRUST</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleVote(log.id, 'agree')}
                      className="flex flex-col items-center gap-1 px-4 py-3 rounded-2xl hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-400 transition-all border border-transparent hover:border-emerald-500/20 shadow-inner"
                    >
                      <ThumbsUp className="w-5 h-5" />
                      <span className="text-xs font-black">{log.votes.agree}</span>
                    </button>
                    <button 
                      onClick={() => handleVote(log.id, 'disagree')}
                      className="flex flex-col items-center gap-1 px-4 py-3 rounded-2xl hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20 shadow-inner"
                    >
                      <ThumbsDown className="w-5 h-5" />
                      <span className="text-xs font-black">{log.votes.disagree}</span>
                    </button>
                  </div>

                  <button className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase text-blue-500 hover:text-blue-400 transition-colors tracking-widest pt-4">
                    <ExternalLink className="w-3 h-3" />
                    Explorer
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
