export type AgentPlan = {
  kind: "search";
  query: string;
  budget?: number;
  limit?: number;
};

export type SearchResult = {
  title: string;
  url: string;
  snippet?: string;
  priceText?: string;
  priceValue?: number;
};

export type AgentOutput = {
  task: string;
  plan: AgentPlan;
  results: SearchResult[];
};
