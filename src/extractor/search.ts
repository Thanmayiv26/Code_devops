import { Page } from "playwright";
import { SearchResult } from "../types";

function parsePriceValue(text?: string): { priceText?: string; priceValue?: number } {
  if (!text) return {};
  const cleaned = text.replace(/\s+/g, " ");
  const regex = /(?:₹|rs\.?\s*|inr\s*|usd\s*|\$)?\s*(\d{1,3}(?:[\,\s]\d{2,3})+|\d+(?:\.\d+)?)(?:\s*(k|thousand|lakh|lac|m|million|cr|crore))?/i;
  const m = cleaned.match(regex);
  if (!m) return {};
  const raw = m[1].replace(/[\s,]/g, "");
  const unit = (m[2] || "").toLowerCase();
  let value = parseFloat(raw);
  if (Number.isNaN(value)) return {};
  switch (unit) {
    case "k":
    case "thousand": value *= 1_000; break;
    case "lakh":
    case "lac": value *= 100_000; break;
    case "m":
    case "million": value *= 1_000_000; break;
    case "cr":
    case "crore": value *= 10_000_000; break;
  }
  return { priceText: m[0].trim(), priceValue: Math.round(value) };
}

export async function extractFromBing(page: Page, maxResults: number): Promise<SearchResult[]> {
  await page.waitForTimeout(500); // allow layout to settle
  const results = await page.locator("li.b_algo").evaluateAll((nodes) => {
    return nodes.map((n) => {
      const a = n.querySelector("h2 a");
      const title = a?.textContent?.trim() || "";
      const url = a?.getAttribute("href") || "";
      const snippet = n.querySelector(".b_caption p")?.textContent?.trim() || n.querySelector("p")?.textContent?.trim() || undefined;
      return { title, url, snippet };
    });
  });
  return results.filter(r => r.title && r.url).slice(0, maxResults);
}

export async function extractFromDuckDuckGo(page: Page, maxResults: number): Promise<SearchResult[]> {
  await page.waitForTimeout(500);
  // New DDG layout can vary; try a few selectors
  const results = await page.locator("article[data-layout], .results--main .result, .react-results--main .result").evaluateAll((nodes) => {
    return nodes.map((n) => {
      const a = n.querySelector("a[href][rel][target]") || n.querySelector("a.result__a") || n.querySelector("h2 a");
      const title = a?.textContent?.trim() || "";
      const url = a?.getAttribute("href") || "";
      const snippetNode = n.querySelector(".result__snippet") || n.querySelector(".result__body") || n.querySelector("p");
      const snippet = snippetNode?.textContent?.trim() || undefined;
      return { title, url, snippet };
    });
  });
  return results.filter(r => r.title && r.url && !r.url.startsWith("/"))
                .slice(0, maxResults);
}

export function enrichAndFilterByBudget(results: SearchResult[], budget?: number, limit: number = 5): SearchResult[] {
  const enriched = results.map((r) => {
    const combined = `${r.title} ${r.snippet ?? ""}`;
    const parsed = parsePriceValue(combined);
    return { ...r, ...parsed };
  });
  let filtered = enriched;
  if (budget && Number.isFinite(budget)) {
    const under = enriched.filter(r => typeof r.priceValue === "number" && (r.priceValue as number) <= budget);
    // If we have at least some priced results under budget, prefer them; otherwise fall back to top results
    filtered = under.length > 0 ? under : enriched;
  }
  // Deduplicate by URL
  const seen = new Set<string>();
  const unique: SearchResult[] = [];
  for (const r of filtered) {
    const key = r.url.split("#")[0];
    if (!seen.has(key)) { seen.add(key); unique.push(r); }
  }
  return unique.slice(0, limit);
}
