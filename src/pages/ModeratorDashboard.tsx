import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, AlertCircle, CheckCircle, XCircle, Trash2, 
  Ban, ShieldAlert, Eye, Search, Filter, MoreVertical, 
  TrendingUp, Activity, UserCheck, ShieldCheck, Mail, 
  MessageSquare, Settings, Lock, Clock, Globe, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function ModeratorDashboardContent({ activeModule, accentColor }: any) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeModule}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="space-y-6"
      >
        {activeModule === 'dashboard' && <ModeratorOverview accent={accentColor} />}
        {activeModule === 'complaints' && <ModeratorComplaints accent={accentColor} />}
        {activeModule === 'reviews' && <ModeratorReviews accent={accentColor} />}
        {activeModule === 'verification' && <ModeratorVerification accent={accentColor} />}
        {activeModule === 'analytics' && <ModeratorAnalytics accent={accentColor} />}
        {activeModule === 'mass_actions' && <ModeratorMassActions accent={accentColor} />}
        
        {!['dashboard', 'complaints', 'reviews', 'verification', 'analytics', 'mass_actions'].includes(activeModule) && (
          <div className="flex flex-col items-center justify-center py-40 opacity-20">
            <ShieldAlert size={64} className="mb-6" style={{ color: accentColor }} />
            <h2 className="text-xl font-black uppercase tracking-[0.5em]">{activeModule.replace(/_/g, ' ')} Module</h2>
            <p className="text-xs mt-2 uppercase tracking-widest">Active Safety Node Operational</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function StatCard({ label, value, sub, icon: Icon, accent, trend }: any) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-3xl p-6 space-y-4 group hover:border-white/10 transition-all shadow-2xl">
      <div className="flex justify-between items-start">
        <div className="text-[10px] font-black text-white/20 uppercase tracking-widest group-hover:text-white/40 transition-colors">{label}</div>
        <Icon size={18} style={{ color: accent }} className="opacity-40 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="text-3xl font-black text-white tracking-tighter">{value}</div>
      <div className="flex items-center gap-2">
        <span className={`text-[10px] font-bold uppercase tracking-widest ${trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-rose-500' : 'text-white/20'}`}>
          {sub}
        </span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }} 
          animate={{ width: '70%' }} 
          className="h-full" 
          style={{ background: accent }} 
        />
      </div>
    </div>
  );
}

function ModeratorOverview({ accent }: any) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Reports" value="12" sub="5 critical priority" icon={AlertCircle} accent="#ef4444" trend="down" />
        <StatCard label="Reviews Removed" value="8" sub="this month" icon={Trash2} accent={accent} trend="neu" />
        <StatCard label="Users Banned" value="3" sub="this week" icon={Ban} accent="#ef4444" trend="neu" />
        <StatCard label="Response Time" value="1.8h" sub="↑ 20% faster" icon={Clock} accent="#10b981" trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
              <Shield size={20} style={{ color: accent }} /> Urgent Safety Queue
            </h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">View All Queue</button>
          </div>
          
          <div className="space-y-4">
            {[
              { id: '1042', user: 'user_042', reason: 'Insulting Content', content: 'Course is a waste of money, instructor is clueless...', priority: 'high' },
              { id: '9977', user: 'spam_bot_77', reason: 'Spam Activity', content: 'Buy cheap here: [external link] (x14 times)', priority: 'high' }
            ].map((report, i) => (
              <div key={i} className={`p-6 bg-white/[0.02] border rounded-3xl space-y-4 group transition-all ${report.priority === 'high' ? 'border-red-500/20 hover:border-red-500/40' : 'border-white/5 hover:border-white/10'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-[10px] font-black uppercase" style={{ color: report.priority === 'high' ? '#ef4444' : accent }}>{report.user.charAt(0)}</div>
                    <div>
                      <div className="text-sm font-black text-white uppercase tracking-tight">{report.user}</div>
                      <div className="text-[9px] text-white/40 font-bold uppercase mt-0.5">UID: {report.id} · {report.reason}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-[9px] font-black uppercase text-red-500 hover:bg-red-500 hover:text-white transition-all">Remove</button>
                    <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase text-white/40 hover:text-white transition-all">Ignore</button>
                  </div>
                </div>
                <div className="p-4 bg-black/40 rounded-2xl border-l-2 border-red-500/40 italic text-xs text-white/60 leading-relaxed">
                  "{report.content}"
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Audit Timeline</h3>
            <div className="space-y-6">
              {[
                { time: '14:32', action: 'User Banned', detail: 'spam_user_042', color: '#ef4444' },
                { time: '13:55', action: 'Review Deleted', detail: 'Houdini FX Vol.2', color: '#f59e0b' },
                { time: '12:18', action: 'Course Approved', detail: 'Maya Rigging', color: '#10b981' }
              ].map((log, i) => (
                <div key={i} className="flex gap-4">
                  <div className="text-[10px] font-black text-white/20 pt-1">{log.time}</div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: log.color }}>{log.action}</div>
                    <div className="text-xs font-bold text-white/40">{log.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Safety Engine</span>
            </div>
            <p className="text-[10px] text-white/20 leading-relaxed font-black uppercase">AI models are currently monitoring 142 active discussions with 99.2% accuracy.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModeratorComplaints({ accent }: any) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input className="w-full bg-[#111] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest focus:border-red-500/40 outline-none transition-all" placeholder="Search reports..." />
          </div>
          <button className="p-3 bg-[#111] border border-white/5 rounded-2xl text-white/40 hover:text-white transition-all"><Filter size={18} /></button>
        </div>
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
          <button className="px-4 py-2 bg-white/10 rounded-lg text-[9px] font-black uppercase">Pending (5)</button>
          <button className="px-4 py-2 text-white/40 rounded-lg text-[9px] font-black uppercase">In Review (4)</button>
          <button className="px-4 py-2 text-white/40 rounded-lg text-[9px] font-black uppercase">Closed (3)</button>
        </div>
      </div>

      <div className="grid gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 group hover:border-white/10 transition-all shadow-xl">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center font-black text-red-500">U{i}</div>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-tight">Reported Review #{i}920</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-black text-red-500/60 uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded-md">Harassment</span>
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">2h ago by System AI</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-black/40 rounded-3xl border border-white/5 italic text-xs text-white/60">
                  "This course is completely useless. The instructor doesn't know what they are talking about..."
                </div>
              </div>
              <div className="flex flex-col gap-2 justify-center min-w-[160px]">
                <button className="w-full py-3 bg-red-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all">Remove Content</button>
                <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase text-white/60 hover:text-white transition-all">Ban User</button>
                <button className="w-full py-3 text-[9px] font-black uppercase text-white/20 hover:text-white/40 transition-all">Ignore Report</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModeratorReviews({ accent }: any) {
  return <div className="p-20 text-center opacity-20 font-black uppercase tracking-widest">Global Review Stream Initializing...</div>;
}

function ModeratorVerification({ accent }: any) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-white/5 bg-black/20 flex items-center justify-between">
        <h3 className="text-[11px] font-black uppercase tracking-widest">Expert Verification Queue</h3>
        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">4 Pending Requests</span>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-black/20 text-[9px] font-black text-[#555] uppercase tracking-widest">
            <th className="px-8 py-5">Identity Candidate</th>
            <th className="px-8 py-5">Verification Type</th>
            <th className="px-8 py-5">Artifacts</th>
            <th className="px-8 py-5 text-right">Decision</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {[
            { name: 'Satoshi K.', role: 'Lecturer', type: 'ID Verification', doc: 'passport.pdf' },
            { name: 'Alice B.', role: 'Expert', type: 'Portfolio Audit', doc: 'artstation_link' }
          ].map((item, i) => (
            <tr key={i} className="hover:bg-white/[0.01] transition-colors group">
              <td className="px-8 py-6">
                <div className="text-xs font-black text-white uppercase tracking-tight">{item.name}</div>
                <div className="text-[9px] text-[#555] font-black uppercase mt-0.5 tracking-widest">{item.role}</div>
              </td>
              <td className="px-8 py-6"><span className="pill amber text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full">{item.type}</span></td>
              <td className="px-8 py-6 text-[10px] font-black text-primary hover:underline cursor-pointer uppercase tracking-widest">{item.doc}</td>
              <td className="px-8 py-6 text-right">
                <div className="flex justify-end gap-2">
                  <button className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[9px] font-black uppercase text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all">Approve</button>
                  <button className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[9px] font-black uppercase text-rose-500 hover:bg-rose-500 hover:text-white transition-all">Reject</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ModeratorAnalytics({ accent }: any) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Intrusion Attempts" value="0" sub="Protection Active" icon={Lock} accent="#10b981" trend="up" />
        <StatCard label="Spam Density" value="12%" sub="↓ 5% Today" icon={Activity} accent="#f59e0b" trend="down" />
        <StatCard label="Trusted Users" value="94%" sub="Community Growth" icon={UserCheck} accent="#378add" trend="up" />
        <StatCard label="AI Filter Accuracy" value="99.2%" sub="Gemini 2.0 Core" icon={Zap} accent="#7f77dd" trend="neu" />
      </div>
      
      <div className="bg-[#111] border border-white/5 rounded-[3rem] p-10 space-y-8 shadow-2xl">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black uppercase tracking-tight">Security Incident Map (24h)</h3>
          <div className="flex gap-2">
            <div className="flex items-center gap-2"><div className="size-2 rounded-full bg-blue-500" /><span className="text-[8px] font-black uppercase text-white/40">Routine Audit</span></div>
            <div className="flex items-center gap-2"><div className="size-2 rounded-full bg-red-500" /><span className="text-[8px] font-black uppercase text-white/40">Blocked Attack</span></div>
          </div>
        </div>
        
        <div className="h-64 flex items-end gap-4">
          {[20, 35, 15, 80, 45, 10, 25, 60, 30, 70, 40, 50].map((h, i) => (
            <motion.div 
              key={i} 
              initial={{ height: 0 }} 
              animate={{ height: `${h}%` }} 
              className={`flex-1 rounded-t-xl group relative ${h > 75 ? 'bg-red-500/40 border-t-2 border-red-500' : 'bg-blue-500/20 border-t-2 border-blue-500'}`}
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase">
                {h} Incidents
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="flex justify-between text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
          <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:59</span>
        </div>
      </div>
    </div>
  );
}

function ModeratorMassActions({ accent }: any) {
  return (
    <div className="space-y-8">
      <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
        <h3 className="text-xl font-black uppercase tracking-tight">Mass Action Selection Matrix</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Content Domain</label>
            <select className="w-full bg-[#181818] border border-white/5 rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary/40 transition-all">
              <option>Global Review Stream</option>
              <option>Chat Message History</option>
              <option>User Directory</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Anomaly Signature</label>
            <select className="w-full bg-[#181818] border border-white/5 rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary/40 transition-all">
              <option>Textual Similarity (Spam)</option>
              <option>IP Address Conflict</option>
              <option>Temporal Cluster (Bot)</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full py-4 bg-primary text-bg-dark rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">Analyze Cluster</button>
          </div>
        </div>
      </div>
      
      <div className="bg-[#111] border border-dashed border-white/5 rounded-[3rem] p-20 text-center space-y-6">
        <Zap size={64} className="mx-auto text-white/5" />
        <div className="space-y-2">
          <h4 className="text-xl font-black text-white/20 uppercase tracking-tight">Selection Cluster Empty</h4>
          <p className="text-[10px] text-white/10 font-black uppercase tracking-widest">Execute analysis to identify potential mass-action targets</p>
        </div>
      </div>
    </div>
  );
}
