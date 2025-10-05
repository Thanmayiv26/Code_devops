import { AgentPlan } from "../types";

function parseBudget(instruction: string): number | undefined {
  const text = instruction.toLowerCase();
  const match = text.match(/(?:under|below)\s*(?:₹|rs\.?\s*|inr\s*)?(\d{1,3}(?:[\,\s]\d{2,3})+|\d+(?:\.\d+)?)(?:\s*(k|thousand|lakh|lac|m|million|cr|crore))?/i);
  if (!match) return undefined;
  const raw = match[1].replace(/[\s,]/g, "");
  const unit = (match[2] || "").toLowerCase();
  let value = parseFloat(raw);
  if (Number.isNaN(value)) return undefined;
  switch (unit) {
    case "k":
    case "thousand":
      value *= 1_000; break;
    case "lakh":
    case "lac":
      value *= 100_000; break;
    case "m":
    case "million":
      value *= 1_000_000; break;
    case "cr":
    case "crore":
      value *= 10_000_000; break;
  }
  return Math.round(value);
}

function parseLimit(instruction: string): number | undefined {
  const m = instruction.toLowerCase().match(/(?:top|first)\s*(\d{1,3})/);
  return m ? parseInt(m[1], 10) : undefined;
}

function parseQuery(instruction: string): string {
  // Remove phrases like "under 50k", "below 50000", and "list top 5" from the query
  let q = instruction
    .replace(/\b(list\s+)?(?:top|first)\s*\d{1,3}\b/i, "")
    .replace(/\b(?:under|below)\s*(?:₹|rs\.?\s*|inr\s*)?(\d{1,3}(?:[\,\s]\d{2,3})+|\d+(?:\.\d+)?)(?:\s*(k|thousand|lakh|lac|m|million|cr|crore))?\b/i, "")
    .trim();
  if (!q) q = instruction.trim();
  return q;
}

export class MockLLMProvider {
  async plan(instruction: string): Promise<AgentPlan> {
    const budget = parseBudget(instruction);
    const limit = parseLimit(instruction) ?? 5;
    const query = parseQuery(instruction);
    return { kind: "search", query, budget, limit };
  }
}

export type MockLLMProviderType = MockLLMProvider;
