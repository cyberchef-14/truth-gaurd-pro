
import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, Chrome, ArrowRight, Loader2, ChevronLeft } from 'lucide-react';

interface AuthProps {
  onLogin: (user: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPass, setIsForgotPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate Auth Delay
    setTimeout(() => {
      onLogin({
        id: 'user_123',
        name: email.split('@')[0] || 'Agent',
        email: email,
        role: email.includes('admin') ? 'admin' : 'Analyst'
      });
      setIsLoading(false);
    }, 800);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        id: 'google_user',
        name: 'Google User',
        email: 'user@gmail.com',
        role: 'Analyst'
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      alert(`Recovery link transmitted to ${email}. Check your encrypted inbox.`);
      setIsForgotPass(false);
      setIsLoading(false);
    }, 1000);
  };

  if (isForgotPass) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617] relative overflow-hidden font-sans">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>
        </div>
        <div className="w-full max-w-md glass-panel border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative z-10">
          <button onClick={() => setIsForgotPass(false)} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest mb-8">
            <ChevronLeft className="w-4 h-4" /> Back to Login
          </button>
          <h2 className="text-3xl font-black tracking-tight mb-2">Reset Key</h2>
          <p className="text-slate-400 text-sm mb-8">Enter your registered email to receive a secure recovery sequence.</p>
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@truthguard.io"
                  className="w-full pl-12 pr-4 py-4 bg-black/40 border border-slate-700/30 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-100"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-900/20"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Recovery Link'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617] relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-md glass-panel border border-white/10 p-10 rounded-[3rem] shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="p-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] mb-6 shadow-2xl shadow-blue-500/20">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter">TruthGuard</h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Neural Integrity OS</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity (Email)</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@core.io"
                className="w-full pl-12 pr-4 py-4 bg-black/40 border border-slate-700/30 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Access Key</label>
              <button 
                type="button"
                onClick={() => setIsForgotPass(true)}
                className="text-[9px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest"
              >
                Forgot Key?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-black/40 border border-slate-700/30 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98]"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                {isRegistering ? 'Initialize Account' : 'Authenticate'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-800"></div>
          <span className="text-[9px] font-black uppercase text-slate-600 tracking-[0.2em]">External Link</span>
          <div className="h-px flex-1 bg-slate-800"></div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-4 rounded-2xl border border-slate-800 hover:bg-slate-800 flex items-center justify-center gap-3 transition-all font-black uppercase text-[10px] tracking-widest text-slate-300"
        >
          <Chrome className="w-5 h-5 text-blue-400" />
          Google Authentication
        </button>

        <p className="mt-8 text-center text-slate-500 text-xs font-medium">
          {isRegistering ? 'System already active?' : "New identity required?"}{' '}
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-500 font-black uppercase tracking-widest ml-1 hover:text-blue-400"
          >
            {isRegistering ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
