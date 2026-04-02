import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Gavel, Globe, CheckCircle2, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Terms: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'eng';

  const SECTIONS = [
    {
      title: 'Grid Node Protocol',
      icon: <Globe size={24} />,
      content: 'By establishing a node within the Red Griffin Academy ecosystem, you agree to adhere to the Global Data Synchronisation Protocol. This includes maintaining the integrity of your identity and ensuring that all professional artifacts uploaded are your own intellectual property.'
    },
    {
      title: 'Privacy & Encryption',
      icon: <Shield size={24} />,
      content: 'Your identity is fortified with high-level encryption. We process your residency and citizenship data strictly for legal compliance and node hosting regionality. We do not sell your personal telemetry to third-party data harvesters.'
    },
    {
      title: 'Professional Conduct',
      icon: <CheckCircle2 size={24} />,
      content: 'Collaborations within the Studio and Academy zones must remain professional, respectful, and transparent. Any attempt to compromise grid security or engage in malicious node activity will result in immediate de-registration.'
    },
    {
      title: 'Liability & Governance',
      icon: <Gavel size={24} />,
      content: 'Red Griffin Academy provides the platform "as-is" for professional growth and artistic collaboration. While we maintain a 99.9% grid uptime, we are not liable for any temporary connection drops or data desyncs.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-red-500/30 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-red-600/10 to-transparent pointer-events-none" />
      <div className="absolute top-[20%] -left-20 size-[600px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] -right-20 size-[600px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        <header className="mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="size-16 rounded-3xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6 shadow-2xl shadow-red-600/10"
          >
            <FileText size={32} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none"
          >
            Protocol <br/><span className="text-red-600">Terms</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/40 font-medium max-w-xl"
          >
            Red Griffin Academy Global Governance v5.2. Last Handshake: April 2026.
          </motion.p>
        </header>

        <div className="space-y-6">
          {SECTIONS.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 md:p-10 hover:bg-white/[0.07] hover:border-white/10 transition-all group"
            >
              <div className="flex items-start gap-6">
                <div className="size-12 rounded-2xl bg-black flex items-center justify-center text-white/40 group-hover:text-red-500 transition-colors shrink-0">
                  {section.icon}
                </div>
                <div className="space-y-3">
                   <h2 className="text-xl font-black uppercase tracking-widest text-white group-hover:text-red-500 transition-colors italic">{section.title}</h2>
                   <p className="text-white/40 leading-relaxed font-medium group-hover:text-white/60 transition-colors">
                     {section.content}
                   </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <footer className="mt-16 pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/20">
              <span>RG PROTOCOL V.5.2</span>
              <div className="size-1 rounded-full bg-red-600" />
              <span>EST. 2024</span>
           </div>
           
           <Link 
             to={`/${lang}/login`}
             className="px-10 py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 flex items-center gap-3 group"
           >
             Return to Grid <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
           </Link>
        </footer>
      </div>
    </div>
  );
};

export default Terms;
