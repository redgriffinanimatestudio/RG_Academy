import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Users, 
  Zap, 
  Star, 
  ArrowLeft,
  Plus,
  Search,
  Filter,
  MoreVertical,
  ThumbsUp,
  Share2,
  Bookmark
} from 'lucide-react';

interface Post {
  id: string;
  author: string;
  avatar: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  comments: number;
  time: string;
  tags: string[];
  image?: string;
}

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: 'Alex Volkov',
    avatar: 'https://i.pravatar.cc/150?u=alex',
    title: 'How to optimize Niagara VFX for mobile?',
    content: 'I\'m working on a stylized mobile game and struggling with performance when there are many particle systems on screen. Any tips on reducing draw calls?',
    category: 'Technical Support',
    likes: 24,
    comments: 12,
    time: '2h ago',
    tags: ['UE5', 'Niagara', 'Mobile', 'Optimization']
  },
  {
    id: '2',
    author: 'Elena Rigby',
    avatar: 'https://i.pravatar.cc/150?u=elena',
    title: 'March Environment Challenge Results',
    content: 'Congratulations to all participants! The level of work this month was absolutely insane. Here are the top 3 picks from the jury...',
    category: 'Industry News',
    likes: 156,
    comments: 45,
    time: '5h ago',
    tags: ['Challenge', 'Environment Design', 'Showcase'],
    image: 'https://picsum.photos/seed/env/800/400'
  }
];

export default function CommunityTopic() {
  const { topicSlug, lang } = useParams();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  
  const formattedTitle = topicSlug?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="py-8 space-y-12">
      {/* Topic Header */}
      <section className="relative">
        <Link 
          to={`/community/${lang || 'eng'}`}
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          {t('view_community')}
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <MessageSquare size={24} />
              </div>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40">
                {t('community_spotlight')}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              {formattedTitle}
            </h1>
            <p className="text-lg text-white/40 font-medium max-w-2xl">
              Connect, share and discuss everything about {formattedTitle} with the best digital artists in the industry.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="size-10 rounded-full border-2 border-bg-dark overflow-hidden bg-white/10">
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="" />
                </div>
              ))}
              <div className="size-10 rounded-full border-2 border-bg-dark bg-white/5 flex items-center justify-center text-[10px] font-black text-white/40">
                +2k
              </div>
            </div>
            <button className="px-8 py-4 bg-white text-bg-dark rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary transition-all hover:scale-105 active:scale-95 shadow-xl">
              Join Group
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Feed Column */}
        <div className="lg:col-span-3 space-y-8">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="text" 
                placeholder="Search in this topic..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm font-medium text-white placeholder:text-white/20 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              />
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-4 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-[10px] transition-all border border-white/5 bg-white/5 text-white/40 hover:border-white/20">
                <Filter size={18} />
                Sort: Recent
              </button>
              <button className="px-6 py-4 rounded-2xl bg-primary/10 text-primary border border-primary/20 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-primary/20 transition-all">
                <Plus size={18} />
                New Post
              </button>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            {MOCK_POSTS.map((post) => (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl overflow-hidden border border-white/10">
                      <img src={post.avatar} alt={post.author} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-primary transition-colors">{post.author}</h4>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20">
                        <span>{post.time}</span>
                        <span className="size-1 rounded-full bg-white/10" />
                        <span className="text-primary/60">{post.category}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-white/20 hover:text-white transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>

                <div className="space-y-4 mb-8">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-white/40 font-medium leading-relaxed line-clamp-3">
                    {post.content}
                  </p>
                  {post.image && (
                    <div className="aspect-video rounded-3xl overflow-hidden border border-white/5">
                      <img src={post.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/20">#{tag}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-white/40 hover:text-primary transition-colors group/btn">
                      <ThumbsUp size={18} className="group-hover/btn:scale-110 transition-transform" />
                      <span className="text-[10px] font-black uppercase">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-white/40 hover:text-primary transition-colors group/btn">
                      <MessageSquare size={18} className="group-hover/btn:scale-110 transition-transform" />
                      <span className="text-[10px] font-black uppercase">{post.comments}</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="p-2 text-white/20 hover:text-white transition-colors"><Share2 size={18} /></button>
                    <button className="p-2 text-white/20 hover:text-white transition-colors"><Bookmark size={18} /></button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          {/* Topic Stats */}
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Topic Insights</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                <div className="text-xl font-black text-white">4.2k</div>
                <div className="text-[8px] font-black uppercase tracking-widest text-white/20">Members</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                <div className="text-xl font-black text-white">128</div>
                <div className="text-[8px] font-black uppercase tracking-widest text-white/20">Online</div>
              </div>
            </div>
            <div className="pt-6 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-white/20">Posts Today</span>
                <span className="text-white">12</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-white/20">Engagement</span>
                <span className="text-emerald-500">+12%</span>
              </div>
            </div>
          </div>

          {/* Top Contributors */}
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-2">
              <Star size={12} className="text-primary" />
              Top Contributors
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <div className="size-10 rounded-xl overflow-hidden bg-white/10">
                    <img src={`https://i.pravatar.cc/100?u=top${i}`} alt="" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white">PowerArtist_{i}</p>
                    <p className="text-[8px] font-black uppercase text-primary/60">Elite Contributor</p>
                  </div>
                  <div className="text-[10px] font-black text-white/20">#{i}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Guidelines */}
          <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">Guidelines</h3>
            <ul className="space-y-3">
              {['Be respectful', 'No spamming', 'Share source files', 'High-quality only'].map((rule, i) => (
                <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-white/60">
                  <div className="size-1 rounded-full bg-primary" />
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
