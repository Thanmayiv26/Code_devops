import { AgentOutput } from "./types";
import { createPlan } from "./planner";
import { executeSearch } from "./executor";

export async function runAgent(instruction: string): Promise<AgentOutput> {
  const plan = await createPlan(instruction);
  switch (plan.kind) {
    case "search": {
      const results = await executeSearch(plan.query, { limit: plan.limit ?? 5, budget: plan.budget });
      return { task: "search", plan, results };
    }
    default:
      throw new Error(`Unsupported plan kind: ${String((plan as any).kind)}`);
  }
}
