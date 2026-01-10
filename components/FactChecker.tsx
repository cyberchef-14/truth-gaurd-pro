import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Loader2, AlertCircle, CheckCircle2, Info, Share2, Fingerprint, ExternalLink, Image as ImageIcon, X, ShieldCheck, Download, Mic, Zap, Cpu, Activity, BrainCircuit, ShieldAlert } from 'lucide-react';
import { analyzeClaim } from '../services/geminiService';
import { generateHash } from '../services/cryptoService';
import { saveLog } from '../services/mockDatabase';
import { Verdict, VerificationLog } from '../types';

const FactChecker: React.FC = () => {
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationLog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanStep, setScanStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const demoScenarios = [
    { label: "Deepfake Check", text: "Leaked footage shows a world leader using a voice modulator to hide their identity in a recent interview." },
    { label: "Health Misinfo", text: "Drinking hot water with silver particles completely neutralizes all synthetic toxins in the blood." },
    { label: "Market Panic", text: "Major central bank to freeze all withdrawals for 48 hours starting tonight." }
  ];

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setScanStep(prev => (prev + 1) % 4);
      }, 400); // Even faster feedback
    } else {
      setScanStep(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleDownloadCertificate = useCallback(() => {
    if (!result) return;
    const certContent = `
TRUTHGUARD VERIFICATION CERTIFICATE
====================================
ID: ${result.id}
DATE: ${new Date(result.timestamp).toUTCString()}
VERDICT: ${result.verdict}
CONFIDENCE: ${result.confidence}%

CLAIM:
${result.claim}

AI EXPLANATION:
${result.explanation}

HASH: ${result.hash}
====================================
    `.trim();

    const blob = new Blob([certContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TruthGuard-Cert-${result.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [result]);

  const handleCheck = async () => {
    if (!input.trim() && !image) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const analysis = await analyzeClaim(input, image || undefined);
      
      if (!analysis || !analysis.verdict) {
        throw new Error("Audit failed: Neural engine returned an empty response.");
      }

      const hashData = JSON.stringify({ ...analysis, input, image: !!image, t: Date.now() });
      const hash = await generateHash(hashData);
      
      const newLog: VerificationLog = {
        id: `TG-${Math.random().toString(36).toUpperCase().substr(2, 6)}`,
        timestamp: Date.now(),
        claim: input || "Visual/Context Analysis",
        verdict: analysis.verdict,
        confidence: analysis.confidence || 0,
        explanation: analysis.explanation || "No detailed explanation provided.",
        sources: analysis.sources || [],
        hash: hash,
        votes: { agree: 0, disagree: 0 },
        fallacies: analysis.fallacies || [],
        reasoning_steps: analysis.reasoning_steps || ["Direct neural scan complete."]
      };

      saveLog(newLog);
      setResult(newLog);
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(err.message || "The neural link encountered an unexpected interruption. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getVerdictStyles = (verdict: Verdict) => {
    switch (verdict) {
      case Verdict.REAL: return 'from-emerald-500/20 to-emerald-900/20 text-emerald-400 border-emerald-500/30';
      case Verdict.FAKE: return 'from-red-500/20 to-red-900/20 text-red-400 border-red-500/30';
      case Verdict.MIXED: return 'from-amber-500/20 to-amber-900/20 text-amber-400 border-amber-500/30';
      default: return 'from-slate-500/20 to-slate-900/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 will-change-transform font-sans">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] font-black tracking-widest uppercase">
          <Cpu className="w-3 h-3" />
          Neural Link Hyper-Speed
        </div>
        <h1 className="text-6xl font-black tracking-tighter leading-none bg-gradient-to-b from-slate-100 to-slate-500 bg-clip-text text-transparent dark:from-white">
          Reality Audit
        </h1>
      </div>

      <div className="glass-panel border rounded-[3rem] p-10 shadow-2xl relative overflow-hidden dark:bg-slate-900/40 border-slate-200 dark:border-white/5">
        <div className="space-y-8 relative z-10">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Transmit data for rapid integrity check..."
            className="w-full h-32 bg-black/5 dark:bg-black/40 border border-slate-200 dark:border-slate-700/50 rounded-3xl p-8 text-2xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-800 resize-none font-medium dark:text-slate-100"
          />
          <div className="flex flex-wrap items-center gap-3">
             <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mr-2">Core Presets:</span>
             {demoScenarios.map((s, i) => (
              <button key={i} onClick={() => setInput(s.text)} className="px-4 py-2 rounded-xl border transition-all text-[10px] font-black uppercase text-slate-500 hover:text-blue-500 bg-slate-50 border-slate-200 dark:bg-white/5 dark:border-white/5 dark:hover:border-blue-500/50">
                {s.label}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-4">
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all font-bold text-sm bg-slate-50 border-slate-200 dark:bg-white/5 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10">
                <ImageIcon className="w-5 h-5 text-blue-400" />
                {image ? 'Media Captured' : 'Visual Context'}
              </button>
              <input type="file" ref={fileInputRef} onChange={(e) => {
                 const file = e.target.files?.[0];
                 if (file) {
                   const reader = new FileReader();
                   reader.onloadend = () => setImage(reader.result as string);
                   reader.readAsDataURL(file);
                 }
              }} className="hidden" accept="image/*" />
            </div>
            <button
              onClick={handleCheck}
              disabled={isLoading || (!input.trim() && !image)}
              className="px-12 py-5 rounded-[2rem] bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black flex items-center gap-4 transition-all shadow-xl hover:scale-[1.02] active:scale-95 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
              {isLoading ? <Loader2 className="w-7 h-7 animate-spin" /> : <ShieldCheck className="w-7 h-7" />}
              {isLoading ? 'Decrypting...' : 'Initiate Audit'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-center gap-4 text-red-400 animate-in slide-in-from-top-4">
          <ShieldAlert className="w-6 h-6 shrink-0" />
          <p className="text-sm font-bold">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-xs uppercase font-black hover:underline">Dismiss</button>
        </div>
      )}

      {isLoading && (
         <div className="flex flex-col items-center gap-6 animate-pulse">
            <div className="flex gap-2">
               {[0, 1, 2, 3].map(i => (
                 <div key={i} className={`h-1.5 w-16 rounded-full transition-all duration-300 ${scanStep === i ? 'bg-blue-500 scale-x-110 shadow-lg shadow-blue-500/50' : 'bg-slate-200 dark:bg-slate-800'}`} />
               ))}
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Turbo Verifying Stream...</p>
         </div>
      )}

      {result && !isLoading && (
        <div className="space-y-8 animate-in slide-in-from-bottom-12 duration-500">
          <div className={`p-1 bg-gradient-to-br rounded-[3.5rem] shadow-2xl ${getVerdictStyles(result.verdict)}`}>
            <div className="bg-white dark:bg-[#0b0f1a] rounded-[3.4rem] p-12 relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
                <div className="lg:col-span-7 space-y-8">
                  <div className="flex items-center gap-6">
                    <div className={`p-6 rounded-[2rem] border shadow-inner ${
                      result.verdict === Verdict.REAL ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                      result.verdict === Verdict.FAKE ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                      'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    }`}>
                      {result.verdict === Verdict.REAL ? <CheckCircle2 className="w-12 h-12" /> : <AlertCircle className="w-12 h-12" />}
                    </div>
                    <div>
                      <h2 className={`text-6xl font-black italic tracking-tighter uppercase ${
                        result.verdict === Verdict.REAL ? 'text-emerald-500' :
                        result.verdict === Verdict.FAKE ? 'text-red-500' : 'text-amber-500'
                      }`}>
                        {result.verdict}
                      </h2>
                      <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.3em]">Integrity Audit Result</p>
                    </div>
                  </div>

                  <div className="bg-black/[0.03] dark:bg-white/[0.03] p-8 rounded-[2.5rem] border border-black/5 dark:border-white/5">
                    <h3 className="text-sm font-black flex items-center gap-3 mb-6 text-blue-500 uppercase tracking-widest">
                      <BrainCircuit className="w-5 h-5" />
                      Neural Breakdown
                    </h3>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-xl font-medium italic">"{result.explanation}"</p>
                    
                    {result.fallacies && result.fallacies.length > 0 && (
                      <div className="mt-8 flex flex-wrap gap-2">
                        {result.fallacies.map((f, i) => (
                          <span key={i} className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[9px] font-black uppercase tracking-widest">
                            Logical Fallacy: {f}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Grounding Sources Section - Mandatory for queries using the Google Search tool */}
                    {result.sources && result.sources.length > 0 && (
                      <div className="mt-10 pt-8 border-t border-black/5 dark:border-white/5 space-y-4">
                        <h3 className="text-xs font-black flex items-center gap-3 text-slate-500 uppercase tracking-widest">
                          <ExternalLink className="w-4 h-4" />
                          Verification Grounds
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {result.sources.map((source, i) => (
                            <a 
                              key={i} 
                              href={source.uri} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-3 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl flex items-center justify-between hover:bg-blue-500/10 hover:border-blue-500/20 transition-all group"
                            >
                              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 truncate pr-4">{source.title}</span>
                              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-500 shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-slate-50 dark:bg-slate-900/80 p-8 rounded-[2.5rem] border border-black/5 dark:border-white/5 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Verification Path
                      </h3>
                      <span className="text-2xl font-black text-slate-800 dark:text-white">{result.confidence}%</span>
                    </div>
                    
                    <div className="space-y-4">
                      {result.reasoning_steps.map((step, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <div className="w-px flex-1 bg-slate-300 dark:bg-slate-800 my-1" />
                          </div>
                          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">{step}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 flex flex-col gap-3">
                      <button 
                        onClick={handleDownloadCertificate}
                        className="w-full py-5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all border border-black/5 dark:border-white/10 dark:text-white"
                      >
                        <Download className="w-4 h-4" />
                        Export Audit Certificate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FactChecker;