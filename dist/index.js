#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const agent_1 = require("./agent");
async function main() {
    const instruction = process.argv.slice(2).join(" ").trim();
    if (!instruction) {
        console.error("Usage: npm start -- \"<instruction>\"");
        console.error("Example: npm start -- \"search for laptops under 50k and list top 5\"");
        process.exit(1);
    }
    try {
        const output = await (0, agent_1.runAgent)(instruction);
        // Print structured JSON to stdout
        process.stdout.write(JSON.stringify(output, null, 2) + "\n");
    }
    catch (err) {
        console.error("Error:", err?.message || err);
        process.exit(1);
    }
}
main();
