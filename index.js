#!/usr/bin/env node
import { spawn, execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting FULL DEPLOY pipeline via index.js wrapper...');

try {
  console.log('📦 Running Database Migrations (Full Deploy Automation)...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit', env: process.env });
  console.log('✅ Database schemas sync successful!');
} catch (error) {
  console.error('❌ Database migration failed! Node will crash to prevent unstable state.', error.message);
  process.exit(1);
}

const tsxPath = path.resolve(__dirname, 'node_modules', '.bin', 'tsx');
const serverPath = path.resolve(__dirname, 'server.ts');

console.log('🟢 Booting RG Academy Backend...');
const child = spawn(tsxPath, [serverPath], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'production', SKIP_VITE: 'true', PORT: process.env.PORT || 3000 }
});

child.on('error', (err) => {
  console.error('Startup Error! Native tsx executable not found. Attempting fallback via npx tsx...', err.message);
  const fallbackChild = spawn('npx', ['tsx', serverPath], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production', SKIP_VITE: 'true', PORT: process.env.PORT || 3000 },
    shell: true
  });
  fallbackChild.on('exit', (code) => process.exit(code || 1));
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
