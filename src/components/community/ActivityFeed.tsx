import React from 'react';
import { motion } from 'framer-motion';
import { Zap, UserPlus } from 'lucide-react';
import { FeedEvent } from '../../services/networkingService';

interface ActivityFeedProps {
  feed: FeedEvent[];
}

export default function ActivityFeed({ feed }: ActivityFeedProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5">
        <h2 className="text-2xl font-bold uppercase tracking-tight mb-8">Ecosystem Activity</h2>
        {feed.length > 0 ? (
          <div className="space-y-6">
            {feed.map((event) => (
              <div key={event.id} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                  {event.type === 'follow' ? <UserPlus size={20} /> : <Zap size={20} />}
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold">{event.actorId} <span className="text-white/40 font-normal">{event.type.replace('_', ' ')}</span></p>
                  <p className="text-xs text-white/20 mt-1 uppercase tracking-widest font-black">Just now</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <div className="size-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-white/20">
              <Zap size={32} />
            </div>
            <p className="text-white/40 font-bold uppercase tracking-widest text-xs">No activity yet. Follow people to see updates!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
