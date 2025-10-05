import { chromium, Browser, Page } from "playwright";
import { SearchResult } from "../types";
import { extractFromBing, extractFromDuckDuckGo, enrichAndFilterByBudget } from "../extractor/search";

export async function executeSearch(query: string, options?: { limit?: number; budget?: number }): Promise<SearchResult[]> {
  const headless = process.env.HEADLESS !== "false";
  const browser: Browser = await chromium.launch({ headless });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page: Page = await context.newPage();

  let results: SearchResult[] = [];
  try {
    // Try Bing first for stable selectors
    const bingUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
    await page.goto(bingUrl, { waitUntil: "domcontentloaded", timeout: 45_000 });
    results = await extractFromBing(page, Math.max(options?.limit ?? 5, 10));

    if (results.length < (options?.limit ?? 5)) {
      const ddgUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
      await page.goto(ddgUrl, { waitUntil: "domcontentloaded", timeout: 45_000 });
      const more = await extractFromDuckDuckGo(page, Math.max(options?.limit ?? 5, 10));
      results = [...results, ...more];
    }
  } finally {
    await page.close();
    await context.close();
    await browser.close();
  }

  return enrichAndFilterByBudget(results, options?.budget, options?.limit ?? 5);
}
