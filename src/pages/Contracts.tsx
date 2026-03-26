import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { studioService, Contract } from '../services/studioService';
import { userService, UserProfile } from '../services/userService';
import { FileText, CheckCircle, Clock, AlertCircle, DollarSign, ChevronRight, User, Briefcase, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Preloader from '../components/Preloader';

export default function Contracts() {
  const { t } = useTranslation();
  const { profile: user, loading } = useAuth();
  const { lang } = useParams();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [partners, setPartners] = useState<Record<string, UserProfile>>({});
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const profile = await userService.getProfile(user.uid);
      setUserProfile(profile);

      if (profile) {
        const clientContracts = profile.roles.includes('client') ? await studioService.getContracts(user.uid, 'client') : [];
        const executorContracts = profile.roles.includes('executor') ? await studioService.getContracts(user.uid, 'executor') : [];
        
        // Combine and sort by date
        const allContracts = [...clientContracts, ...executorContracts].sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });

        // Remove duplicates
        const uniqueContracts = Array.from(new Map(allContracts.map(c => [c.id, c])).values());
        setContracts(uniqueContracts);

        // Fetch partner profiles
        const partnerIds = Array.from(new Set(uniqueContracts.map(c => c.clientId === user.uid ? c.executorId : c.clientId)));
        const profiles = await userService.getUsers(partnerIds);
        const profileMap = profiles.reduce((acc, p) => ({ ...acc, [p.uid]: p }), {});
        setPartners(profileMap);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <Preloader message="Loading Contracts..." size="lg" />;

  if (!user) return <Navigate to={`/${lang || 'eng'}/login`} />;

  const getStatusColor = (status: Contract['status']) => {
    switch (status) {
      case 'active': return 'text-emerald-500 bg-emerald-500/10';
      case 'completed': return 'text-blue-500 bg-blue-500/10';
      case 'disputed': return 'text-red-500 bg-red-500/10';
      default: return 'text-white/40 bg-white/5';
    }
  };

  return (
    <div className="space-y-12 py-8">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
          <FileText size={14} />
          {t('contracts_title')}
        </div>
        <h1 className="text-6xl font-black tracking-tighter text-white leading-none uppercase">
          {t('contracts_title').split(' ')[0]} <br />
          <span className="text-primary italic">{t('contracts_title').split(' ').slice(1).join(' ')}</span>
        </h1>
        <p className="text-lg text-white/40 max-w-xl font-medium">
          {t('contracts_subtitle')}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contracts List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-black uppercase tracking-widest text-white/40">{t('active_contracts')}</h2>
            <span className="text-[10px] font-black text-primary px-2 py-0.5 bg-primary/10 rounded-full">{contracts.length} {t('total_contracts')}</span>
          </div>
          
          <div className="space-y-4">
            {contracts.map((contract) => {
              const isClient = contract.clientId === user.uid;
              const partnerId = isClient ? contract.executorId : contract.clientId;
              const partner = partners[partnerId];
              
              return (
                <motion.div
                  layout
                  key={contract.id}
                  onClick={() => setSelectedContract(contract)}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer group ${
                    selectedContract?.id === contract.id 
                      ? 'bg-white/5 border-primary/20 shadow-xl shadow-primary/5' 
                      : 'bg-bg-card border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden">
                        {partner?.photoURL ? (
                          <img src={partner.photoURL} alt={partner.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <User size={18} className="text-white/20" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-white group-hover:text-primary transition-colors">
                          {partner?.displayName || t('loading')}
                        </h4>
                        <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mt-0.5">
                          {isClient ? t('executor') : t('client')}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${getStatusColor(contract.status)}`}>
                      {t(contract.status)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{t('project_value')}</span>
                      <span className="text-sm font-black text-white">${contract.amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-1000" 
                        style={{ width: `${(contract.milestones.filter(m => m.status === 'released').length / contract.milestones.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {contracts.length === 0 && (
              <div className="p-12 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                <FileText size={32} className="mx-auto text-white/10 mb-4" />
                <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">{t('no_contracts')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Contract Details */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedContract ? (
              <motion.div
                key={selectedContract.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-bg-card border border-white/5 rounded-[2.5rem] p-8 space-y-8"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-white">{t('contract_details')}</h2>
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">ID: {selectedContract.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-3 bg-white/5 text-white/40 rounded-xl hover:text-white transition-colors border border-white/5">
                      <AlertCircle size={18} />
                    </button>
                    <button className="px-6 py-3 bg-primary text-bg-dark font-black uppercase tracking-widest text-[10px] rounded-xl hover:scale-105 transition-all">
                      {t('view_project')}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/20">{t('total_amount')}</span>
                    <p className="text-lg font-black text-white">${selectedContract.amount.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/20">{t('milestones')}</span>
                    <p className="text-lg font-black text-white">{selectedContract.milestones.length}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/20">{t('created_at')}</span>
                    <p className="text-lg font-black text-white">
                      {selectedContract.createdAt ? new Date(selectedContract.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white/40 px-2">{t('payment_milestones')}</h3>
                  <div className="space-y-3">
                    {selectedContract.milestones.map((m, idx) => (
                      <div key={idx} className="p-6 bg-black/20 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`size-10 rounded-xl flex items-center justify-center ${
                            m.status === 'released' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-white/20'
                          }`}>
                            {m.status === 'released' ? <CheckCircle size={20} /> : <Clock size={20} />}
                          </div>
                          <div>
                            <h5 className="text-[11px] font-black uppercase tracking-widest text-white">{m.title}</h5>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-sm font-black text-white">${m.amount.toLocaleString()}</p>
                          <span className={`text-[8px] font-black uppercase tracking-widest ${
                            m.status === 'released' ? 'text-emerald-500' : 'text-white/20'
                          }`}>
                            {m.status === 'released' ? t('paid') : t('pending')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedContract.clientId === user.uid && selectedContract.status === 'active' && (
                  <div className="pt-4 border-t border-white/5">
                    <button className="w-full py-4 bg-emerald-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/10 flex items-center justify-center gap-2">
                      <DollarSign size={18} />
                      {t('release_milestone')}
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 bg-white/[0.02] rounded-[2.5rem] border border-dashed border-white/10">
                <div className="size-24 bg-white/5 rounded-[2rem] flex items-center justify-center text-white/10">
                  <Briefcase size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white">{t('select_contract')}</h3>
                  <p className="text-white/40 text-sm font-medium max-w-xs mx-auto">
                    {t('select_contract_desc')}
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
