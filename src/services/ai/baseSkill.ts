/**
 * Abstract class for AI Skills in the Red Griffin ecosystem.
 * Defines the contract for all intelligent node capabilities.
 */
export abstract class BaseSkill {
  protected abstract name: string;
  protected abstract description: string;

  /**
   * Retrieves the human-readable name of the skill.
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Retrieves a brief description of the skill's purpose.
   */
  public getDescription(): string {
    return this.description;
  }

  /**
   * Core execution logic for the AI skill.
   * @param params Parameters required for the skill's execution.
   * @returns A promise resolving to the result of the execution.
   */
  public abstract execute(params: any): Promise<any>;
}
