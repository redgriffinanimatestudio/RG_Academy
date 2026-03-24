import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, CreditCard, CheckCircle } from 'lucide-react';

interface CheckoutSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutSidebar({ isOpen, onClose }: CheckoutSidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
          >
            <div className="p-10 border-b border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-bg-dark">
                  <Shield size={20} />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tighter text-bg-dark">Secure Checkout</h2>
              </div>
              <button onClick={onClose} className="p-2 text-zinc-300 hover:text-bg-dark transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-12 text-zinc-600">
              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Your Subscription</h3>
                <div className="p-6 rounded-[2rem] bg-zinc-50 border border-zinc-100 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-black uppercase tracking-tight text-bg-dark">Studio Pro Annual</div>
                    <div className="text-xs font-bold text-zinc-400">Billed yearly • Save 20%</div>
                  </div>
                  <div className="text-xl font-black text-bg-dark">$199</div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Payment Details</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <CreditCard size={20} className="text-zinc-400" />
                      <span className="text-sm font-bold text-zinc-300">•••• •••• •••• 4242</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-12 border-t border-zinc-100">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span>Subtotal</span>
                  <span className="text-bg-dark">$199.00</span>
                </div>
                <div className="flex items-center justify-between text-lg font-black uppercase text-bg-dark">
                  <span>Total Due</span>
                  <span>$199.00</span>
                </div>
              </div>
            </div>

            <div className="p-10 border-t border-zinc-100">
              <button className="w-full py-5 bg-bg-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all flex items-center justify-center gap-3">
                <CheckCircle size={18} className="text-primary" /> Pay & Activate Pro
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
