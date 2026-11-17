import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');
const screenshotsDir = path.resolve(publicDir, 'screenshots');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// 1. Standard SVG Icon Source (Obsidian, Emerald & Cyan with rounded corners)
const standardSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="kp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="50%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
    <radialGradient id="kp-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#020617" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Deep Obsidian Dark Background -->
  <rect width="512" height="512" rx="112" fill="#020617" />
  
  <!-- Subtle Glowing Core -->
  <circle cx="256" cy="256" r="210" fill="url(#kp-glow)" />
  
  <!-- Border outline -->
  <rect x="16" y="16" width="480" height="480" rx="96" fill="none" stroke="#1e293b" stroke-width="8" />

  <!-- Terminal Bracket & Heartbeat Pulse Line -->
  <path d="M 140 180 L 80 256 L 140 332" fill="none" stroke="url(#kp-grad)" stroke-width="32" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M 372 180 L 432 256 L 372 332" fill="none" stroke="url(#kp-grad)" stroke-width="32" stroke-linecap="round" stroke-linejoin="round" />
  
  <!-- Pulse Wave across center -->
  <path d="M 170 256 L 210 256 L 235 170 L 275 342 L 305 256 L 342 256" fill="none" stroke="#10b981" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" />

  <!-- Cyan Node Dot -->
  <circle cx="256" cy="256" r="14" fill="#38bdf8" />
</svg>`;

// 2. Maskable SVG Icon Source (Full-bleed background with 20% safe zone padding for Android circular/squircle masks)
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="kp-m-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="50%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
    <radialGradient id="kp-m-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#020617" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Full-bleed background for maskable icon (NO rounded corners) -->
  <rect width="512" height="512" fill="#020617" />
  
  <!-- Safe Zone Core (Scaled to 76% to prevent Android circle/squircle clipping) -->
  <g transform="translate(61.44, 61.44) scale(0.76)">
    <circle cx="256" cy="256" r="220" fill="url(#kp-m-glow)" />
    
    <rect x="20" y="20" width="472" height="472" rx="96" fill="none" stroke="#1e293b" stroke-width="10" />

    <!-- Terminal Brackets -->
    <path d="M 140 180 L 80 256 L 140 332" fill="none" stroke="url(#kp-m-grad)" stroke-width="34" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 372 180 L 432 256 L 372 332" fill="none" stroke="url(#kp-m-grad)" stroke-width="34" stroke-linecap="round" stroke-linejoin="round" />
    
    <!-- Pulse Wave -->
    <path d="M 170 256 L 210 256 L 235 170 L 275 342 L 305 256 L 342 256" fill="none" stroke="#10b981" stroke-width="30" stroke-linecap="round" stroke-linejoin="round" />

    <!-- Node Dot -->
    <circle cx="256" cy="256" r="16" fill="#38bdf8" />
  </g>
</svg>`;

async function generateAssets() {
  console.log('Generating PWA Icons & Multi-Screen Assets for PWABuilder & Play Store...');

  // Save updated icon.svg
  fs.writeFileSync(path.resolve(publicDir, 'icon.svg'), standardSvg);

  const stdBuffer = Buffer.from(standardSvg);
  const maskBuffer = Buffer.from(maskableSvg);

  // 1. Phone Icons
  await sharp(stdBuffer).resize(192, 192).png().toFile(path.resolve(publicDir, 'pwa-192x192.png'));
  console.log('Created pwa-192x192.png (Phone)');

  await sharp(maskBuffer).resize(192, 192).png().toFile(path.resolve(publicDir, 'pwa-maskable-192x192.png'));
  console.log('Created pwa-maskable-192x192.png (Phone Maskable)');

  // 2. Play Store & Tablet / Computer Icons (512x512)
  await sharp(stdBuffer).resize(512, 512).png().toFile(path.resolve(publicDir, 'pwa-512x512.png'));
  console.log('Created pwa-512x512.png (Tablet & Desktop & Google Play)');

  await sharp(maskBuffer).resize(512, 512).png().toFile(path.resolve(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Created pwa-maskable-512x512.png (Android Adaptive Play Store)');

  // 3. Apple Touch Icon (180x180 PNG)
  await sharp(stdBuffer).resize(180, 180).png().toFile(path.resolve(publicDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png (iOS)');

  // 4. Smaller intermediate icons (64x64, 128x128, 256x256, 384x384)
  await sharp(stdBuffer).resize(64, 64).png().toFile(path.resolve(publicDir, 'pwa-64x64.png'));
  await sharp(stdBuffer).resize(128, 128).png().toFile(path.resolve(publicDir, 'pwa-128x128.png'));
  await sharp(stdBuffer).resize(256, 256).png().toFile(path.resolve(publicDir, 'pwa-256x256.png'));
  await sharp(stdBuffer).resize(384, 384).png().toFile(path.resolve(publicDir, 'pwa-384x384.png'));
  console.log('Created 64px, 128px, 256px, 384px intermediate icons');

  // 5. Generate high-res screenshots for PWABuilder (Narrow for Phone, Wide for Tablet/Computer)
  // Narrow Phone Screenshot (1080x1920)
  const narrowScreenshotSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
    <rect width="1080" height="1920" fill="#020617"/>
    <!-- Top Bar -->
    <rect width="1080" height="140" fill="#0f172a"/>
    <text x="60" y="85" fill="#10b981" font-family="monospace" font-size="38" font-weight="bold">KernelPulse</text>
    <text x="320" y="85" fill="#64748b" font-family="monospace" font-size="28">DEV &amp; HACKER NET</text>
    <circle cx="980" cy="70" r="30" fill="#1e293b"/>
    <circle cx="890" cy="70" r="30" fill="#1e293b"/>
    
    <!-- Hero / Status Card -->
    <rect x="60" y="180" width="960" height="260" rx="32" fill="#0f172a" stroke="#1e293b" stroke-width="3"/>
    <text x="110" y="250" fill="#38bdf8" font-family="sans-serif" font-size="34" font-weight="bold">AetherKernel: Zero-Copy Microkernel</text>
    <text x="110" y="305" fill="#94a3b8" font-family="sans-serif" font-size="26">Lock-free IPC ring buffer with cacheline alignment. 96% match score.</text>
    <rect x="110" y="350" width="220" height="50" rx="14" fill="#10b981"/>
    <text x="155" y="384" fill="#020617" font-family="sans-serif" font-size="24" font-weight="bold">PAIR IN IDE</text>

    <!-- Code Editor Box -->
    <rect x="60" y="480" width="960" height="680" rx="32" fill="#050a18" stroke="#10b981" stroke-width="2"/>
    <rect x="60" y="480" width="960" height="80" rx="32" fill="#0f172a"/>
    <text x="110" y="530" fill="#10b981" font-family="monospace" font-size="28">spsc_ring.rs</text>
    <text x="340" y="530" fill="#64748b" font-family="monospace" font-size="24">[RUST SYSTEMS]</text>
    
    <text x="110" y="620" fill="#f43f5e" font-family="monospace" font-size="26">#[repr(align(64))]</text>
    <text x="110" y="670" fill="#38bdf8" font-family="monospace" font-size="26">pub struct SpscRing&lt;T, const CAP: usize&gt; {</text>
    <text x="150" y="720" fill="#94a3b8" font-family="monospace" font-size="26">    buffer: [Option&lt;T&gt;; CAP],</text>
    <text x="150" y="770" fill="#94a3b8" font-family="monospace" font-size="26">    head: AtomicUsize,</text>
    <text x="150" y="820" fill="#10b981" font-family="monospace" font-size="26">    _pad0: [u8; 56], // 64-byte L1 cache separation</text>
    <text x="150" y="870" fill="#94a3b8" font-family="monospace" font-size="26">    tail: AtomicUsize,</text>
    <text x="110" y="920" fill="#38bdf8" font-family="monospace" font-size="26">}</text>
    
    <!-- Feed Card -->
    <rect x="60" y="1200" width="960" height="480" rx="32" fill="#0f172a" stroke="#1e293b" stroke-width="3"/>
    <circle cx="130" cy="1280" r="40" fill="#10b981"/>
    <text x="200" y="1275" fill="#f8fafc" font-family="sans-serif" font-size="32" font-weight="bold">Elena Rostova</text>
    <text x="200" y="1315" fill="#64748b" font-family="monospace" font-size="24">@elena_kernel · eBPF Core Dev</text>
    <text x="100" y="1400" fill="#e2e8f0" font-family="sans-serif" font-size="28">PacketProbe v2 shipped with zero-overhead container namespace telemetry.</text>
    <rect x="100" y="1470" width="300" height="60" rx="16" fill="#1e293b"/>
    <text x="135" y="1510" fill="#38bdf8" font-family="monospace" font-size="24">★ 4,200 STARS</text>

    <!-- Bottom Navigation Bar -->
    <rect y="1760" width="1080" height="160" fill="#020617" stroke="#1e293b" stroke-width="2"/>
    <circle cx="180" cy="1830" r="28" fill="#10b981"/>
    <circle cx="360" cy="1830" r="28" fill="#1e293b"/>
    <circle cx="540" cy="1830" r="28" fill="#1e293b"/>
    <circle cx="720" cy="1830" r="28" fill="#1e293b"/>
    <circle cx="900" cy="1830" r="28" fill="#1e293b"/>
  </svg>`;

  await sharp(Buffer.from(narrowScreenshotSvg))
    .png()
    .toFile(path.resolve(screenshotsDir, 'screenshot-phone.png'));
  console.log('Created screenshot-phone.png (form_factor: narrow)');

  // Wide Tablet / Desktop Screenshot (1920x1080)
  const wideScreenshotSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
    <rect width="1920" height="1080" fill="#020617"/>
    
    <!-- Top Header -->
    <rect width="1920" height="80" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
    <text x="60" y="50" fill="#10b981" font-family="monospace" font-size="26" font-weight="bold">KernelPulse</text>
    <text x="240" y="50" fill="#64748b" font-family="monospace" font-size="18">DEV &amp; HACKER NETWORK · TABLET &amp; DESKTOP VIEW</text>

    <!-- Left Column: Repos & Sprints -->
    <rect x="60" y="120" width="480" height="900" rx="24" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
    <text x="90" y="170" fill="#f8fafc" font-family="sans-serif" font-size="22" font-weight="bold">Open Source Repositories</text>
    
    <rect x="85" y="210" width="430" height="140" rx="16" fill="#020617" stroke="#10b981" stroke-width="1"/>
    <text x="110" y="250" fill="#10b981" font-family="sans-serif" font-size="18" font-weight="bold">AetherKernel (Rust)</text>
    <text x="110" y="285" fill="#94a3b8" font-family="sans-serif" font-size="14">Zero-copy microkernel IPC ring buffer</text>
    <text x="110" y="325" fill="#38bdf8" font-family="monospace" font-size="14">★ 1,420 · 218 forks · 3 PRs</text>

    <rect x="85" y="370" width="430" height="140" rx="16" fill="#020617" stroke="#1e293b" stroke-width="1"/>
    <text x="110" y="410" fill="#f8fafc" font-family="sans-serif" font-size="18" font-weight="bold">PulseAST (Rust/Compilers)</text>
    <text x="110" y="445" fill="#94a3b8" font-family="sans-serif" font-size="14">SIMD lexing &amp; arena allocator (4.8x swc)</text>
    <text x="110" y="485" fill="#38bdf8" font-family="monospace" font-size="14">★ 2,840 · 340 forks · 5 PRs</text>

    <!-- Middle Column: Live IDE & Concurrency Analysis -->
    <rect x="580" y="120" width="760" height="900" rx="24" fill="#050a18" stroke="#1e293b" stroke-width="2"/>
    <rect x="580" y="120" width="760" height="60" rx="24" fill="#0f172a"/>
    <text x="610" y="158" fill="#10b981" font-family="monospace" font-size="18">spsc_ring.rs</text>
    <text x="760" y="158" fill="#38bdf8" font-family="monospace" font-size="14">[SHARED PAIR CODING · 3 ACTIVE COLLABORATORS]</text>

    <text x="620" y="230" fill="#f43f5e" font-family="monospace" font-size="17">#[repr(align(64))]</text>
    <text x="620" y="270" fill="#38bdf8" font-family="monospace" font-size="17">pub struct SpscRing&lt;T, const CAP: usize&gt; {</text>
    <text x="660" y="310" fill="#94a3b8" font-family="monospace" font-size="17">    buffer: [Option&lt;T&gt;; CAP],</text>
    <text x="660" y="350" fill="#94a3b8" font-family="monospace" font-size="17">    head: AtomicUsize,</text>
    <text x="660" y="390" fill="#10b981" font-family="monospace" font-size="17">    _pad0: [u8; 56], // Isolated producer cache line</text>
    <text x="660" y="430" fill="#94a3b8" font-family="monospace" font-size="17">    tail: AtomicUsize,</text>
    <text x="620" y="470" fill="#38bdf8" font-family="monospace" font-size="17">}</text>

    <!-- Right Column: Direct Messaging & Pair Chat -->
    <rect x="1380" y="120" width="480" height="900" rx="24" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
    <text x="1410" y="170" fill="#f8fafc" font-family="sans-serif" font-size="22" font-weight="bold">Elena Rostova (@elena_kernel)</text>
    <text x="1410" y="200" fill="#10b981" font-family="monospace" font-size="14">Active now · eBPF Core Hacker</text>

    <rect x="1410" y="230" width="420" height="130" rx="18" fill="#1e293b"/>
    <text x="1430" y="270" fill="#f8fafc" font-family="sans-serif" font-size="15">L1/L2 cacheline isolation verified on ARM64.</text>
    <text x="1430" y="300" fill="#f8fafc" font-family="sans-serif" font-size="15">Zero dropped packets at 100Gbps SYN flood!</text>
    <text x="1430" y="340" fill="#10b981" font-family="sans-serif" font-size="14">🔥 2 · 🚀 1</text>
  </svg>`;

  await sharp(Buffer.from(wideScreenshotSvg))
    .png()
    .toFile(path.resolve(screenshotsDir, 'screenshot-desktop.png'));
  console.log('Created screenshot-desktop.png (form_factor: wide)');

  console.log('All PWA and Play Store assets successfully generated!');
}

generateAssets().catch(err => {
  console.error('Asset generation failed:', err);
  process.exit(1);
});
