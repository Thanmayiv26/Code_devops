import { AgentPlan } from "../types";
import { getLLMProvider } from "../llm";
import { MockLLMProvider } from "../llm/mock";

export async function createPlan(instruction: string): Promise<AgentPlan> {
  const provider = getLLMProvider();
  try {
    const plan = await provider.plan(instruction);
    if (plan?.kind === "search" && plan.query) return plan;
  } catch {}
  // Fallback to mock/rule-based planning
  const mock = new MockLLMProvider();
  return mock.plan(instruction);
}
