/**
 * 🦾 RG ACADEMY - INDUSTRIAL UI AUDITOR
 * Version: 1.0.0
 * Purpose: Local CDP-based visual & state audit for zero-token feedback loops.
 */

import { execSync } from 'child_process';

const CDP_SCRIPT = ".agents/skills/chrome-cdp/scripts/cdp.mjs";

function runCDP(command) {
  try {
    return execSync(`node ${CDP_SCRIPT} ${command}`, { encoding: 'utf8' });
  } catch (err) {
    return `Error: ${err.message}`;
  }
}

async function performAudit() {
  console.log("===============================================");
  console.log("🦾 STARTING INDUSTRIAL UI AUDIT v1.0.0");
  console.log("===============================================");

  const list = runCDP("list");
  console.log(list);

  if (list.includes("No DevToolsActivePort found")) {
    console.log("❌ ERROR: Remote debugging not enabled. Restart Chrome with --remote-debugging-port=9222");
    return;
  }

  const match = list.match(/([A-F0-9]+)\s+RG Academy/);
  if (match) {
    const targetId = match[1];
    console.log(`✅ Targeted: ${targetId}`);
    runCDP(`shot ${targetId} audit-latest.png`);
    console.log("✅ Screenshot saved: audit-latest.png");
  } else {
    console.log("⚠️ No 'RG Academy' tab found. Ensure the app is open.");
  }
}

performAudit();
