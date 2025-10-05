"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAgent = runAgent;
const planner_1 = require("./planner");
const executor_1 = require("./executor");
async function runAgent(instruction) {
    const plan = await (0, planner_1.createPlan)(instruction);
    switch (plan.kind) {
        case "search": {
            const results = await (0, executor_1.executeSearch)(plan.query, { limit: plan.limit ?? 5, budget: plan.budget });
            return { task: "search", plan, results };
        }
        default:
            throw new Error(`Unsupported plan kind: ${String(plan.kind)}`);
    }
}
