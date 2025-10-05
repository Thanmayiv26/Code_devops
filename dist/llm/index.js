"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLLMProvider = getLLMProvider;
const mock_1 = require("./mock");
const ollama_1 = require("./ollama");
function getLLMProvider() {
    const name = (process.env.LLM_PROVIDER || "mock").toLowerCase();
    if (name === "ollama") {
        return new ollama_1.OllamaLLMProvider();
    }
    return new mock_1.MockLLMProvider();
}
