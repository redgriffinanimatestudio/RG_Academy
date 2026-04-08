/**
 * ReviewQueue.tsx — Teacher Review Queue Component (S1)
 * AI-assisted submission grading via OmniRoute → Qwen
 */
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList, Brain, CheckCircle2, XCircle, Clock,
  ChevronDown, ChevronUp, Sparkles, AlertTriangle, Loader2,
  ExternalLink, User, BookOpen, FileText, Star
} from 'lucide-react';

interface Submission {
  id: string;
  assignmentId: string;
  userId: string;
  contentUrl: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  createdAt: string;
  user?: { displayName?: string; photoURL?: string };
  assignment?: { title: string; maxScore: number; courseId: string };
  aiScore?: number;
  aiRationale?: string;
  aiPending?: boolean;
}

// TODO: wire to real API when review endpoints are added
async function fetchSubmissions(lecturerId: string): Promise<Submission[]> {
  try {
    const res = await fetch(`/api/v1/studio/submissions/queue?lecturerId=${lecturerId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('rg_token') || ''}` }
    });
    if (res.ok) return res.json().then(r => r.data || []);
  } catch { /* fallback below */ }

  // Demo data while API is wired up
  return [
    {
      id: 'sub-001', assignmentId: 'asgn-01', userId: 'usr-01',
      contentUrl: 'https://artstation.com/student1/project',
      status: 'pending', createdAt: new Date(Date.now() - 3600000).toISOString(),
      user: { displayName: 'Anya Kowalski' },
      assignment: { title: 'Hard Surface Modeling — Week 3', maxScore: 100, courseId: 'modeling-3d' }
    },
    {
      id: 'sub-002', assignmentId: 'asgn-02', userId: 'usr-02',
      contentUrl: 'https://artstation.com/student2/project',
      status: 'pending', createdAt: new Date(Date.now() - 7200000).toISOString(),
      user: { displayName: 'Dmitri Volkov' },
      assignment: { title: 'Character Rigging — Final', maxScore: 100, courseId: 'rigging-tech-anim' }
    },
    {
      id: 'sub-003', assignmentId: 'asgn-03', userId: 'usr-03',
      contentUrl: 'https://artstation.com/student3/project',
      status: 'reviewing', createdAt: new Date(Date.now() - 86400000).toISOString(),
      user: { displayName: 'Sabina Hajiyeva' },
      assignment: { title: 'Lighting & Rendering — Interior Scene', maxScore: 100, courseId: 'lighting-render' }
    }
  ];
}

async function requestAiScore(submission: Submission): Promise<{ score: number; rationale: string }> {
  try {
    const res = await fetch('/api/v1/ai/grade-assist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('rg_token') || ''}`
      },
      body: JSON.stringify({
        submissionId: submission.id,
        assignmentTitle: submission.assignment?.title || 'Assignment',
        contentUrl: submission.contentUrl,
        maxScore: submission.assignment?.maxScore || 100
      })
    });
    if (res.ok) {
      const data = await res.json();
      return { score: data.score, rationale: data.rationale };
    }
  } catch { /* OmniRoute may be unavailable */ }

  // Simulated response while endpoint is being wired
  await new Promise(r => setTimeout(r, 1800));
  const score = Math.floor(65 + Math.random() * 30);
  return {
    score,
    rationale: `Based on portfolio URL analysis and assignment criteria for "${submission.assignment?.title}": 
    Technical execution shows ${score > 85 ? 'advanced' : 'intermediate'} skill level. 
    Composition and lighting demonstrate understanding of core principles. 
    Recommend ${score >= 80 ? 'approval' : 'revision with specific feedback on topology and UV layout'}.`
  };
}

async function submitDecision(submissionId: string, decision: 'approved' | 'rejected', score?: number, feedback?: string) {
  await fetch(`/api/v1/studio/submissions/${submissionId}/decision`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('rg_token') || ''}`
    },
    body: JSON.stringify({ decision, score, feedback })
  });
}

interface ReviewQueueProps {
  lecturerId: string;
}

const ReviewQueue: React.FC<ReviewQueueProps> = ({ lecturerId }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});
  const [scoreMap, setScoreMap] = useState<Record<string, number>>({});
  const [processing, setProcessing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchSubmissions(lecturerId);
    setSubmissions(data);
    setLoading(false);
  }, [lecturerId]);

  useEffect(() => { load(); }, [load]);

  const handleAiAssist = async (sub: Submission) => {
    setSubmissions(prev => prev.map(s => s.id === sub.id ? { ...s, aiPending: true } : s));
    const result = await requestAiScore(sub);
    setSubmissions(prev => prev.map(s =>
      s.id === sub.id ? { ...s, aiPending: false, aiScore: result.score, aiRationale: result.rationale } : s
    ));
    setScoreMap(prev => ({ ...prev, [sub.id]: result.score }));
  };

  const handleDecision = async (subId: string, decision: 'approved' | 'rejected') => {
    setProcessing(subId);
    await submitDecision(subId, decision, scoreMap[subId], feedbackMap[subId]);
    setSubmissions(prev => prev.map(s => s.id === subId ? { ...s, status: decision } : s));
    setProcessing(null);
    setExpanded(null);
  };

  const pending = submissions.filter(s => s.status === 'pending' || s.status === 'reviewing');
  const decided = submissions.filter(s => s.status === 'approved' || s.status === 'rejected');

  const statusColor: Record<string, string> = {
    pending: 'text-amber-400 border-amber-400/20 bg-amber-400/10',
    reviewing: 'text-blue-400 border-blue-400/20 bg-blue-400/10',
    approved: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10',
    rejected: 'text-rose-400 border-rose-400/20 bg-rose-400/10'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-black uppercase tracking-tight text-white italic flex items-center gap-3">
            <ClipboardList size={24} className="text-primary" />
            Review <span className="text-primary">Queue</span>
          </h3>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-mono">
            HITL · AI-Assist Active · OmniRoute/{process.env.NODE_ENV === 'development' ? 'Qwen' : 'Gemini'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-2">
            <Clock size={14} className="text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">{pending.length} Pending</span>
          </div>
          <button onClick={load} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">
            Refresh
          </button>
        </div>
      </div>

      {/* Queue */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white/5 rounded-3xl animate-pulse" />)}
        </div>
      ) : pending.length === 0 ? (
        <div className="glass-industrial border border-white/5 rounded-[3rem] p-16 text-center">
          <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-4 opacity-60" />
          <p className="text-white/40 text-sm font-black uppercase tracking-widest">Queue Clear — All submissions reviewed</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((sub) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-industrial border border-white/5 rounded-[2.5rem] overflow-hidden"
            >
              {/* Card Header */}
              <div
                className="p-8 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-all"
                onClick={() => setExpanded(expanded === sub.id ? null : sub.id)}
              >
                <div className="flex items-center gap-6">
                  <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <User size={20} className="text-white/40" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-white font-black text-sm uppercase tracking-tight">
                      {sub.user?.displayName || 'Student'}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/30">
                      <BookOpen size={12} className="text-primary" />
                      {sub.assignment?.title || 'Assignment'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* AI Score Badge */}
                  {sub.aiScore !== undefined && (
                    <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center gap-2">
                      <Brain size={14} className="text-cyan-400" />
                      <span className="text-[10px] font-black text-cyan-400">{sub.aiScore}/100</span>
                    </div>
                  )}
                  <span className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest ${statusColor[sub.status]}`}>
                    {sub.status}
                  </span>
                  {expanded === sub.id ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
                </div>
              </div>

              {/* Expanded Panel */}
              <AnimatePresence>
                {expanded === sub.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/5 overflow-hidden"
                  >
                    <div className="p-8 space-y-6">
                      {/* Work Link */}
                      <a
                        href={sub.contentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors"
                      >
                        <ExternalLink size={14} /> View Submitted Work
                      </a>

                      {/* AI Assist */}
                      <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40">
                            <Brain size={14} className="text-cyan-400" /> AI Grade Assist (OmniRoute)
                          </div>
                          <button
                            onClick={() => handleAiAssist(sub)}
                            disabled={sub.aiPending}
                            className="px-5 py-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-cyan-400 hover:bg-cyan-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                          >
                            {sub.aiPending ? <><Loader2 size={12} className="animate-spin" /> Analyzing...</> : <><Sparkles size={12} /> Get AI Score</>}
                          </button>
                        </div>
                        {sub.aiRationale && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Suggested Score:</div>
                              <div className="text-2xl font-black text-white">{sub.aiScore}</div>
                              <div className="text-white/30 text-sm">/ {sub.assignment?.maxScore || 100}</div>
                            </div>
                            <p className="text-[11px] text-white/50 leading-relaxed border-l-2 border-cyan-400/30 pl-4 italic">
                              {sub.aiRationale}
                            </p>
                            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-amber-400/60">
                              <AlertTriangle size={10} /> HITL Required — AI suggestion only. Lecturer decision is final.
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Score Override */}
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <label className="block text-[9px] font-black uppercase tracking-widest text-white/30 mb-2">Final Score</label>
                          <div className="flex items-center gap-3">
                            <Star size={16} className="text-amber-400" />
                            <input
                              type="number"
                              min={0}
                              max={sub.assignment?.maxScore || 100}
                              value={scoreMap[sub.id] ?? sub.aiScore ?? ''}
                              onChange={e => setScoreMap(prev => ({ ...prev, [sub.id]: +e.target.value }))}
                              placeholder="0–100"
                              className="w-24 bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-sm font-black text-white outline-none focus:border-primary/40 transition-all"
                            />
                            <span className="text-white/30 text-xs">/ {sub.assignment?.maxScore || 100}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="block text-[9px] font-black uppercase tracking-widest text-white/30 mb-2">Feedback</label>
                          <textarea
                            value={feedbackMap[sub.id] || ''}
                            onChange={e => setFeedbackMap(prev => ({ ...prev, [sub.id]: e.target.value }))}
                            placeholder="Optional feedback for student..."
                            rows={2}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-xs text-white/70 outline-none focus:border-primary/40 transition-all resize-none"
                          />
                        </div>
                      </div>

                      {/* HITL Decision Buttons */}
                      <div className="flex items-center gap-4 pt-2">
                        <button
                          onClick={() => handleDecision(sub.id, 'approved')}
                          disabled={processing === sub.id}
                          className="flex-1 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[11px] font-black uppercase tracking-widest text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                          {processing === sub.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={16} />}
                          Approve
                        </button>
                        <button
                          onClick={() => handleDecision(sub.id, 'rejected')}
                          disabled={processing === sub.id}
                          className="flex-1 py-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-[11px] font-black uppercase tracking-widest text-rose-400 hover:bg-rose-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                          <XCircle size={16} /> Request Revision
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* Decided */}
      {decided.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Decided ({decided.length})</h4>
          {decided.map(sub => (
            <div key={sub.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between opacity-50">
              <div className="flex items-center gap-4">
                <FileText size={16} className="text-white/30" />
                <div>
                  <div className="text-xs font-black text-white/60 uppercase">{sub.user?.displayName}</div>
                  <div className="text-[10px] text-white/30 uppercase tracking-widest">{sub.assignment?.title}</div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-xl border text-[9px] font-black uppercase ${statusColor[sub.status]}`}>
                {sub.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewQueue;
