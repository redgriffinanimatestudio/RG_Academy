import React from 'react';
import { motion } from 'framer-motion';
import { Plus, LayoutDashboard, Search, Users, CreditCard } from 'lucide-react';

export default function ClientDashboard() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-white italic">Client <span className="text-primary">Console</span></h1>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-2">Manage your creative requests</p>
        </div>
        <button className="criativo-btn flex items-center gap-2">
          <Plus size={18} /> Post New Project
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
          <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">Active Projects</p>
          <p className="text-3xl font-black text-white mt-1">1</p>
        </div>
        <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
          <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">Talent Bids</p>
          <p className="text-3xl font-black text-white mt-1">12</p>
        </div>
        <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
          <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">Escrow Balance</p>
          <p className="text-3xl font-black text-white mt-1">$1,200</p>
        </div>
      </div>

      <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 min-h-[300px] flex flex-col items-center justify-center text-center">
        <div className="size-20 rounded-full bg-white/5 flex items-center justify-center mb-6 text-white/20">
          <LayoutDashboard size={40} />
        </div>
        <h3 className="text-xl font-black uppercase text-white">No active production tracking</h3>
        <p className="text-sm text-white/20 max-w-sm mt-2">Your projects will appear here once you hire a specialist from the Studio.</p>
      </div>
    </div>
  );
}
