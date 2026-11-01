/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { spawn, execSync, exec } from 'node:child_process';
import http from 'node:http';

console.clear();
console.log('\x1b[35m' + '='.repeat(70) + '\x1b[0m');
console.log('\x1b[1m\x1b[35m   🌸 ASTRACARE - AI-BASED WOMEN\'S HEALTH PLATFORM\x1b[0m');
console.log('\x1b[35m' + '='.repeat(70) + '\x1b[0m\n');

// 1. Terminate any previous orphaned processes on ports 5000 and 3000
function freePort(port) {
  try {
    if (process.platform === 'win32') {
      const output = execSync(`netstat -ano | findstr :${port} | findstr LISTENING`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore'],
      });
      const lines = output.trim().split('\n');
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && !isNaN(Number(pid)) && Number(pid) > 0) {
          execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
        }
      }
    }
  } catch {
    // Port is free
  }
}

console.log('\x1b[36m[*] Initializing network environment...\x1b[0m');
freePort(5000);
freePort(3000);

// 2. Start Backend API Server
console.log('\x1b[36m[*] Starting Backend API Server (Port 5000)...\x1b[0m');
const backend = spawn('npm', ['run', 'server'], {
  shell: true,
  stdio: ['ignore', 'pipe', 'pipe'],
});

backend.stdout.on('data', (data) => {
  const msg = data.toString().trim();
  if (msg) console.log(`\x1b[90m[Backend]\x1b[0m ${msg}`);
});

backend.stderr.on('data', (data) => {
  const msg = data.toString().trim();
  if (msg) console.error(`\x1b[31m[Backend Error]\x1b[0m ${msg}`);
});

// 3. Start Frontend Vite Server
console.log('\x1b[36m[*] Starting Vite Web Server (Port 3000)...\x1b[0m');
const frontend = spawn('npm', ['run', 'dev'], {
  shell: true,
  stdio: ['ignore', 'pipe', 'pipe'],
});

frontend.stdout.on('data', (data) => {
  const msg = data.toString().trim();
  if (msg) console.log(`\x1b[90m[Vite]\x1b[0m ${msg}`);
});

frontend.stderr.on('data', (data) => {
  const msg = data.toString().trim();
  if (msg) console.error(`\x1b[31m[Vite Error]\x1b[0m ${msg}`);
});

// 4. Helper to wait until the web app is ready
function waitForUrl(url, timeoutMs = 25000) {
  const startTime = Date.now();
  return new Promise((resolve) => {
    const check = () => {
      http
        .get(url, () => resolve(true))
        .on('error', () => {
          if (Date.now() - startTime > timeoutMs) {
            resolve(false);
          } else {
            setTimeout(check, 500);
          }
        });
    };
    check();
  });
}

// 5. Open browser once ready
console.log('\x1b[33m[*] Waiting for application servers to respond...\x1b[0m');
waitForUrl('http://localhost:3000').then((ready) => {
  const url = 'http://localhost:3000';
  console.log('\n\x1b[32m' + '='.repeat(70) + '\x1b[0m');
  console.log('\x1b[1m\x1b[32m   ✓ AstraCare is Live & Ready on the Web!\x1b[0m');
  console.log('\x1b[32m' + '='.repeat(70) + '\x1b[0m');
  console.log(`\x1b[1m  • Web App URL:\x1b[0m     \x1b[36m${url}\x1b[0m`);
  console.log(`\x1b[1m  • Backend API:\x1b[0m     \x1b[36mhttp://localhost:5000/api/health\x1b[0m`);
  console.log('\x1b[32m' + '-'.repeat(70) + '\x1b[0m');
  console.log('  Opening your web browser now...');
  console.log('  \x1b[90m(Keep this terminal open while using AstraCare. Press Ctrl+C to stop)\x1b[0m\n');

  if (process.platform === 'win32') {
    exec(`start "" "${url}"`);
  } else if (process.platform === 'darwin') {
    exec(`open "${url}"`);
  } else {
    exec(`xdg-open "${url}"`);
  }
});

// 6. Cleanup handler on exit
function shutdown() {
  console.log('\n\x1b[33m[*] Shutting down AstraCare servers...\x1b[0m');
  try {
    if (process.platform === 'win32') {
      if (backend.pid) execSync(`taskkill /F /T /PID ${backend.pid}`, { stdio: 'ignore' });
      if (frontend.pid) execSync(`taskkill /F /T /PID ${frontend.pid}`, { stdio: 'ignore' });
    } else {
      backend.kill('SIGTERM');
      frontend.kill('SIGTERM');
    }
  } catch {}
  freePort(5000);
  freePort(3000);
  console.log('\x1b[32m[✓] AstraCare services stopped cleanly.\x1b[0m');
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
