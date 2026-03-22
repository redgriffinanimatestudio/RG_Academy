import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Briefcase, 
  Star, 
  Users, 
  ChevronRight, 
  ExternalLink,
  ArrowLeft,
  Zap
} from 'lucide-react';

const MOCK_SERVICES = [
  {
    id: '1',
    slug: 'high-end-character-production',
    title: 'High-End Character Production',
    studio: 'Griffin Studios',
    studioLogo: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png',
    rating: 5.0,
    reviews: 45,
    startingPrice: 2500,
    teamSize: '5-10 Artists',
    deliveryTime: '4-8 Weeks',
    category: 'Modeling',
    tags: ['Next-Gen', 'Photorealistic', 'Rigged']
  },
  {
    id: '2',
    slug: 'cinematic-environment-design',
    title: 'Cinematic Environment Design',
    studio: 'Vertex Lab',
    studioLogo: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-3.png',
    rating: 4.8,
    reviews: 120,
    startingPrice: 5000,
    teamSize: '10-20 Artists',
    deliveryTime: '8-12 Weeks',
    category: 'Environments',
    tags: ['UE5', 'Virtual Production', 'AAA']
  }
];

const HERO_SLIDES = [
  {
    title: 'Premium Production Services',
    desc: 'Scale your pipeline with elite CG talent and battle-tested production workflows.',
    image: 'https://picsum.photos/seed/studio1/1200/600',
    tag: 'Studio Solutions'
  },
  {
    title: 'Next-Gen Visual Effects',
    desc: 'From fluid dynamics to massive destruction, we deliver world-class FX for film and games.',
    image: 'https://picsum.photos/seed/studio2/1200/600',
    tag: 'VFX & Dynamics'
  }
];

export default function ServicePage() {
  const { t } = useTranslation();
  const { lang, serviceSlug } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const [filters, setFilters] = useState({
    budget: 'all',
    timeline: 'all'
  });

  const serviceName = serviceSlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Service';

  const filteredServices = MOCK_SERVICES.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-20 py-8">
      {/* Studio Hero Slider */}
      <section className="relative h-[500px] rounded-[3rem] overflow-hidden group border border-white/5">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img src={HERO_SLIDES[currentSlide].image} alt="" className="w-full h-full object-cover brightness-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/20 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 p-12 flex flex-col justify-end space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <span className="px-3 py-1 bg-primary-hover text-white text-[9px] font-black uppercase tracking-widest rounded-lg">
              {HERO_SLIDES[currentSlide].tag}
            </span>
            <div className="h-[1px] w-12 bg-white/20" />
            <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">Studio Service: {serviceName}</span>
          </motion.div>

          <div className="max-w-2xl space-y-4">
            <motion.h1 
              key={`h1-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-black tracking-tighter text-white leading-none uppercase"
            >
              {HERO_SLIDES[currentSlide].title.split(' ')[0]} <br />
              <span className="text-primary-hover italic">{HERO_SLIDES[currentSlide].title.split(' ').slice(1).join(' ')}</span>
            </motion.h1>
            <motion.p 
              key={`p-${currentSlide}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg text-white/60 font-medium"
            >
              {HERO_SLIDES[currentSlide].desc}
            </motion.p>
          </div>

          <div className="flex items-center gap-4 pt-4">
            {HERO_SLIDES.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentSlide(i)}
                className={`h-1 transition-all duration-500 rounded-full ${currentSlide === i ? 'w-12 bg-primary-hover' : 'w-4 bg-white/20 hover:bg-white/40'}`} 
              />
            ))}
          </div>
        </div>

        <Link 
          to={`/studio/${lang || 'eng'}`} 
          className="absolute top-8 left-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/60 hover:text-white transition-all bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
        >
          <ArrowLeft size={14} />
          {t('all_services')}
        </Link>
      </section>

      {/* Search & Studio Filters */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">Production Solutions</h2>
            <p className="text-xs font-bold text-white/20 uppercase tracking-[0.2em]">{filteredServices.length} Top-Tier Studios Available</p>
          </div>
          
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <div className="flex gap-4">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                <input
                  type="text"
                  placeholder={t('search_services')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-primary-hover/40 focus:ring-4 focus:ring-primary-hover/5 transition-all font-medium text-white placeholder:text-white/20 outline-none"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-[10px] transition-all border ${showFilters ? 'bg-primary-hover text-white border-primary-hover shadow-lg shadow-primary-hover/20' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'}`}
              >
                <Filter size={18} />
                {t('refine')}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-hover">Project Scope</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Boutique', 'Mid-Size', 'AAA / Large'].map((scope) => (
                      <button key={scope} className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest bg-white/5 text-white/40 hover:text-white transition-all">{scope}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-hover">Industry</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Games', 'Film', 'Advertising', 'ArchViz'].map((ind) => (
                      <button key={ind} className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest bg-white/5 text-white/40 hover:text-white transition-all">{ind}</button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Service Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredServices.map((service) => (
          <motion.div layout key={service.id} className="group bg-white/5 border border-white/5 rounded-[2.5rem] p-8 hover:border-primary-hover/20 transition-all">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden shrink-0">
                <img src={`https://picsum.photos/seed/${service.slug}/400/400`} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white group-hover:text-primary-hover transition-colors uppercase leading-tight">{service.title}</h3>
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-white/10 overflow-hidden"><img src={service.studioLogo} alt="" /></div>
                      <span className="text-xs font-bold text-white/40">{service.studio}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-primary-hover/10 text-primary-hover rounded-lg text-[10px] font-black">
                    <Star size={12} fill="currentColor" /> {service.rating}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black text-white/40 uppercase tracking-widest">{tag}</span>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                  <div>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Starting At</p>
                    <p className="text-sm font-black text-white">${service.startingPrice}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Team Size</p>
                    <p className="text-sm font-black text-white">{service.teamSize}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Timeline</p>
                    <p className="text-sm font-black text-white">{service.deliveryTime}</p>
                  </div>
                </div>
                <div className="pt-4 flex items-center gap-4">
                  <button className="flex-1 py-3 bg-primary-hover text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all">Request Proposal</button>
                  <button className="p-3 bg-white/5 text-white/40 hover:text-white rounded-xl border border-white/5 transition-all"><ExternalLink size={18} /></button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Studio CTA */}
      <section className="bg-gradient-to-br from-primary-hover/20 to-transparent border border-primary-hover/10 rounded-[3rem] p-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className="size-16 rounded-2xl bg-primary-hover/10 flex items-center justify-center text-primary-hover mb-4 mx-auto md:mx-0">
            <Briefcase size={32} />
          </div>
          <h2 className="text-5xl font-black tracking-tighter uppercase leading-[0.9]">Scale your <br /><span className="text-primary-hover italic">Production.</span></h2>
          <p className="text-xl text-white/40 font-medium leading-relaxed max-w-xl">
            Join the Red Griffin Studio Network to connect with AAA-level talent and streamline your pipeline with integrated collaboration tools.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <button className="bg-primary-hover text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-primary-hover/20 flex items-center gap-3">
              <Zap size={16} fill="currentColor" /> Become a Partner
            </button>
            <button className="bg-white/5 border border-white/10 text-white/60 hover:text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all">
              Post a Project
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/3 aspect-square bg-white/5 rounded-[2.5rem] border border-white/5 flex items-center justify-center relative group">
          <div className="absolute inset-0 bg-primary-hover/5 blur-3xl rounded-full scale-75 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Users size={80} className="text-primary-hover/20" />
        </div>
      </section>
    </div>
  );
}
