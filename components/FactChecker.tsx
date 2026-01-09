
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Loader2, AlertCircle, CheckCircle2, Info, Share2, Fingerprint, ExternalLink, Image as ImageIcon, X, ShieldCheck, Download, Mic, Zap, Cpu, Activity, BrainCircuit } from 'lucide-react';
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
  const [isListening, setIsListening] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const demoScenarios = [
    { label: "Deepfake Context", text: "Leaked footage of world leaders discussing a secret moon base." },
    { label: "Viral Health Claim", text: "New study shows coffee causes immediate DNA mutation in adults." },
    { label: "Financial Panic", text: "Global markets to close permanently starting tomorrow at 4 PM." }
  ];

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setScanStep(prev => (prev + 1) % 4);
      }, 1500);
    } else {
      setScanStep(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleDownloadCertificate = useCallback(() => {
    if (!result) return;
    const certData = `TRUTHGUARD PRO VERIFICATION\nID: ${result.id}\nVerdict: ${result.verdict}\nHash: ${result.hash}`;
    const blob = new Blob([certData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TG-CERT-${result.id}.txt`;
    link.click();
  }, [result]);

  const handleCheck = async () => {
    if (!input.trim() && !image) return;
    setIsLoading(true);
    setError(null);
    try {
      const analysis = await analyzeClaim(input, image || undefined);
      const hashData = JSON.stringify({ ...analysis, input, image: !!image, t: Date.now() });
      const hash = await generateHash(hashData);
      
      const newLog: VerificationLog = {
        id: `TG-${Math.random().toString(36).toUpperCase().substr(2, 6)}`,
        timestamp: Date.now(),
        claim: input || "Visual Evidence Verification",
        verdict: analysis.verdict,
        confidence: analysis.confidence,
        explanation: analysis.explanation,
        sources: analysis.sources,
        hash: hash,
        votes: { agree: 0, disagree: 0 },
        fallacies: analysis.fallacies,
        reasoning_steps: analysis.reasoning_steps
      };

      saveLog(newLog);
      setResult(newLog);
    } catch (err: any) {
      setError(err.message);
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
    <div className="max-w-5xl mx-auto space-y-12 pb-24">
      {/* Search/Input Section */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group border-t-white/10">
        <div className="space-y-8 relative z-10">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Input intelligence for neural verification..."
            className="w-full h-32 bg-black/40 border border-slate-700/50 rounded-3xl p-8 text-2xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-800 resize-none font-medium text-slate-100"
          />
          <div className="flex flex-wrap items-center gap-4">
             {demoScenarios.map((s, i) => (
              <button key={i} onClick={() => setInput(s.text)} className="px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 hover:border-blue-500 text-[10px] font-black uppercase text-slate-500 hover:text-blue-400 transition-all">
                {s.label}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4">
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-all font-bold text-sm">
              <ImageIcon className="w-5 h-5 text-blue-400" />
              {image ? 'Media Loaded' : 'Attach Context'}
            </button>
            <input type="file" ref={fileInputRef} onChange={(e) => {
               const file = e.target.files?.[0];
               if (file) {
                 const reader = new FileReader();
                 reader.onloadend = () => setImage(reader.result as string);
                 reader.readAsDataURL(file);
               }
            }} className="hidden" accept="image/*" />
            <button
              onClick={handleCheck}
              disabled={isLoading || (!input.trim() && !image)}
              className="px-12 py-5 rounded-[2rem] bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black flex items-center gap-4 transition-all shadow-xl hover:scale-105 active:scale-95"
            >
              {isLoading ? <Loader2 className="w-7 h-7 animate-spin" /> : <ShieldCheck className="w-7 h-7" />}
              {isLoading ? 'Neural Processing...' : 'Verify Intelligence'}
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-8 animate-in slide-in-from-bottom-12 duration-700">
          <div className={`p-1 bg-gradient-to-br rounded-[3.5rem] shadow-2xl ${getVerdictStyles(result.verdict)}`}>
            <div className="bg-[#0b0f1a] rounded-[3.4rem] p-12 relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-7 space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="p-6 bg-slate-900 rounded-[2rem] border border-white/10">
                      <Zap className="w-12 h-12 text-blue-400" />
                    </div>
                    <div>
                      <h2 className={`text-6xl font-black italic tracking-tighter uppercase ${
                        result.verdict === Verdict.REAL ? 'text-emerald-400' :
                        result.verdict === Verdict.FAKE ? 'text-red-400' : 'text-amber-400'
                      }`}>
                        {result.verdict}
                      </h2>
                      <p className="text-slate-500 font-black uppercase text-xs tracking-widest">Global Integrity Verdict</p>
                    </div>
                  </div>

                  <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                    <h3 className="text-lg font-bold flex items-center gap-3 mb-4 text-blue-400 uppercase tracking-widest">
                      <BrainCircuit className="w-5 h-5" />
                      Neural Breakdown
                    </h3>
                    <p className="text-slate-200 leading-relaxed text-xl italic font-medium">"{result.explanation}"</p>
                    
                    {result.fallacies && result.fallacies.length > 0 && (
                      <div className="mt-8 flex flex-wrap gap-2">
                        {result.fallacies.map((f, i) => (
                          <span key={i} className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-black uppercase tracking-tighter">
                            Logical Fallacy: {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                    <h3 className="font-black text-xs uppercase tracking-widest text-slate-500 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Reasoning Path
                    </h3>
                    <div className="space-y-4">
                      {result.reasoning_steps?.map((step, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <div className="w-px flex-1 bg-slate-800 my-1" />
                          </div>
                          <p className="text-[11px] font-bold text-slate-400 leading-tight uppercase tracking-tight">{step}</p>
                        </div>
                      ))}
                    </div>
                    <button onClick={handleDownloadCertificate} className="w-full py-5 bg-blue-600 rounded-[1.5rem] text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-500 transition-all">
                      <Download className="w-4 h-4" />
                      Export Integrity Cert
                    </button>
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
