#!/usr/bin/env node

/** 
 * RG Academy - Production Bootstrap v2.12 (Error Trapping Mode)
 * This version includes global handlers for silent crashes and a heartbeat mechanism.
 */

// Global Error Handlers - Log errors even if they are not in Express context
process.on('uncaughtException', (err) => {
  console.error('🔥 FATAL EXCEPTION (process.on):', err.message);
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 UNHANDLED REJECTION:', reason);
});

// Process Heartbeat - Prove that the process is still alive every 30s
setInterval(() => {
  console.log('💓 Heartbeat: RG Academy Server process is alive at ' + new Date().toISOString());
}, 30000);

console.log('🚀 Starting RG Academy Native Server (v2.12 Error Trapping)...');

import('./server-dist.js').catch((error) => {
  console.error('❌ Server failed to boot!', error.message);
  console.error(error.stack);
  process.exit(1);
});
