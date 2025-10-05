"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeSearch = executeSearch;
const playwright_1 = require("playwright");
const search_1 = require("../extractor/search");
async function executeSearch(query, options) {
    const headless = process.env.HEADLESS !== "false";
    const browser = await playwright_1.chromium.launch({ headless });
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    let results = [];
    try {
        // Try Bing first for stable selectors
        const bingUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
        await page.goto(bingUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
        results = await (0, search_1.extractFromBing)(page, Math.max(options?.limit ?? 5, 10));
        if (results.length < (options?.limit ?? 5)) {
            const ddgUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
            await page.goto(ddgUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
            const more = await (0, search_1.extractFromDuckDuckGo)(page, Math.max(options?.limit ?? 5, 10));
            results = [...results, ...more];
        }
    }
    finally {
        await page.close();
        await context.close();
        await browser.close();
    }
    return (0, search_1.enrichAndFilterByBudget)(results, options?.budget, options?.limit ?? 5);
}
