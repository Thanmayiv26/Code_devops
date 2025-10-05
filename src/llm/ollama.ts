import axios from "axios";
import { AgentPlan } from "../types";

export class OllamaLLMProvider {
  private baseUrl: string;
  private model: string;

  constructor(options?: { baseUrl?: string; model?: string }) {
    this.baseUrl = options?.baseUrl ?? process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
    this.model = options?.model ?? process.env.OLLAMA_MODEL ?? "llama3.1";
  }

  async plan(instruction: string): Promise<AgentPlan> {
    const prompt = this.buildPrompt(instruction);
    const response = await axios.post(
      `${this.baseUrl}/api/generate`,
      {
        model: this.model,
        prompt,
        stream: false,
        options: { temperature: 0 }
      },
      { timeout: 60_000 }
    );
    const text: string = response.data?.response ?? "";
    const json = this.extractJson(text);

    if (json && json.kind === "search" && typeof json.query === "string") {
      const plan: AgentPlan = {
        kind: "search",
        query: json.query,
        budget: typeof json.budget === "number" ? json.budget : undefined,
        limit: typeof json.limit === "number" ? json.limit : undefined,
      };
      return plan;
    }

    // Fallback to a simple interpretation if parsing failed
    return { kind: "search", query: instruction, limit: 5 };
  }

  private buildPrompt(instruction: string): string {
    return `You are a planning assistant that converts a user instruction into a minimal JSON plan. Only output strict JSON.\n\nUser instruction:\n${instruction}\n\nJSON schema:\n{\n  "kind": "search",\n  "query": string,\n  "budget": number | null,\n  "limit": number | null\n}\n\nRespond with only JSON.`;
  }

  private extractJson(text: string): any | null {
    try {
      // Try direct JSON first
      return JSON.parse(text);
    } catch {}
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

export type OllamaLLMProviderType = OllamaLLMProvider;
