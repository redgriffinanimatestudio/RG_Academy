export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required: string[];
  };
}

export interface AgentConfig {
  baseUrl: string;
  modelId: string;
  temperature: number;
  systemPrompt: string;
}

class EdgeAgentService {
  private config: AgentConfig = {
    baseUrl: 'http://localhost:1234/v1', // LM Studio Default
    modelId: 'function-gemma-270m',
    temperature: 0.1,
    systemPrompt: 'You are an industrial tool-calling agent for RG Academy. Use provided tools to fulfill requests.'
  };

  /**
   * Format the special FunctionGemma prompt template for tool calling.
   */
  private formatPrompt(query: string, tools: ToolDefinition[]): string {
    return `<start_of_turn>user\n<tool_code>\n${JSON.stringify(tools, null, 2)}\n</tool_code>\nInput question: ${query}<end_of_turn>\n<start_of_turn>model\n`;
  }

  async callAgent(query: string, tools: ToolDefinition[]): Promise<any> {
    const prompt = this.formatPrompt(query, tools);
    console.log(`[EDGE_AGENT] Neural Uplink Initialized. Prompt Length: ${prompt.length}`);

    try {
      const response = await fetch(`${this.config.baseUrl}/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.config.modelId,
          prompt: prompt,
          temperature: this.config.temperature,
          stop: ['<end_of_turn>', '<tool_response>'],
          max_tokens: 1024
        })
      });

      const data = await response.json();
      const text = data.choices[0].text;

      // Check for tool call in the response
      const toolCallMatch = text.match(/<tool_call>\n([\s\S]*?)\n<\/tool_call>/);
      if (toolCallMatch) {
         try {
           return { type: 'tool_call', data: JSON.parse(toolCallMatch[1]) };
         } catch (e) {
           console.error("[EDGE_AGENT] Failed to parse tool call JSON", e);
           return { type: 'text', data: text };
         }
      }

      return { type: 'text', data: text };
    } catch (error) {
      console.error("[EDGE_AGENT] Uplink Error:", error);
      throw new Error("Neural Link Failed: Local LM Studio node not detected.");
    }
  }

  updateConfig(newConfig: Partial<AgentConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}

export const edgeAgentService = new EdgeAgentService();
