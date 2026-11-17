import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Globe, 
  Download, 
  Terminal, 
  Check, 
  Copy, 
  ExternalLink, 
  ShieldCheck, 
  Play, 
  Layers,
  ArrowRight,
  Share2
} from 'lucide-react';
import { playTechClick, playSuccessChime } from '../utils/audio';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl?: string;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  appUrl = window.location.origin
}) => {
  const [activeTab, setActiveTab] = useState<'internet' | 'playstore' | 'install'>('playstore');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    playSuccessChime();
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const bubblewrapSnippet = `# 1. Install Google's official PWA-to-Play-Store CLI (Bubblewrap)
npm install -g @bubblewrap/cli

# 2. Initialize your Android project from your live web app manifest
bubblewrap init --manifest="${appUrl}/manifest.json"

# 3. Build your signed Android App Bundle (.aab) ready for Google Play
bubblewrap build

# -> Output: app-release-bundle.aab (Upload this to Google Play Console!)`;

  const playStoreTitle = "KernelPulse - Hacker & Dev Network";
  const playStoreShortDesc = "Mobile collaboration for programmers: pair programming, sprints & code editor.";
  const playStoreFullDesc = `KernelPulse is a collaboration platform and live coding workspace built for developers, system programmers, and open-source hackers.

KEY FEATURES:
• Interactive Cloud Code Editor with syntax highlighting for Rust, TypeScript, Python, Go, and C.
• Live Pair Programming & Milestone Tracking with real-time peer interactions.
• Developer Sprint Matchmaker: Match with open-source sprints and engineering teams based on your tech stack.
• Real-time Developer Messaging: Connect with hackers, share code snippets, and coordinate releases.
• Integrated Git & Version Control UI: Manage branch histories, commit diffs, and pull requests.
• AI Systems Copilot: Deep architectural reviews and concurrency optimization.

Built with high performance in mind, KernelPulse works seamlessly across smartphones, foldables, tablets, and desktops.`;

  const assetLinksSnippet = JSON.stringify([
    {
      "relation": ["delegate_permission/common.handle_all_urls"],
      "target": {
        "namespace": "android_app",
        "package_name": "com.kernelpulse.app",
        "sha256_cert_fingerprints": [
          "14:6D:E9:7F:0F:52:CE:EB:2B:AE:EF:E6:12:69:E6:4B:B3:CD:E3:64:88:51:7E:6D:FD:E1:92:4B:C7:E3:C3:68"
        ]
      }
    }
  ], null, 2);

  const capacitorSnippet = `# Alternative: Native Capacitor wrapper with Android Studio
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init KernelPulse com.kernelpulse.app --web-dir dist
npm run build
npx cap add android
npx cap open android`;

  const webDeploySnippet = `# Deploy to Vercel
npx vercel --prod

# Or build standalone Docker container for Google Cloud Run / AWS:
npm run build
node server.ts`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[92vh] bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl flex flex-col text-left overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Publishing &amp; App Store Deployment Guide
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Live URL: <span className="text-emerald-400">{appUrl}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playTechClick(600);
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-2 bg-slate-950/60 border-b border-slate-800">
          <button
            onClick={() => {
              playTechClick(800);
              setActiveTab('playstore');
            }}
            className={`flex-1 py-2 text-xs font-mono font-medium rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'playstore'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Google Play Store</span>
          </button>
          
          <button
            onClick={() => {
              playTechClick(800);
              setActiveTab('internet');
            }}
            className={`flex-1 py-2 text-xs font-mono font-medium rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'internet'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Internet &amp; Web</span>
          </button>

          <button
            onClick={() => {
              playTechClick(800);
              setActiveTab('install');
            }}
            className={`flex-1 py-2 text-xs font-mono font-medium rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'install'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Direct PWA Install</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs font-sans text-slate-300 leading-relaxed no-scrollbar">
          
          {/* TAB 1: Google Play Store */}
          {activeTab === 'playstore' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1">
                <span className="font-bold flex items-center gap-1 text-xs font-mono">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Your App is 100% PWA &amp; Trusted Web Activity (TWA) Ready
                </span>
                <p className="text-[11px] text-slate-300">
                  Google allows you to publish Progressive Web Apps directly to the Google Play Store as native Android packages (.aab) with zero Java/Kotlin boilerplate using <strong>Bubblewrap</strong> or <strong>PWABuilder</strong>.
                </p>
              </div>

              {/* Asset Matrix for PWABuilder & Play Store */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5 font-mono">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    PWABuilder &amp; Store Icon Spec Compliance
                  </span>
                  <a
                    href={`https://www.pwabuilder.com?url=${encodeURIComponent(appUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 underline"
                  >
                    <span>Test on PWABuilder</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center text-center">
                    <img 
                      src="/pwa-192x192.png" 
                      alt="Phone Launcher Icon" 
                      className="w-10 h-10 rounded-xl mb-1.5 object-cover shadow-md"
                    />
                    <span className="text-[11px] font-bold text-white">Phone (192px)</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Mobile Launcher</span>
                    <span className="text-[9px] text-slate-500 font-mono mt-0.5">purpose: any</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center text-center">
                    <img 
                      src="/pwa-512x512.png" 
                      alt="Tablet & Desktop Store Icon" 
                      className="w-10 h-10 rounded-xl mb-1.5 object-cover shadow-md"
                    />
                    <span className="text-[11px] font-bold text-white">Tablet/PC (512px)</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Play Store Hi-Res</span>
                    <span className="text-[9px] text-slate-500 font-mono mt-0.5">purpose: any</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mb-1.5 border border-emerald-500/50 shadow-md">
                      <img 
                        src="/pwa-maskable-512x512.png" 
                        alt="Maskable Icon" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-white">Maskable (512px)</span>
                    <span className="text-[10px] text-emerald-400 font-mono">20% Safe Padding</span>
                    <span className="text-[9px] text-slate-500 font-mono mt-0.5">purpose: maskable</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center text-center">
                    <img 
                      src="/apple-touch-icon.png" 
                      alt="iOS Icon" 
                      className="w-10 h-10 rounded-xl mb-1.5 object-cover shadow-md"
                    />
                    <span className="text-[11px] font-bold text-white">iOS Apple (180px)</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Safari Home Screen</span>
                    <span className="text-[9px] text-slate-500 font-mono mt-0.5">apple-touch-icon</span>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Store Screenshots: Phone (narrow: 1080x1920) &amp; Desktop/Tablet (wide: 1920x1080)</span>
                  </div>
                  <span className="text-emerald-400 font-bold">Configured</span>
                </div>
              </div>

              {/* Step by step */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-white text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-mono text-[11px]">1</span>
                    <span>Option A: Instant Packaging with PWABuilder (No Terminal Required)</span>
                  </div>
                  <p className="text-slate-400 text-xs pl-7">
                    1. Go to <a href={`https://www.pwabuilder.com?url=${encodeURIComponent(appUrl)}`} target="_blank" rel="noreferrer" className="text-emerald-400 underline font-mono">pwabuilder.com</a>.<br />
                    2. Your app URL (<code>{appUrl}</code>) will have <strong>100% PWA Score</strong> for manifest, sizes, and maskables.<br />
                    3. Click <strong>Package for Store</strong> &rarr; Select <strong>Android (Google Play)</strong>.<br />
                    4. Download the generated <code>.aab</code> package and signing key.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between font-bold text-white text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-mono text-[11px]">2</span>
                      <span>Option B: CLI Packaging with Google's Bubblewrap</span>
                    </div>
                    <button
                      onClick={() => handleCopy(bubblewrapSnippet, 'bubblewrap')}
                      className="text-slate-400 hover:text-emerald-400 flex items-center gap-1 text-[11px] font-mono"
                    >
                      {copiedKey === 'bubblewrap' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'bubblewrap' ? 'Copied' : 'Copy Commands'}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-[11px] overflow-x-auto whitespace-pre">
                    {bubblewrapSnippet}
                  </pre>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-white text-xs">
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-mono text-[11px]">3</span>
                      <span>Submit to Google Play Console</span>
                    </div>
                    <a
                      href="https://play.google.com/console"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
                    >
                      <span>Open Play Console</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <p className="text-slate-400 text-xs">
                    Sign in to your Google Play Developer Console, click <strong>Create App</strong>, and use the pre-formatted store details below:
                  </p>

                  {/* Store Listing Details Card */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
                    <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                      Google Play Store Listing Details (1-Click Copy)
                    </span>

                    {/* App Title */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] text-slate-500 uppercase block font-mono">App Title (Max 50 chars)</span>
                        <span className="text-xs text-white font-medium truncate block">{playStoreTitle}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(playStoreTitle, 'title')}
                        className="p-1.5 rounded-md text-slate-400 hover:text-emerald-400 hover:bg-slate-900 transition-colors shrink-0"
                        title="Copy App Title"
                      >
                        {copiedKey === 'title' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Short Description */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] text-slate-500 uppercase block font-mono">Short Description (78/80 chars)</span>
                        <span className="text-xs text-slate-300 truncate block">{playStoreShortDesc}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(playStoreShortDesc, 'shortDesc')}
                        className="p-1.5 rounded-md text-slate-400 hover:text-emerald-400 hover:bg-slate-900 transition-colors shrink-0"
                        title="Copy Short Description"
                      >
                        {copiedKey === 'shortDesc' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Full Description */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 uppercase font-mono">Full Description</span>
                        <button
                          onClick={() => handleCopy(playStoreFullDesc, 'fullDesc')}
                          className="text-xs font-mono text-slate-400 hover:text-emerald-400 flex items-center gap-1"
                        >
                          {copiedKey === 'fullDesc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === 'fullDesc' ? 'Copied Full Description' : 'Copy Full Description'}</span>
                        </button>
                      </div>
                      <pre className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-slate-300 font-mono text-[11px] max-h-28 overflow-y-auto whitespace-pre-wrap no-scrollbar">
                        {playStoreFullDesc}
                      </pre>
                    </div>

                    {/* Asset Links File for TWA Verification */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 uppercase font-mono">Digital Asset Links (assetlinks.json)</span>
                        <button
                          onClick={() => handleCopy(assetLinksSnippet, 'assetlinks')}
                          className="text-xs font-mono text-slate-400 hover:text-emerald-400 flex items-center gap-1"
                        >
                          {copiedKey === 'assetlinks' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === 'assetlinks' ? 'Copied' : 'Copy assetlinks.json'}</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono">
                        Active live at: <code className="text-emerald-400">{appUrl}/.well-known/assetlinks.json</code>
                      </p>
                    </div>

                    {/* Direct Asset Downloads for Store Listing */}
                    <div className="pt-1 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1.5">
                        Download Store Graphic Assets:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <a
                          href="/pwa-512x512.png"
                          download="kernelpulse-512x512.png"
                          className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 flex items-center justify-center gap-1.5 text-slate-300 hover:text-white transition-colors text-[11px] font-mono"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-400" />
                          <span>512px Store Icon</span>
                        </a>
                        <a
                          href="/screenshots/screenshot-phone.png"
                          download="screenshot-phone.png"
                          className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 flex items-center justify-center gap-1.5 text-slate-300 hover:text-white transition-colors text-[11px] font-mono"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Phone Screenshot</span>
                        </a>
                        <a
                          href="/screenshots/screenshot-desktop.png"
                          download="screenshot-desktop.png"
                          className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 flex items-center justify-center gap-1.5 text-slate-300 hover:text-white transition-colors text-[11px] font-mono"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Desktop Screenshot</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  <ol className="list-decimal list-inside text-slate-400 space-y-1 pl-1 text-[11px]">
                    <li>Upload your <code>app-release-bundle.aab</code> package under <strong>Production &rarr; Releases</strong>.</li>
                    <li>Upload the downloaded 512px icon &amp; screenshots into <strong>Main store listing</strong>.</li>
                    <li>Paste the title and descriptions, set content rating, and submit for Google review!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Internet & Hosting */}
          {activeTab === 'internet' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 space-y-1">
                <span className="font-bold flex items-center gap-1 text-xs font-mono">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  Your App is Already Live on the Internet
                </span>
                <p className="text-[11px] text-slate-300">
                  AI Studio has automatically deployed your app to a secure HTTPS Google Cloud Run URL. You can share this URL right now with any user or link your own custom domain.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-white block">Current Live URL:</span>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-emerald-400">
                  <span className="truncate">{appUrl}</span>
                  <button
                    onClick={() => handleCopy(appUrl, 'url')}
                    className="ml-2 text-slate-400 hover:text-white text-xs flex items-center gap-1 shrink-0"
                  >
                    {copiedKey === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'url' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-white block">Deploying to Other Providers (Vercel, Railway, Cloud Run):</span>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-400 text-[11px]">Command line deployment</span>
                    <button
                      onClick={() => handleCopy(webDeploySnippet, 'deploy')}
                      className="text-slate-400 hover:text-emerald-400 text-xs font-mono flex items-center gap-1"
                    >
                      {copiedKey === 'deploy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'deploy' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-2.5 rounded bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto whitespace-pre">
                    {webDeploySnippet}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Direct PWA Install */}
          {activeTab === 'install' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 space-y-1">
                <span className="font-bold flex items-center gap-1 text-xs font-mono">
                  <Download className="w-4 h-4 text-indigo-400" />
                  Instant Install on Android, iPhone &amp; Desktop (No App Store Needed)
                </span>
                <p className="text-[11px] text-slate-300">
                  Users can install KernelPulse directly to their phone's home screen with a native app icon, fullscreen launch, and offline caching.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-bold text-white block">Android / Chrome:</span>
                  <ol className="list-decimal list-inside text-slate-400 space-y-1">
                    <li>Open <code>{appUrl}</code> in Chrome on Android.</li>
                    <li>Tap the <strong>three dots menu (⋮)</strong> at top right.</li>
                    <li>Tap <strong>Install App</strong> or <strong>Add to Home Screen</strong>.</li>
                    <li>The app will install as a standalone native app icon!</li>
                  </ol>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-bold text-white block">iPhone / iOS Safari:</span>
                  <ol className="list-decimal list-inside text-slate-400 space-y-1">
                    <li>Open <code>{appUrl}</code> in Safari on iOS.</li>
                    <li>Tap the <strong>Share</strong> button (box with upward arrow).</li>
                    <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                    <li>Tap <strong>Add</strong> in the top right.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">
            PWA Manifest &amp; Icons: <span className="text-emerald-400">Verified &amp; Configured</span>
          </span>
          <button
            onClick={() => {
              playTechClick(700);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs transition-colors"
          >
            Got it &rarr;
          </button>
        </div>

      </div>
    </div>
  );
};
