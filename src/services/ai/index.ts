import { BaseSkill } from './baseSkill';
import { TrajectoryAnalysisSkill } from './skills/TrajectoryAnalysisSkill';

/**
 * Registry of all available AI skills in the system.
 */
export const skills = {
  trajectoryAnalysis: new TrajectoryAnalysisSkill(),
  // Add more skills here as they are implemented
};

export type SkillName = keyof typeof skills;

/**
 * Helper to execute a skill by name.
 * @param name Name of the skill to execute.
 * @param params Parameters required for the skill's execution.
 * @returns A promise resolving to the result of the execution.
 */
export const executeSkill = async (name: SkillName, params: any) => {
  const skill = skills[name];
  if (!skill) throw new Error(`Skill ${name} not found in registry.`);
  return await skill.execute(params);
};
