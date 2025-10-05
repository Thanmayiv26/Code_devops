#!/usr/bin/env node
import { runAgent } from "./agent";

async function main() {
  const instruction = process.argv.slice(2).join(" ").trim();
  if (!instruction) {
    console.error("Usage: npm start -- \"<instruction>\"");
    console.error("Example: npm start -- \"search for laptops under 50k and list top 5\"");
    process.exit(1);
  }
  try {
    const output = await runAgent(instruction);
    // Print structured JSON to stdout
    process.stdout.write(JSON.stringify(output, null, 2) + "\n");
  } catch (err: any) {
    console.error("Error:", err?.message || err);
    process.exit(1);
  }
}

main();
