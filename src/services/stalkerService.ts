import { academyService, Lesson, Module } from './academyService';

export interface StalkerDialogue {
  id: string;
  message: string;
  type: 'proactive' | 'reactive';
  options?: { label: string; action: string; nextNode?: string }[];
  timestamp: number;
}

class StalkerService {
  private lastAnalyzedNode: string | null = null;

  /**
   * Proactively analyze the student's current position and progress
   * to determine the "Next Best Action" (NBA).
   */
  async analyzeProgress(profile: any, currentLesson: Lesson | null): Promise<StalkerDialogue | null> {
    if (!profile || profile.learningMode !== 'STALKER') return null;
    if (currentLesson?.id === this.lastAnalyzedNode) return null;

    this.lastAnalyzedNode = currentLesson?.id || 'root';

    // Industry-specific logic mocks
    if (!currentLesson) {
      return {
        id: 'welcome_stalker',
        message: `Welcome back, Specialist ${profile.displayName?.split(' ')[0]}. I see you're ready to resume the Unreal Engine Trajectory. Shall we jump straight into the Niagara Fluid modules?`,
        type: 'proactive',
        options: [
          { label: 'Initiate Sync', action: 'RESUME_NODE' },
          { label: 'Review Logistics', action: 'OPEN_SYLLABUS' }
        ],
        timestamp: Date.now()
      };
    }

    // Context-Aware Trigger: Check lesson completion
    const isCompleted = profile.completedLessons?.includes(currentLesson.id);
    if (isCompleted) {
        return {
           id: `post_completion_${currentLesson.id}`,
           message: `Synchronicity confirmed. You've mastered ${currentLesson.title}. Should we optimize with the next theoretical node, or leap into the Practical Laboratory for this sector?`,
           type: 'proactive',
           options: [
             { label: 'Proceed to Next Node', action: 'NEXT_LESSON' },
             { label: 'Enter Lab Stage', action: 'START_PRACTICE' }
           ],
           timestamp: Date.now()
        };
    }

    // Idle Trigger: If the user is on the lesson page but not playing
    return {
       id: `idle_guidance_${currentLesson.id}`,
       message: `Specialist, I detect a sync delay. Identifying gaps in ${currentLesson.title}. Want me to summarize the key takeaways from this node?`,
       type: 'proactive',
       options: [
         { label: 'Summarize Node', action: 'GET_AI_SUMMARY' },
         { label: 'I am focused', action: 'DISMISS' }
       ],
       timestamp: Date.now()
    };
  }

  async processAction(action: string, data?: any): Promise<void> {
    console.log(`[STALKER] Executing Internal Protocol: ${action}`, data);
    // Logic to handle navigation or state changes based on AI suggestions
  }
}

export const stalkerService = new StalkerService();
