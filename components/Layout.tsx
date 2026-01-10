
import React, { useState } from 'react';
import { ShieldCheck, LayoutDashboard, History, Settings, LogOut, Terminal, Bell, User as UserIcon, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, user, onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const navItems = [
    { id: 'check', label: 'Neural Checker', icon: ShieldCheck },
    { id: 'dashboard', label: 'Truth Pulse', icon: LayoutDashboard },
    { id: 'history', label: 'Integrity Logs', icon: History },
  ];

  const notifications = [
    { id: 1, text: "High-priority verification complete.", type: 'success', time: '2m ago' },
    { id: 2, text: "Unusual bot activity in regional node.", type: 'alert', time: '15m ago' },
    { id: 3, text: "System firmware updated to v2.5.1", type: 'info', time: '1h ago' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#020617] text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 flex flex-col bg-slate-950 shadow-2xl z-30">
        <div className="p-8 flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg shadow-blue-500/20">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              TruthGuard
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">v2.5 PRO</span>
            </div>
          </div>
        </div>

        <div className="px-6 mb-8">
           <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Neural Health</p>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full w-[94%] bg-gradient-to-r from-blue-600 to-emerald-500" />
              </div>
           </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 group ${
                activeTab === item.id 
                ? 'bg-white/5 text-blue-400 border border-white/10' 
                : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'scale-110' : ''}`} />
              <span className="font-black uppercase text-xs tracking-[0.15em]">{item.label}</span>
              {activeTab === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 bg-slate-950/80">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/40 border border-white/5 mb-6 group cursor-pointer hover:bg-slate-900/60 transition-all">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-xl shadow-lg uppercase">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-white truncate tracking-tight uppercase">{user.name}</p>
              <p className="text-[10px] text-slate-500 truncate font-black uppercase tracking-widest">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/10"
          >
            <LogOut className="w-4 h-4" />
            Sign Out System
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-[#020617]">
        <div className="absolute top-0 left-0 w-full h-96 bg-blue-600/5 blur-[80px] pointer-events-none" />
        
        <header className="sticky top-0 z-40 px-12 py-6 border-b border-white/5 backdrop-blur-md bg-slate-950/40 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs font-black text-slate-500 uppercase tracking-widest">
               <Terminal className="w-4 h-4 text-blue-500" />
               <span className="opacity-60">TruthGuard_OS_2.5</span>
               <div className="h-4 w-px bg-slate-800 ml-2" />
               <span className="text-emerald-500 font-mono text-[10px] animate-pulse">L-LINK_READY</span>
            </div>
            <div className="flex items-center gap-6 relative">
               <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowSettings(false); }}
                className={`relative p-2 transition-colors ${showNotifications ? 'text-blue-400 bg-white/5 rounded-xl' : 'text-slate-500 hover:text-white'}`}
               >
                  <Bell className="w-5 h-5" />
                  <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#020617]" />
               </button>

               <button 
                onClick={() => { setShowSettings(!showSettings); setShowNotifications(false); }}
                className={`p-2 transition-colors ${showSettings ? 'text-blue-400 bg-white/5 rounded-xl' : 'text-slate-500 hover:text-white'}`}
               >
                  <Settings className="w-5 h-5" />
               </button>

               {/* Notification Panel */}
               {showNotifications && (
                 <div className="absolute top-full mt-4 right-14 w-80 glass-panel border border-white/10 rounded-3xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200 z-50">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xs font-black uppercase tracking-widest">Neural Intel</h3>
                      <button onClick={() => setShowNotifications(false)}><X className="w-4 h-4 text-slate-500" /></button>
                    </div>
                    <div className="space-y-4">
                      {notifications.map(n => (
                        <div key={n.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex gap-3 items-start group hover:bg-white/10 transition-colors">
                          {n.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
                          <div className="flex-1">
                            <p className="text-[11px] font-bold text-slate-300 leading-tight">{n.text}</p>
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1 block">{n.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>
               )}

               {/* Settings Panel */}
               {showSettings && (
                 <div className="absolute top-full mt-4 right-0 w-80 glass-panel border border-white/10 rounded-3xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200 z-50">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xs font-black uppercase tracking-widest">OS Settings</h3>
                      <button onClick={() => setShowSettings(false)}><X className="w-4 h-4 text-slate-500" /></button>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Night Scan Mode</span>
                        <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                          <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-lg" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fast Audio Decode</span>
                        <div className="w-10 h-5 bg-slate-700 rounded-full relative">
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-lg" />
                        </div>
                      </div>
                      <button className="w-full py-3 bg-white/5 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white/10 transition-colors">
                        Re-calibrate Neural Model
                      </button>
                    </div>
                 </div>
               )}
            </div>
        </header>

        <div className="max-w-7xl mx-auto p-12">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
