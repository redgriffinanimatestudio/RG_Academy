import { BaseSkill } from '../baseSkill';
import { getGeminiModel } from '../geminiProvider';

/**
 * TrajectoryAnalysisSkill: Analyzes student tech_stack and recommends the next neural node.
 * Integrates directly with the Red Griffin Trajectory Hub.
 */
export class TrajectoryAnalysisSkill extends BaseSkill {
  protected name = 'Trajectory Analysis';
  protected description = 'Neural evaluation of skill symmetry and career trajectory optimization.';

  /**
   * Executes the analysis using Gemini 1.5 Flash.
   * @param params Object containing student techStack and current goals.
   */
  public async execute(params: { techStack: any[]; currentRank: string; goal: string }): Promise<any> {
    const model = getGeminiModel();
    
    const prompt = `
      As the Red Griffin Oracle Engine, analyze the following student ecosystem profile:
      - TECH_STACK: ${JSON.stringify(params.techStack)}
      - CURRENT_RANK: ${params.currentRank}
      - TARGET_GOAL: ${params.goal || 'Senior Technical Artist'}

      TASK:
      1. Identify the most significant "Symmetry Delta" (missing or weak skill).
      2. Recommend the next "Neural Node" (workshop or topic) to master.
      3. Provide a brief, high-authority industrial recommendation (max 3 sentences).

      Format response as a clean JSON object with keys: "delta", "recommendation", "insight".
    `;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      // Attempt to parse JSON if Gemini followed instructions
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: text };
      } catch (e) {
        return { raw: text };
      }
    } catch (error) {
      console.error('[AI_SKILL_ERROR] TrajectoryAnalysis failed:', error);
      throw error;
    }
  }
}
