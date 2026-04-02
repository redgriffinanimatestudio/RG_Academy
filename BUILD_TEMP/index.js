#!/usr/bin/env node

/** 
 * RG Academy - Production Bootstrap v2.17 (Pure CJS Edition)
 * This version safely logs and boots the application without ESM conflicts on Hostinger.
 */

const fs = require('fs');
const path = require('path');

// Local log file for emergency capture if stdout is suppressed
const EMERGENCY_LOG = 'startup_debug.log';

function logEmergency(msg) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${msg}\n`;
  console.log(msg);
  try {
    fs.appendFileSync(EMERGENCY_LOG, entry);
  } catch (e) {
    // Ignore log failures
  }
}

logEmergency('🚀 BOOTSTRAP: RG Academy Native Server initializing...');

// Global Error Handlers
process.on('uncaughtException', (err) => {
  logEmergency(`🔥 FATAL EXCEPTION: ${err.message}`);
  if (err.stack) logEmergency(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logEmergency(`🔥 UNHANDLED REJECTION: ${reason}`);
});

// Process Heartbeat
setInterval(() => {
  console.log('💓 Heartbeat: RG Academy Server is operational.');
}, 3600000); // 1 hour heartbeat to save CPU

// Require compiled backend synchronously to avoid Passenger async issues
const serverPath = './server-dist.cjs';

logEmergency(`📦 BOOTSTRAP: Attempting to require ${serverPath}...`);

if (!fs.existsSync(serverPath)) {
  logEmergency(`❌ ERROR: ${serverPath} NOT FOUND! Run deployment sync.`);
  process.exit(1);
}

try {
  require(serverPath);
  logEmergency('✅ BOOTSTRAP: Server logic imported successfully.');
} catch (error) {
  logEmergency(`❌ BOOTSTRAP: Server failed to boot! Error: ${error.message}`);
  if (error.stack) logEmergency(error.stack);
  process.exit(1);
}
