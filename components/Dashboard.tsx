
import React, { useMemo, useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, Activity, ArrowUpRight, ShieldAlert, Zap, Globe, Clock, Fingerprint, Map as MapIcon, ShieldX } from 'lucide-react';
import { getStats, getLogs } from '../services/mockDatabase';

const Dashboard: React.FC = () => {
  const stats = useMemo(() => getStats(), []);
  const logs = useMemo(() => getLogs().slice(0, 5), []);
  const [tickerOffset, setTickerOffset] = useState(0);

  const tickerItems = [
    { text: "DEBUNKED: Secret moon base claims found to be AI-generated hallucination.", type: "FAKE" },
    { text: "VERIFIED: New economic policy confirmed by Treasury official sources.", type: "REAL" },
    { text: "WARNING: High-density misinformation cluster detected in Pacific Northwest region.", type: "ALERT" },
    { text: "DEBUNKED: Viral 'lemon cure' video uses edited 2019 footage.", type: "FAKE" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerOffset(prev => (prev + 1) % (tickerItems.length * 100));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/50 p-8 rounded-[2.5rem] relative overflow-hidden group">
      <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
        <Icon className="w-32 h-32" />
      </div>
      <div className="relative z-10">
        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">{title}</p>
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
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Ticker */}
      <div className="bg-blue-600/5 border-y border-blue-500/10 py-3 overflow-hidden relative">
        <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                item.type === 'FAKE' ? 'bg-red-500/20 text-red-500' : 
                item.type === 'REAL' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-blue-500/20 text-blue-500'
              }`}>
                {item.type}
              </span>
              <span className="text-xs font-bold text-slate-400 tracking-tight">{item.text}</span>
              <span className="text-slate-700 mx-4">•</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Neural Audits" value={stats.total} icon={Zap} color="text-blue-500 bg-blue-500" />
        <StatCard title="Debunked" value={stats.fake} icon={ShieldX} color="text-red-500 bg-red-500" />
        <StatCard title="Verified" value={stats.real} icon={CheckCircle} color="text-emerald-500 bg-emerald-500" />
        <StatCard title="Uptime" value="99.9%" icon={Activity} color="text-amber-500 bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-slate-900/30 border border-slate-800/50 p-10 rounded-[3rem] shadow-2xl overflow-hidden relative">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black flex items-center gap-3">
              <MapIcon className="w-6 h-6 text-blue-500" />
              Threat Distribution
            </h3>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> High Risk</span>
              <span className="flex items-center gap-2 text-slate-500"><div className="w-2 h-2 rounded-full bg-slate-700" /> Low Risk</span>
            </div>
          </div>
          
          {/* Simulated Map */}
          <div className="h-[300px] relative bg-slate-950/50 rounded-3xl flex items-center justify-center group">
            <Globe className="w-64 h-64 text-slate-900" />
            <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-red-500 rounded-full blur-md animate-pulse" />
            <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-red-500 rounded-full blur-md animate-pulse delay-500" />
            <div className="absolute bottom-1/3 left-1/2 w-5 h-5 bg-amber-500 rounded-full blur-md animate-pulse delay-700" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black uppercase text-blue-500 tracking-widest shadow-2xl">
                Global Surveillance Active
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-slate-900/30 border border-slate-800/50 p-10 rounded-[3rem] shadow-2xl">
          <h3 className="text-xl font-black mb-8 flex items-center gap-3">
            <Clock className="w-5 h-5 text-slate-500" />
            Live Audit Stream
          </h3>
          <div className="space-y-6">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-4 border-l-2 border-slate-800 pl-6 pb-2">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-black text-slate-200 line-clamp-1">{log.claim}</p>
                  <div className="flex justify-between items-center">
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                      log.verdict === 'REAL' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {log.verdict}
                    </span>
                    <span className="text-[10px] font-mono text-slate-700">#{log.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
