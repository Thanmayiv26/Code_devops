"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaLLMProvider = void 0;
const axios_1 = __importDefault(require("axios"));
class OllamaLLMProvider {
    constructor(options) {
        this.baseUrl = options?.baseUrl ?? process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
        this.model = options?.model ?? process.env.OLLAMA_MODEL ?? "llama3.1";
    }
    async plan(instruction) {
        const prompt = this.buildPrompt(instruction);
        const response = await axios_1.default.post(`${this.baseUrl}/api/generate`, {
            model: this.model,
            prompt,
            stream: false,
            options: { temperature: 0 }
        }, { timeout: 60000 });
        const text = response.data?.response ?? "";
        const json = this.extractJson(text);
        if (json && json.kind === "search" && typeof json.query === "string") {
            const plan = {
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
    buildPrompt(instruction) {
        return `You are a planning assistant that converts a user instruction into a minimal JSON plan. Only output strict JSON.\n\nUser instruction:\n${instruction}\n\nJSON schema:\n{\n  "kind": "search",\n  "query": string,\n  "budget": number | null,\n  "limit": number | null\n}\n\nRespond with only JSON.`;
    }
    extractJson(text) {
        try {
            // Try direct JSON first
            return JSON.parse(text);
        }
        catch { }
        const match = text.match(/\{[\s\S]*\}/);
        if (!match)
            return null;
        try {
            return JSON.parse(match[0]);
        }
        catch {
            return null;
        }
    }
}
exports.OllamaLLMProvider = OllamaLLMProvider;
