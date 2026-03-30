import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  FileText, 
  Clock, 
  Wallet, 
  PieChart, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const FIN_Operations: React.FC = () => {
  const transactions = [
    { id: 1, type: 'Escrow Receive', amount: '+ $12,400', status: 'Pending', date: 'March 28' },
    { id: 2, type: 'Revenue Share', amount: '- $4,200', status: 'Settled', date: 'March 25' },
    { id: 3, type: 'Contract #991', amount: '+ $5,000', status: 'Settled', date: 'March 22' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3">
            <DollarSign size={28} className="text-amber-400" />
            FINANCIAL CONTROL
          </h2>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">Escrow Management & Unified Revenue Architecture</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
             <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Treasury Balance</p>
             <p className="text-xl font-black tracking-tighter text-amber-400">$142,500.00</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-amber-400 text-bg-dark rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-amber-400/20 hover:scale-105 transition-all">
            <ArrowUpRight size={16} /> generate report
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Transaction History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/[0.03] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl">
             <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-black/40">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-2">
                  <Clock size={12} /> Recent Transactions
                </h3>
                <Link to="#" className="text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-amber-400 transition-colors">View All Ledger</Link>
             </div>
             <div className="p-4 space-y-2">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/[0.02] border border-transparent hover:border-white/5 group transition-all">
                    <div className={`size-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${tx.amount.startsWith('+') ? 'bg-emerald-400/10 text-emerald-400' : 'bg-amber-400/10 text-amber-400'}`}>
                      {tx.amount.startsWith('+') ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold tracking-tight">{tx.type}</h4>
                      <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{tx.date} · TXN-ID-{tx.id}x99</p>
                    </div>
                    <div className="text-right">
                       <p className={`text-sm font-black italic tracking-tighter ${tx.amount.startsWith('+') ? 'text-emerald-400' : 'text-amber-400'}`}>{tx.amount}</p>
                       <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{tx.status}</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Analytics Sidebar */}
        <div className="space-y-6">
           <section className="bg-zinc-950 border border-white/5 p-6 rounded-3xl relative overflow-hidden group">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-6 flex items-center justify-between">
                <span>REVENUE SHARE %</span>
                <PieChart size={12} />
              </h3>
              <div className="space-y-4">
                 {[
                   { label: 'Faculty Maintenance', val: '45%', col: 'bg-amber-400' },
                   { label: 'Uni Treasury', val: '30%', col: 'bg-white' },
                   { label: 'Instructor Share', val: '25%', col: 'bg-zinc-700' }
                 ].map((share, idx) => (
                   <div key={idx} className="space-y-2">
                     <div className="flex justify-between text-[10px] font-bold uppercase">
                       <span className="text-white/40">{share.label}</span>
                       <span className="text-white">{share.val}</span>
                     </div>
                     <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className={`h-full ${share.col}`} style={{ width: share.val }} />
                     </div>
                   </div>
                 ))}
              </div>
              <div className="size-24 bg-amber-400/10 blur-[50px] absolute -bottom-10 -right-10 pointer-events-none" />
           </section>

           <section className="bg-amber-400 text-bg-dark p-6 rounded-3xl group cursor-pointer hover:shadow-2xl hover:shadow-amber-400/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                 <ShieldCheck size={20} className="text-bg-dark opacity-40" />
                 <TrendingUp size={20} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Escrow Security Node</p>
              <h4 className="text-lg font-black italic uppercase tracking-tighter">ALL SYSTEMS STEADY</h4>
           </section>
        </div>

      </div>

    </div>
  );
};

// Mock Link if not imported
const Link = ({ to, children, className }: any) => <a href={to} className={className}>{children}</a>;

export default FIN_Operations;
