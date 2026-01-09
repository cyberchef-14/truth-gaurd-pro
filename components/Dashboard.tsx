
import React, { useMemo, useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle, Activity, Zap, Globe, Clock, ShieldX, Map as MapIcon, ShieldAlert } from 'lucide-react';
import { getStats, getLogs } from '../services/mockDatabase';

const Dashboard: React.FC = () => {
  const stats = useMemo(() => getStats(), []);
  const logs = useMemo(() => getLogs().slice(0, 5), []);

  const tickerItems = [
    { text: "DEBUNKED: Viral 'lemon cure' footage confirmed as 2019 stock video.", type: "FAKE" },
    { text: "VERIFIED: Treasury economic report data matches official registry.", type: "REAL" },
    { text: "ALERT: Coordinated bot activity detected in Southeast Asia region.", type: "ALERT" },
    { text: "DEBUNKED: World leader 'dancing' video flagged as Gen-AI deepfake.", type: "FAKE" }
  ];

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 p-8 rounded-[2.5rem] relative overflow-hidden group">
      <div className="absolute -right-6 -bottom-6 opacity-[0.02] group-hover:opacity-[0.06] transition-opacity duration-700">
        <Icon className="w-32 h-32" />
      </div>
      <div className="relative z-10">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
        <div className="flex items-center gap-4 mt-2">
          <h3 className="text-5xl font-black tracking-tighter">{value}</h3>
          <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 max-w-6xl mx-auto will-change-transform">
      {/* Ticker */}
      <div className="bg-blue-600/5 border-y border-blue-500/10 py-3 overflow-hidden relative">
        <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                item.type === 'FAKE' ? 'bg-red-500/20 text-red-500' : 
                item.type === 'REAL' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-blue-500/20 text-blue-500'
              }`}>
                {item.type}
              </span>
              <span className="text-[11px] font-bold text-slate-400 tracking-tight">{item.text}</span>
              <span className="text-slate-800 mx-4 opacity-50">•</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Audits" value={stats.total} icon={Zap} color="text-blue-500 bg-blue-500" />
        <StatCard title="Flagged Content" value={stats.fake} icon={ShieldX} color="text-red-500 bg-red-500" />
        <StatCard title="Verified Data" value={stats.real} icon={CheckCircle} color="text-emerald-500 bg-emerald-500" />
        <StatCard title="System Load" value="Optimal" icon={Activity} color="text-amber-500 bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-slate-900/30 border border-slate-800/50 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black flex items-center gap-3 italic">
              <Globe className="w-6 h-6 text-blue-500" />
              Surveillance Grid
            </h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Active Threat</span>
              </div>
            </div>
          </div>
          
          {/* SVG Heatmap Simulation */}
          <div className="h-[300px] bg-slate-950/40 rounded-3xl relative border border-white/5 flex items-center justify-center">
            <svg viewBox="0 0 800 400" className="w-full h-full opacity-10">
              <path fill="currentColor" className="text-blue-500" d="M100,100 Q400,50 700,100 T700,300 Q400,350 100,300 T100,100" />
              <circle cx="200" cy="150" r="100" fill="url(#grad1)" />
              <defs>
                <radialGradient id="grad1">
                  <stop offset="0%" stopColor="rgba(59, 130, 246, 0.2)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
            </svg>
            <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-red-500 rounded-full animate-ping delay-500" />
            <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-amber-500 rounded-full animate-ping delay-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex flex-col items-center justify-center gap-2">
               <ShieldAlert className="w-10 h-10 text-blue-500/20" />
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">Live Global Scan Active</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-slate-900/30 border border-slate-800/50 p-10 rounded-[3rem] shadow-2xl flex flex-col">
          <h3 className="text-xl font-black mb-8 flex items-center gap-3">
            <Clock className="w-5 h-5 text-slate-500" />
            Live Feed
          </h3>
          <div className="flex-1 space-y-6">
            {logs.length > 0 ? logs.map((log, i) => (
              <div key={i} className="flex gap-4 border-l-2 border-slate-800 pl-6 pb-2 transition-all hover:border-blue-500/50 group">
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-black text-slate-300 line-clamp-1 group-hover:text-white transition-colors">{log.claim}</p>
                  <div className="flex justify-between items-center">
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                      log.verdict === 'REAL' ? 'bg-emerald-500/10 text-emerald-400' : 
                      log.verdict === 'FAKE' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {log.verdict}
                    </span>
                    <span className="text-[9px] font-mono text-slate-700">0x{log.id.slice(3)}</span>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-slate-600 text-xs italic py-10 text-center">Awaiting incoming data...</p>
            )}
          </div>
          <button className="w-full py-4 mt-8 bg-slate-800/50 hover:bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all border border-slate-700/50">
            View Intelligence Log
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
