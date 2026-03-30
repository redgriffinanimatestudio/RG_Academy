import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Download, 
  Search, 
  Filter, 
  ExternalLink,
  ChevronDown,
  Calendar,
  DollarSign,
  FileText
} from 'lucide-react';

const STU_Purchases: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch('/api/v1/academy/purchases');
        const result = await response.json();
        if (result.success) setTransactions(result.data);
      } catch (e) {
        console.error('Failed to fetch purchases');
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-20 bg-white/5 rounded-2xl border border-white/10" />
        ))}
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* HEADER & FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/5">
            <CreditCard size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest text-white">Billing History</h2>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1">Total Spent: ${transactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Search Invoices..." 
              className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-primary/40 transition-all w-64"
            />
          </div>
          <button className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-white/40 hover:text-white">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* TRANSACTION LIST */}
      <div className="space-y-3">
        {transactions.map((transaction, idx) => (
          <motion.div 
            key={transaction.id}
            variants={item}
            className="group grid grid-cols-1 md:grid-cols-6 items-center gap-6 p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all"
          >
            {/* ID & DATE */}
            <div className="col-span-1 flex flex-col space-y-1">
              <span className="text-[8px] font-black uppercase tracking-widest text-white/20 group-hover:text-primary/40 transition-colors">#{transaction.id.substring(0, 8)}</span>
              <span className="text-[10px] font-bold text-white/60 flex items-center gap-1.5"><Calendar size={12} className="opacity-40" /> {new Date(transaction.createdAt).toLocaleDateString()}</span>
            </div>

            {/* DESCRIPTION */}
            <div className="col-span-2 flex items-center gap-3">
              <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20 border border-white/5">
                <FileText size={16} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-white group-hover:text-primary transition-colors truncate">{transaction.description || 'Workshop Purchase'}</span>
            </div>

            {/* STATUS */}
            <div className="col-span-1">
              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                transaction.status === 'completed' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' : 
                transaction.status === 'pending' ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' : 
                'bg-red-400/10 text-red-400 border-red-400/20'
              }`}>
                {transaction.status}
              </span>
            </div>

            {/* AMOUNT */}
            <div className="col-span-1 text-right">
              <span className="text-sm font-black text-white flex items-center justify-end gap-1">
                <span className="text-primary/40">$</span>{transaction.amount.toFixed(2)}
              </span>
            </div>

            {/* ACTIONS */}
            <div className="col-span-1 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-primary/40 hover:text-primary transition-all shadow-xl" title="Download Invoice">
                <Download size={14} />
              </button>
              <button className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-primary/40 hover:text-primary transition-all shadow-xl" title="View Details">
                <ExternalLink size={14} />
              </button>
            </div>
          </motion.div>
        ))}

        {transactions.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center space-y-6 text-center">
            <div className="size-20 rounded-full bg-white/5 flex items-center justify-center text-white/20 border border-dashed border-white/10">
              <CreditCard size={32} />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-black uppercase text-white/40">No transactions found</h4>
              <p className="text-[10px] text-white/20 uppercase font-medium max-w-xs">You haven't made any purchases yet. Your invoices will appear here after enrollment.</p>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER INFO */}
      <div className="p-6 rounded-3xl border border-dashed border-white/5 bg-white/[0.01] flex items-center gap-4">
        <div className="size-8 rounded-full bg-amber-400/10 flex items-center justify-center text-amber-400 shrink-0">
          <Calendar size={16} />
        </div>
        <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest leading-relaxed">
          Need a VAT invoice for your company? Please contact <span className="text-primary">billing@redgriffin.academy</span> with your order details and tax ID.
        </p>
      </div>
    </motion.div>
  );
};

export default STU_Purchases;
