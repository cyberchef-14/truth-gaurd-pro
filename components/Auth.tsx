
import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, Chrome, ArrowRight, Loader2 } from 'lucide-react';

interface AuthProps {
  onLogin: (user: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate Firebase Auth
    setTimeout(() => {
      onLogin({
        id: 'user_123',
        name: email.split('@')[0],
        email: email,
        role: email.includes('admin') ? 'admin' : 'user'
      });
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-2xl border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl mb-4 shadow-lg shadow-blue-500/20">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">TruthGuard</h1>
          <p className="text-slate-400 text-sm mt-2">AI Misinformation Detection Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/40 active:scale-[0.98]"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                {isRegistering ? 'Create Account' : 'Sign In'}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="my-8 flex items-center gap-4 text-slate-600">
          <div className="h-px flex-1 bg-slate-800"></div>
          <span className="text-xs font-bold uppercase tracking-widest">Or continue with</span>
          <div className="h-px flex-1 bg-slate-800"></div>
        </div>

        <button className="w-full py-4 rounded-2xl border border-slate-700 hover:bg-slate-800 flex items-center justify-center gap-3 transition-all font-semibold">
          <Chrome className="w-5 h-5" />
          Google
        </button>

        <p className="mt-8 text-center text-slate-500 text-sm">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-400 font-bold hover:underline"
          >
            {isRegistering ? 'Login' : 'Register now'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
