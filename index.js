#!/usr/bin/env node

/** 
 * RG Academy - Production Bootstrap v2.13 (Enhanced Debug Mode)
 * This version includes improved logging for silent crashes on Hostinger.
 */

import fs from 'fs';
import path from 'path';

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
  logEmergency(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logEmergency(`🔥 UNHANDLED REJECTION: ${reason}`);
});

// Process Heartbeat
setInterval(() => {
  console.log('💓 Heartbeat: RG Academy Server is operational.');
}, 3600000); // 1 hour heartbeat to save CPU

// Dynamic import with better error context
const serverPath = './server-dist.cjs';

logEmergency(`📦 BOOTSTRAP: Attempting to import ${serverPath}...`);

if (!fs.existsSync(serverPath)) {
  logEmergency(`❌ ERROR: ${serverPath} NOT FOUND! Run ZIP_FOR_HOSTINGER.bat before deploying.`);
  process.exit(1);
}

import(serverPath).then(() => {
  logEmergency('✅ BOOTSTRAP: Server logic imported successfully.');
}).catch((error) => {
  logEmergency(`❌ BOOTSTRAP: Server failed to boot! Error: ${error.message}`);
  logEmergency(error.stack);
  process.exit(1);
});
