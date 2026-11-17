KernelPulse — Hacker & Dev Network
KernelPulse is a mobile-first and desktop-ready collaboration platform for systems engineers, open-source maintainers, and hackers. It combines repository discovery, GitHub-style contribution heatmaps, real-time messaging, a shared code editor with AI pair-programming support, sprint matchmaking, and developer telemetry analytics inside an installable Progressive Web App (PWA).
Features
1. Project Discovery & Contribution Heatmap
Open-Source Discovery Feed (ProjectDiscoveryFeed): Search and filter repositories by language, technology domain, and project stage (Seeking Contributors, In Progress, Completed), and sort by activity, popularity, or recency.
Repository Activity Heatmap (RepositoryContributionHeatmap):
Calendar View: GitHub-style 7-day × 18-week grid with month headers, weekday ticks, and a 5-step color intensity scale.
Repo Matrix View: Side-by-side 21-day activity intensity across all tracked repositories.
Interactive Inspection & Filtering: Filter by repository or event source (All Events, Commits, PRs & Reviews), hover/click cells for daily breakdowns, and click repositories to filter the discovery feed.
2. Developer Feed & Stories
Stories Bar (StoriesBar & StoryModal): Quick-access live pairing broadcasts and code snippets from contributors.
Pulse Feed (FeedView & CreatePostModal): Share milestones, code releases, and sprint updates with liking, starring, inline commenting, and direct jump-to-editor support.
3. Shared Live IDE & Git Workflow
Code Editor (CodeEditorView): Collaborative multi-language code workspace with live collaborator cursor awareness, syntax buffer switching, and snippet publishing.
Git & Pull Requests (GitVersionControlModal): Inspect commit history, diff stats, branch switching, and open/merged pull requests.
Pair Programming Chat Drawer (ProjectChatDrawer): Multi-turn project discussion drawer powered by the /api/chat backend route using the @google/genai SDK (with a deterministic local systems-engineering fallback when no API key is configured).
4. Real-Time Messaging
Direct Messages & Channels (MessagesView): Threaded 1-on-1 developer chats and topic channels (#systems-kernel, #midnight-hackers) supporting code snippet sharing, media attachments, emoji reactions, and one-click jump into the Live IDE.
5. Sprint Matchmaking & Milestone Timeline
DevMatch Sprints (SprintMatchView & CreateSprintModal): Match with open-source sprints aligned to your skill matrix, inspect open roles, and launch new collaborative sprints.
Roadmap Timeline (TimelineView): Track sprint milestones across statuses (completed, in_progress, upcoming) and open milestone verification buffers directly in the IDE.
6. Developer Profile & Analytics Dashboard
Profile & Auth (UserProfileView, AuthModal, UserDetailModal): Sign-in, sign-up, account switching, guest read-only mode, badge details, skill matrix endorsements, and editable developer bios.
Telemetry Dashboard (DeveloperAnalyticsDashboard): Powered by Recharts:
Contribution Frequency: Interactive time-series area chart (30d, 90d, 1y) across commits, PRs, and reviews.
Language Distribution: Interactive donut chart and LOC breakdown across Rust, TypeScript, Go, C++, WebAssembly, and Python.
Sprint Participation & Velocity: Composed bar and line chart tracking completed milestones against earned story velocity points, plus one-click JSON telemetry export.
7. PWA & Mobile Frame Support
Responsive Phone Frame Toggle: Preview mobile iOS/Android layout inside the desktop browser or expand to full-width desktop view.
Light & Dark Themes: Synchronized Tailwind CSS v4 dark mode toggle with tactile audio feedback (src/utils/audio.ts).
Play Store / TWA Ready: Configured with public/manifest.json, multi-size/maskable PWA icons, app shortcuts, and /.well-known/assetlinks.json.
Tech Stack
Frontend: React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide Icons, Motion, Recharts
Backend: Node.js, Express 4, tsx, @google/genai
PWA Tooling: sharp (via scripts/generate-pwa-assets.js)
Getting Started
Prerequisites
Node.js 20+ (or compatible runtime)
npm / bun
1. Environment Variables
Copy .env.example to .env and configure as needed:
Env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
APP_URL="http://localhost:3000"
Note: If GEMINI_API_KEY is omitted, /api/chat automatically falls back to a built-in systems architecture response so the UI remains fully functional locally.
2. Install Dependencies
Bash
npm install
3. Run in Development
Starts the Express server with Vite middleware on port 3000:
Bash
npm run dev
Open http://localhost:3000 in your browser.
4. Type-Check & Production Build
Bash
# Run TypeScript type check
npm run lint

# Build client assets into dist/
npm run build

# Start production server
NODE_ENV=production npm start
5. Regenerate PWA Icons & Assets (Optional)
To regenerate sized and maskable PNG icons in public/ from public/icon.svg:
Bash
node scripts/generate-pwa-assets.js
Server API Endpoints
Method	Endpoint	Description
POST	/api/chat	Multi-turn Gemini AI pair-programming & PR review endpoint
GET	/api/health	Server health and timestamp check
GET	/.well-known/assetlinks.json	Digital Asset Links verification for Android Trusted Web Activity (TWA)
Project Structure
Text
├── index.html                  # HTML entry point & PWA/meta tags
├── metadata.json               # Application metadata & capabilities
├── package.json                # Dependencies & scripts
├── server.ts                   # Express server + Vite dev middleware + /api/chat
├── public/
│   ├── icon.svg                # Master vector app icon
│   ├── manifest.json           # Web App Manifest (icons, screenshots, shortcuts)
│   └── .well-known/            # Digital Asset Links for Play Store TWA
├── scripts/
│   └── generate-pwa-assets.js  # Sharp-based multi-size PWA icon generator
└── src/
    ├── App.tsx                 # Root state, navigation tabs, modals & persistence
    ├── index.css               # Tailwind CSS v4 global stylesheet
    ├── types.ts                # Core TypeScript interfaces
    ├── data/
    │   └── initialData.ts      # Seed users, projects, posts, sprints, PRs & chats
    ├── utils/
    │   ├── audio.ts            # Web Audio synth feedback utilities
    │   └── auth.ts             # Local client authentication helpers
    └── components/
        ├── AuthModal.tsx
        ├── BottomTabBar.tsx
        ├── CodeEditorView.tsx
        ├── CreatePostModal.tsx
        ├── CreateSprintModal.tsx
        ├── DeveloperAnalyticsDashboard.tsx
        ├── FeedView.tsx
        ├── GitVersionControlModal.tsx
        ├── ImageWithFallback.tsx
        ├── MessagesView.tsx
        ├── Navbar.tsx
        ├── ProjectChatDrawer.tsx
        ├── ProjectDiscoveryFeed.tsx
        ├── PublishModal.tsx
        ├── RepositoryContributionHeatmap.tsx
        ├── SprintMatchView.tsx
        ├── StoriesBar.tsx
        ├── StoryModal.tsx
        ├── TimelineView.tsx
        ├── UserDetailModal.tsx
        └── UserProfileView.tsx
