import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Network, FileText, Cpu, LogOut, ShieldAlert, Sparkles, UploadCloud } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenUpload }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/workspace" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
              <Network className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-300 bg-clip-text text-transparent">
                InsightMesh
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                AI v3.6
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Cross-Document Evidence Synthesizer</p>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <Link
            to="/workspace"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              isActive('/workspace')
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Network className="w-4 h-4" />
            Graph Workspace
          </Link>

          <Link
            to="/dashboard"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              isActive('/dashboard')
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            Documents Library
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Gemini AI Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono">
            <Cpu className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>Gemini 3 Flash/Pro</span>
          </div>

          {/* Quick Upload Button */}
          {onOpenUpload && (
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all hover:scale-105 active:scale-95"
            >
              <UploadCloud className="w-4 h-4 text-cyan-400" />
              <span>Upload PDF/TXT</span>
            </button>
          )}

          {/* User Profile / Logout */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-medium text-slate-200 truncate max-w-[120px]">{user.email}</p>
                <p className="text-[10px] text-cyan-400 font-mono">{user.isGuest ? 'Guest Session' : 'Verified User'}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                title="Sign Out"
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              Sign In
            </Link>
          )}

        </div>

      </div>
    </nav>
  );
}
