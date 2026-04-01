#!/usr/bin/env node

/** 
 * RG Academy - Production Bootstrap (Hostinger Compatibility Fix)
 * We use dynamic import().catch() to avoid Top-Level Await, 
 * which causes ERR_REQUIRE_ASYNC_MODULE on some Hostinger runners.
 */

console.log('🚀 Starting RG Academy Native Server (Compatibility Mode)...');

import('./server-dist.js').catch((error) => {
  console.error('❌ Server failed to boot!', error.message);
  process.exit(1);
});
