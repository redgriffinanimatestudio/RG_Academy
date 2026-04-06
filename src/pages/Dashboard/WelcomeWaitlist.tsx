import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, Clock, Globe, Shield, Activity, UserCheck } from 'lucide-react';

export default function WelcomeWaitlist() {
  const { user, profile } = useAuth();
  
  const pathName = user?.selectedPath || 'STUDENT';
  const sectorColor = pathName === 'STUDIO' ? 'text-emerald-500' : 'text-primary';

  return (
    <div className="min-h-screen bg-canvas-industrial flex items-center justify-center p-6 relative overflow-hidden">
      {/* Industrial Background Elements */}
      <div className="absolute inset-0 matrix-grid-bg opacity-20" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-raycast/5 rounded-full blur-[100px] -z-10" />

      <div className="glass-pro-max w-full max-w-4xl p-12 relative overflow-hidden animate-in fade-in zoom-in duration-700">
        <div className="absolute top-0 right-0 p-8">
           <Activity className="w-8 h-8 text-white/5 animate-pulse" />
        </div>

        <div className="grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white/40 uppercase tracking-widest">
                 <Shield className="w-3 h-3" />
                 Protocol status: Industrializing
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Welcome to the <br />
                <span className={sectorColor}>{pathName} SECTOR</span>
              </h1>
              <p className="text-lg text-white/60 leading-relaxed max-w-md">
                Your professional identity has been successfully registered on the grid. We are currently performing industrial verification of your credentials.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Identity Verified</div>
                  <div className="text-xs text-white/30">Registry node created: {user?.id.slice(0, 8)}...</div>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                   <Clock className="w-5 h-5 text-primary animate-spin-slow" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Grid Synchronization Pending</div>
                  <div className="text-xs text-white/30">Your access is being calibrated for {pathName} tools 24/48h max.</div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-6">
                <div className="flex -space-x-3">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-full h-full object-cover grayscale opacity-50" alt="" />
                     </div>
                   ))}
                </div>
                <div className="text-xs text-white/40 italic">
                   +142 users waiting synchronization
                </div>
            </div>
          </div>

          <div className="md:col-span-5 bg-white/5 rounded-3xl border border-white/10 p-8 space-y-6 relative group overflow-hidden">
             <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             
             <div className="relative z-10 text-center space-y-4">
                <Globe className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
                <h3 className="text-xl font-bold text-white">Industrial Verification</h3>
                <p className="text-xs text-white/50 leading-relaxed">
                   Red Griffin Academy manually approves each elite specialist to ensure the highest standards of production and synergy within our ecosystem.
                </p>
                <div className="pt-4">
                   <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                      <div className="bg-primary h-full w-[65%] animate-pulse" />
                   </div>
                   <div className="flex justify-between mt-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                      <span>Analyzing Role</span>
                      <span>65% Complete</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="mt-12 pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
             Red Griffin AI Control © 2026
          </div>

          {process.env.NODE_ENV === 'development' && (
            <button 
              onClick={async () => {
                const token = localStorage.getItem('token');
                await fetch('/api/auth/dev/activate', {
                  method: 'POST',
                  headers: { 'Authorization': `Bearer ${token}` }
                });
                window.location.reload();
              }}
              className="px-4 py-2 bg-white/5 border border-white/10 text-[10px] text-primary font-bold uppercase tracking-widest hover:bg-primary/20 transition-all rounded-sm"
            >
              [Dev] Simulate Activation
            </button>
          )}

          <div className="flex gap-8">
             <span className="text-[10px] font-bold text-white/40 hover:text-white transition-colors cursor-pointer tracking-widest uppercase">Support Center</span>
             <span className="text-[10px] font-bold text-white/40 hover:text-white transition-colors cursor-pointer tracking-widest uppercase">Network Status</span>
          </div>
        </div>
      </div>
    </div>
  );
}
