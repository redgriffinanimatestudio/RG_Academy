import React, { useState } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { 
  MoreVertical, 
  Plus, 
  MessageSquare, 
  Paperclip, 
  Clock,
  User,
  GripVertical,
  CheckCircle2
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  comments: number;
  attachments: number;
  dueDate: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const INITIAL_COLUMNS: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    tasks: [
      { id: 't1', title: 'Character Skeleton Prep', description: 'Align all joints to reference mesh anatomy.', priority: 'high', assignee: 'Alex', comments: 3, attachments: 1, dueDate: 'Mar 24' },
      { id: 't2', title: 'Python Auto-Rig Script', description: 'Fix the arm twist joint orientation bug.', priority: 'medium', assignee: 'You', comments: 0, attachments: 2, dueDate: 'Mar 25' }
    ]
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [
      { id: 't3', title: 'Face Blendshapes', description: 'Sculpt phonemes for the main character.', priority: 'high', assignee: 'Sarah', comments: 12, attachments: 5, dueDate: 'Mar 22' }
    ]
  },
  {
    id: 'review',
    title: 'Review',
    tasks: [
      { id: 't4', title: 'Leg IK/FK Switch', description: 'The switch is causing a slight pop in the knee.', priority: 'low', assignee: 'Alex', comments: 5, attachments: 0, dueDate: 'Mar 20' }
    ]
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [
      { id: 't5', title: 'Reference Collection', description: 'Anatomy and motion references gathered.', priority: 'low', assignee: 'You', comments: 2, attachments: 8, dueDate: 'Mar 15' }
    ]
  }
];

export default function KanbanBoard() {
  const [columns, setColumns] = useState(INITIAL_COLUMNS);

  return (
    <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar min-h-[600px]">
      {columns.map((column) => (
        <div key={column.id} className="w-80 shrink-0 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black uppercase tracking-widest text-white/40">{column.title}</h3>
              <span className="size-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/20">
                {column.tasks.length}
              </span>
            </div>
            <button className="p-1 text-white/20 hover:text-white transition-colors">
              <Plus size={16} />
            </button>
          </div>

          <div className="flex-1 space-y-3">
            <AnimatePresence mode="popLayout">
              {column.tasks.map((task) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={task.id}
                  className="p-5 rounded-2xl bg-zinc-900 border border-white/5 hover:border-white/10 transition-all cursor-grab active:cursor-grabbing group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                      task.priority === 'high' ? 'bg-rose-500/10 text-rose-500' :
                      task.priority === 'medium' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {task.priority} Priority
                    </span>
                    <button className="text-white/10 hover:text-white transition-colors">
                      <MoreVertical size={14} />
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-2 group-hover:text-primary transition-colors">
                    {task.title}
                  </h4>
                  <p className="text-[11px] text-white/40 mb-4 line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center -space-x-2">
                      <div className="size-6 rounded-lg bg-white/10 border border-bg-dark flex items-center justify-center overflow-hidden">
                        <img src={`https://picsum.photos/seed/${task.assignee}/50/50`} alt={task.assignee} />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] font-bold text-white/20">
                      <div className="flex items-center gap-1">
                        <MessageSquare size={12} /> {task.comments}
                      </div>
                      <div className="flex items-center gap-1">
                        <Paperclip size={12} /> {task.attachments}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <button className="w-full py-3 border border-dashed border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/10 hover:text-white/40 hover:border-white/20 transition-all">
              Add Task
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
