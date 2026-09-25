import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, Sparkles, ArrowRight, Lock, Mail, ShieldCheck, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, loginAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      navigate('/workspace');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestClick = () => {
    loginAsGuest();
    navigate('/workspace');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Ambient Radial Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-slate-900/80 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl relative z-10">
        
        {/* Left Hero Column */}
        <div className="p-8 lg:p-10 bg-gradient-to-br from-slate-900 via-[#0B0F19] to-slate-950 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/30">
                <div className="w-full h-full bg-[#0B0F19] rounded-[14px] flex items-center justify-center">
                  <Network className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <div>
                <h1 className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-300 bg-clip-text text-transparent">
                  InsightMesh AI
                </h1>
                <p className="text-xs text-slate-400 font-mono">Multi-Model Evidence Synthesizer</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold leading-tight tracking-tight text-white mb-3">
              Automated Cross-Document Knowledge Graphs
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Synthesize complex research PDFs & papers in seconds. Extract key entity relationships, verify claim confidence scores, and navigate visual evidence trees.
            </p>

            {/* Feature Highlights */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Visual Relationship Synthesis instead of wall-of-text</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Evidence Traceability to exact paragraph citations</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                <Cpu className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Powered by Google Gemini 3 Flash & Pro Engines</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
            InsightMesh Engine v3.6 • Ready for Instant Research Synthesis
          </div>
        </div>

        {/* Right Form Column */}
        <div className="p-8 lg:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white">
              {isRegister ? 'Create Researcher Account' : 'Welcome Back'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isRegister ? 'Sign up to build your cross-document library' : 'Sign in to access your knowledge workspace'}
            </p>
          </div>

          {error && (
            <div className="mb-4 text-xs text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="researcher@university.edu"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle between Login / Register */}
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-xs text-slate-400 hover:text-cyan-400 font-medium transition-colors"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
            <span className="relative bg-slate-900 px-3 text-[10px] text-slate-500 uppercase tracking-widest font-mono">Or</span>
          </div>

          {/* Instant Guest Mode Button */}
          <button
            onClick={handleGuestClick}
            className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-semibold text-xs transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Explore Demo Mode (Instant Guest)
          </button>

        </div>

      </div>
    </div>
  );
}
