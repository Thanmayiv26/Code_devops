import { AgentPlan } from "../types";
import { MockLLMProvider } from "./mock";
import { OllamaLLMProvider } from "./ollama";

export interface LLMProvider {
  plan(instruction: string): Promise<AgentPlan>;
}

export function getLLMProvider(): LLMProvider {
  const name = (process.env.LLM_PROVIDER || "mock").toLowerCase();
  if (name === "ollama") {
    return new OllamaLLMProvider();
  }
  return new MockLLMProvider();
}
