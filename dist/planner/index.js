"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlan = createPlan;
const llm_1 = require("../llm");
const mock_1 = require("../llm/mock");
async function createPlan(instruction) {
    const provider = (0, llm_1.getLLMProvider)();
    try {
        const plan = await provider.plan(instruction);
        if (plan?.kind === "search" && plan.query)
            return plan;
    }
    catch { }
    // Fallback to mock/rule-based planning
    const mock = new mock_1.MockLLMProvider();
    return mock.plan(instruction);
}
