import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, DollarSign, LifeBuoy, Clock, 
  CheckCircle, AlertCircle, Search, Filter, 
  MoreVertical, Briefcase, UserPlus, FileText, 
  CreditCard, ShieldCheck, Mail, Zap
} from 'lucide-react';

// --- STAFF DASHBOARD CONTENT ---

export function StaffDashboardContent({ activeRole, activeModule, accentColor }: any) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeRole + activeModule}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="space-y-6"
      >
        {activeRole === 'hr' && <HRDashboard accent={accentColor} module={activeModule} />}
        {activeRole === 'finance' && <FinanceDashboard accent={accentColor} module={activeModule} />}
        {activeRole === 'support' && <SupportDashboard accent={accentColor} module={activeModule} />}
        
        {!['hr', 'finance', 'support'].includes(activeRole) && (
          <div className="flex flex-col items-center justify-center py-40 opacity-20">
            <Briefcase size={64} className="mb-6" style={{ color: accentColor }} />
            <h2 className="text-xl font-black uppercase tracking-[0.5em]">{activeRole.replace(/_/g, ' ')} Module</h2>
            <p className="text-xs mt-2 uppercase tracking-widest">Staff Node Operational</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// --- SUB-COMPONENTS ---

function HRDashboard({ accent, module }: any) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Сотрудников" value="24" sub="+2 за месяц" icon={Users} accent={accent} />
        <StatCard label="Вакансий" value="5" sub="3 срочных" icon={Briefcase} accent="#ef4444" />
        <StatCard label="Онбординг" value="2" sub="1-я неделя" icon={Clock} accent="#378add" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
          <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
            <Briefcase size={20} style={{ color: accent }} /> Открытые вакансии
          </h3>
          <div className="space-y-3">
            {[
              { title: 'Senior 3D Artist', status: 'срочно', color: '#ef4444' },
              { title: 'VFX Supervisor', status: 'срочно', color: '#ef4444' },
              { title: 'NestJS Developer', status: 'в работе', color: '#ef9f27' },
              { title: 'Content Manager', status: 'открыта', color: '#888' }
            ].map((v, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="text-xs font-bold text-white uppercase">{v.title}</div>
                <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest" style={{ background: `${v.color}20`, color: v.color }}>{v.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
          <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
            <Users size={20} style={{ color: accent }} /> Кандидаты (неделя)
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Pavel K.', role: '3D Artist', status: 'интервью', color: '#378add' },
              { name: 'Lena M.', role: 'VFX Sup.', status: 'тест', color: '#ef9f27' },
              { name: 'Igor S.', role: 'NestJS Dev', status: 'оффер', color: '#1d9e75' }
            ].map((c, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center font-black text-[10px] uppercase text-white/20">{c.name.charAt(0)}</div>
                  <div>
                    <div className="text-xs font-bold text-white uppercase">{c.name}</div>
                    <div className="text-[9px] text-white/20 font-black uppercase">{c.role}</div>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest" style={{ background: `${c.color}20`, color: c.color }}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FinanceDashboard({ accent, module }: any) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="К выплате" value="$8,200" sub="4 транзакции" icon={DollarSign} accent="#ef9f27" />
        <StatCard label="Просроченных" value="4" sub="требуют действий" icon={AlertCircle} accent="#ef4444" />
        <StatCard label="Выплачено (мес.)" value="$34,440" sub="+18% vs пред." icon={CheckCircle} accent="#1d9e75" />
      </div>

      <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
        <h3 className="text-xl font-black uppercase tracking-tight">Очередь выплат</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                <th className="pb-6">Исполнитель</th>
                <th className="pb-6">Сумма</th>
                <th className="pb-6">Milestone</th>
                <th className="pb-6 text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { name: 'Alex Kim', amount: '$1,200', ms: '2 из 4' },
                { name: 'Sara R.', amount: '$3,600', ms: '1 из 3' },
                { name: 'John D.', amount: '$800', ms: '3 из 4' }
              ].map((p, i) => (
                <tr key={i} className="group">
                  <td className="py-6 font-black text-white uppercase text-xs">{p.name}</td>
                  <td className="py-6 font-black text-white text-sm">{p.amount}</td>
                  <td className="py-6 text-[10px] font-black text-white/20 uppercase">{p.ms}</td>
                  <td className="py-6 text-right"><button className="px-6 py-2 bg-primary text-bg-dark rounded-xl text-[9px] font-black uppercase tracking-widest">Выплатить</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SupportDashboard({ accent, module }: any) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Открытых тикетов" value="18" sub="5 срочных" icon={LifeBuoy} accent="#ef4444" />
        <StatCard label="SLA (24h)" value="91%" sub="↑ +3% за нед." icon={Zap} accent="#ef9f27" />
        <StatCard label="Закрыто сегодня" value="7" sub="среднее: 2.4h" icon={CheckCircle} accent="#1d9e75" />
      </div>

      <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
        <h3 className="text-xl font-black uppercase tracking-tight">Активные тикеты</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                <th className="pb-6">Пользователь</th>
                <th className="pb-6">Тема</th>
                <th className="pb-6">Приоритет</th>
                <th className="pb-6 text-right">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { u: 'alex@gmail.com', t: 'Не открывается курс', p: 'высокий', s: 'в работе', c: '#ef4444' },
                { u: 'sara@mail.ru', t: 'Вопрос по оплате', p: 'средний', s: 'новый', c: '#ef9f27' },
                { u: 'john@studio.io', t: 'Сертификат не выдан', p: 'высокий', s: 'в работе', c: '#ef4444' }
              ].map((t, i) => (
                <tr key={i}>
                  <td className="py-6 text-xs font-bold text-white/60 lowercase">{t.u}</td>
                  <td className="py-6 text-xs font-black text-white uppercase">{t.t}</td>
                  <td className="py-6"><span className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-black uppercase tracking-widest" style={{ color: t.c }}>{t.p}</span></td>
                  <td className="py-6 text-right"><span className="text-[10px] font-black uppercase tracking-widest text-white/20">{t.s}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon, accent }: any) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-3xl p-6 space-y-4 group hover:border-white/10 transition-all shadow-2xl">
      <div className="flex justify-between items-start">
        <div className="text-[10px] font-black text-white/20 uppercase tracking-widest group-hover:text-white/40 transition-colors">{label}</div>
        <Icon size={18} style={{ color: accent }} className="opacity-40 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="text-3xl font-black text-white tracking-tighter">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: accent }}>{sub}</div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---

export default function StaffDashboard() {
  return (
    <div className="p-8">
      <StaffDashboardContent activeRole="hr" activeModule="overview" accentColor="#378add" />
    </div>
  );
}
