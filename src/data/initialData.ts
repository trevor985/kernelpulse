import { 
  User, 
  Badge, 
  Post, 
  Sprint, 
  Story, 
  Project, 
  Collaborator, 
  GitCommit, 
  PullRequest,
  ChatMessage,
  Conversation
} from '../types';

import avatarClaudia from '../assets/images/developer_hacker_avatar_1793109904736.jpg';
import avatarElena from '../assets/images/avatar_elena_kernel_1793175974329.jpg';
import avatarMaya from '../assets/images/avatar_maya_compiler_1793175974026.jpg';
import avatarKenji from '../assets/images/avatar_kenji_gpu_1793175974505.jpg';
import avatarDevon from '../assets/images/avatar_devon_hayes_1793176007528.jpg';

import coverAether from '../assets/images/project_cyber_terminal_1793109902793.jpg';
import coverPulseAst from '../assets/images/project_ai_compiler_1793109903124.jpg';
import coverHyperWgsl from '../assets/images/project_webgpu_engine_1793109904558.jpg';
import coverPacketProbe from '../assets/images/cover_packet_probe_1793175989565.jpg';
import coverPulseCrdt from '../assets/images/cover_crdt_sync_1793175989028.jpg';
import coverZenithCuda from '../assets/images/cover_zenith_cuda_1793175990156.jpg';
import chatArchDiagram from '../assets/images/chat_arch_diagram_1793176025410.jpg';

export const ASSET_IMAGES = {
  avatarClaudia,
  avatarElena,
  avatarMaya,
  avatarKenji,
  avatarDevon,
  coverAether,
  coverPulseAst,
  coverHyperWgsl,
  coverPacketProbe,
  coverPulseCrdt,
  coverZenithCuda,
  chatArchDiagram
};

export const CURRENT_USER: User = {
  id: 'usr_me',
  name: 'Claudia Vance',
  handle: '0xclaudia',
  avatar: avatarClaudia,
  headline: 'Low-Level Systems & Distributed Runtimes Engineer',
  bio: 'Hacking on async kernel runtimes, zero-copy networking, and WebAssembly SIMD. Believer in open source and midnight pair programming.',
  location: 'San Francisco, CA / Remote',
  github: 'https://github.com/0xclaudia',
  email: 'purityclaudia9@gmail.com',
  role: 'Systems & Distributed Runtimes',
  reputation: 4820,
  starsCount: 1420,
  collaborationsCount: 18,
  pairProgrammingHours: 142,
  isOnline: true,
  activeSprintTitle: 'AetherKernel 0.4',
  skills: [
    { name: 'Rust', level: 96, category: 'systems', verified: true, endorsements: 48 },
    { name: 'TypeScript', level: 92, category: 'web', verified: true, endorsements: 34 },
    { name: 'WebAssembly', level: 88, category: 'systems', verified: true, endorsements: 29 },
    { name: 'eBPF / Linux', level: 82, category: 'security', verified: true, endorsements: 19 },
    { name: 'WebGPU', level: 74, category: 'systems', verified: false, endorsements: 12 },
    { name: 'Go', level: 85, category: 'cloud', verified: true, endorsements: 22 }
  ],
  badges: [
    {
      id: 'b_kernel',
      title: 'Kernel Architect',
      description: 'Engineered zero-copy memory drivers merged into an open-source hypervisor runtime.',
      rarity: 'legendary',
      category: 'systems',
      icon: 'Shield',
      unlockedAt: 'Oct 2026',
      criteria: 'Contribute a verified systems driver or kernel patch with 50+ benchmark validations.'
    },
    {
      id: 'b_pair_master',
      title: 'Pair Wizard',
      description: 'Completed over 100 hours of synchronous peer debugging sessions.',
      rarity: 'epic',
      category: 'collaboration',
      icon: 'Users',
      unlockedAt: 'Sep 2026',
      criteria: 'Clock 100+ active pair programming hours with 15+ distinct contributors.'
    },
    {
      id: 'b_night_owl',
      title: '02:00 AM Sentinel',
      description: 'Pushed critical bug fixes and hot-patches during late-night debugging marathons.',
      rarity: 'rare',
      category: 'milestone',
      icon: 'Moon',
      unlockedAt: 'Aug 2026',
      criteria: 'Merge 20+ pull requests between 01:00 AM and 05:00 AM local time.'
    },
    {
      id: 'b_bounty',
      title: 'Memory Safe Guardian',
      description: 'Discovered and eliminated data race vulnerabilities in concurrent codebases.',
      rarity: 'epic',
      category: 'security',
      icon: 'Bug',
      unlockedAt: 'Jul 2026',
      criteria: 'Verify and resolve 10+ concurrency, use-after-free, or buffer overflow issues.'
    },
    {
      id: 'b_sprint_lead',
      title: 'Sprint Commander',
      description: 'Organized and drove a 14-day collaborative open source sprint to 100% completion.',
      rarity: 'rare',
      category: 'collaboration',
      icon: 'Award',
      unlockedAt: 'Jun 2026',
      criteria: 'Lead an open source sprint with 4+ external contributors to final release.'
    }
  ]
};

export const OTHER_USERS: Record<string, User> = {
  maya: {
    id: 'usr_maya',
    name: 'Maya Chen',
    handle: 'mayacodes',
    avatar: avatarMaya,
    headline: 'Compiler Engineer & AST Enthusiast',
    bio: 'Writing JIT compilers, type-checkers, and memory analyzers. Maintainer of @PulseAST.',
    location: 'Seattle, WA',
    github: 'https://github.com/mayacodes',
    reputation: 6150,
    starsCount: 2840,
    collaborationsCount: 32,
    pairProgrammingHours: 210,
    isOnline: true,
    activeSprintTitle: 'PulseAST 1.0 Release',
    skills: [
      { name: 'Rust', level: 98, category: 'systems', verified: true, endorsements: 76 },
      { name: 'C++', level: 91, category: 'systems', verified: true, endorsements: 44 },
      { name: 'LLVM / Compilers', level: 94, category: 'systems', verified: true, endorsements: 62 },
      { name: 'TypeScript', level: 86, category: 'web', verified: true, endorsements: 28 }
    ],
    badges: []
  },
  kenji: {
    id: 'usr_kenji',
    name: 'Kenji Sato',
    handle: 'kenji_gpu',
    avatar: avatarKenji,
    headline: 'Graphics Hacker & Shader Artist',
    bio: 'WebGPU, ray marching, and real-time volumetric compute. Making the web look like a high-end console game.',
    location: 'Tokyo, Japan',
    github: 'https://github.com/kenjigpu',
    reputation: 5390,
    starsCount: 3410,
    collaborationsCount: 24,
    pairProgrammingHours: 95,
    isOnline: true,
    activeSprintTitle: 'HyperWGSL 2.0',
    skills: [
      { name: 'WebGPU', level: 97, category: 'systems', verified: true, endorsements: 82 },
      { name: 'WGSL / GLSL', level: 95, category: 'systems', verified: true, endorsements: 65 },
      { name: 'Three.js / WebGL', level: 94, category: 'web', verified: true, endorsements: 53 },
      { name: 'Rust', level: 80, category: 'systems', verified: true, endorsements: 18 }
    ],
    badges: []
  },
  elena: {
    id: 'usr_elena',
    name: 'Elena Rostova',
    handle: 'elena_kernel',
    avatar: avatarElena,
    headline: 'eBPF Core Developer & Linux Hacker',
    bio: 'Tracing kernel packets, zero-overhead telemetry, and container runtime security.',
    location: 'Berlin, Germany',
    github: 'https://github.com/elenakernel',
    reputation: 7420,
    starsCount: 4200,
    collaborationsCount: 41,
    pairProgrammingHours: 320,
    isOnline: true,
    activeSprintTitle: 'PacketProbe eBPF v2',
    skills: [
      { name: 'eBPF / Linux', level: 99, category: 'security', verified: true, endorsements: 110 },
      { name: 'C', level: 95, category: 'systems', verified: true, endorsements: 84 },
      { name: 'Rust', level: 90, category: 'systems', verified: true, endorsements: 49 },
      { name: 'Kubernetes Internals', level: 88, category: 'cloud', verified: true, endorsements: 37 }
    ],
    badges: []
  },
  devon: {
    id: 'usr_devon',
    name: 'Devon Hayes',
    handle: 'devon_sh',
    avatar: avatarDevon,
    headline: 'Fullstack Systems Architect',
    bio: 'Building low-latency sync engines, CRDTs, and real-time collaboration protocols.',
    location: 'Austin, TX',
    github: 'https://github.com/devonsh',
    reputation: 3920,
    starsCount: 1180,
    collaborationsCount: 16,
    pairProgrammingHours: 82,
    isOnline: false,
    skills: [
      { name: 'TypeScript', level: 95, category: 'web', verified: true, endorsements: 46 },
      { name: 'Go', level: 89, category: 'cloud', verified: true, endorsements: 31 },
      { name: 'WebSockets / CRDT', level: 93, category: 'web', verified: true, endorsements: 40 }
    ],
    badges: []
  }
};

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story_1',
    user: OTHER_USERS.elena,
    caption: 'Tracing eBPF packet loss under 100Gbps SYN flood',
    previewSnippet: 'SEC("xdp") int filter_syn(struct xdp_md *ctx) { ... }',
    timeAgo: '12m ago',
    isLivePairing: true
  },
  {
    id: 'story_2',
    user: OTHER_USERS.kenji,
    caption: 'New WebGPU dispersion pass rendering 120 FPS on mobile',
    previewSnippet: '@fragment fn fs_main(in: VertexOutput) -> @location(0) vec4f',
    timeAgo: '38m ago',
    isLivePairing: true
  },
  {
    id: 'story_3',
    user: OTHER_USERS.maya,
    caption: 'AST folding benchmark: 4.8x speedup achieved with arena allocator',
    previewSnippet: 'pub struct ArenaAST<T> { chunks: Vec<[T; 4096]> }',
    timeAgo: '1h ago',
    isLivePairing: false
  },
  {
    id: 'story_4',
    user: CURRENT_USER,
    caption: 'Lock-free queue benchmarks on ARM64 Cortex-A78',
    previewSnippet: 'atomic::compare_exchange_weak(acquire, release)',
    timeAgo: '3h ago',
    isLivePairing: false
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    author: OTHER_USERS.maya,
    createdAt: '22m ago',
    type: 'milestone',
    title: 'PulseAST v0.9 shipped: 4.8x faster syntax parser written in Rust',
    content: 'After 3 sleepless nights benchmarking against babel-parser and swc, we just cut release v0.9! By switching to bumpalo memory arenas and SIMD-accelerated lexing, we parse a 50,000-line TypeScript bundle in under 1.4ms on Apple M3 Max.\n\nTake a look at how we implemented token scanning with AVX2/NEON instructions below.',
    mediaUrl: coverPulseAst,
    codeSnippet: {
      language: 'rust',
      filename: 'lexer_simd.rs',
      code: `use std::arch::x86_64::*;\n\n#[inline(always)]\npub unsafe fn scan_identifier_simd(chunk: &[u8; 32]) -> u32 {\n    let v = _mm256_loadu_si256(chunk.as_ptr() as *const __m256i);\n    let is_alpha = _mm256_or_si256(\n        _mm256_cmpgt_epi8(v, _mm256_set1_epi8(b'a' as i8 - 1)),\n        _mm256_cmpeq_epi8(v, _mm256_set1_epi8(b'_' as i8))\n    );\n    _mm256_movemask_epi8(is_alpha) as u32\n}`
    },
    milestone: {
      current: 4,
      total: 5,
      label: 'Sprint Phase 4: AST Optimizer Verification',
      targetDate: 'Nov 02, 2026'
    },
    lookingForContributors: {
      active: true,
      roles: ['Rust Compiler Engineer', 'WASM SIMD Tester'],
      sprintGoal: 'Implement incremental CST reparsing for IDE LSP integration',
      openSeats: 2
    },
    likes: 248,
    isLiked: false,
    stars: 182,
    isStarred: true,
    commentsCount: 19,
    tags: ['rust', 'compilers', 'simd', 'performance', 'open-source'],
    comments: [
      {
        id: 'c_1',
        author: OTHER_USERS.kenji,
        content: 'Insane numbers! Did you notice any branch misprediction penalties on non-ASCII variable names?',
        createdAt: '18m ago',
        likes: 14
      },
      {
        id: 'c_2',
        author: CURRENT_USER,
        content: 'Love the bumpalo arena design. We saw similar wins in AetherKernel buffer caching. Are you open to pairing on the WASM export?',
        createdAt: '11m ago',
        likes: 9
      }
    ]
  },
  {
    id: 'post_2',
    author: OTHER_USERS.kenji,
    createdAt: '1h ago',
    type: 'showcase',
    title: 'HyperWGSL: Real-Time Crystal Dispersion Shader at 120 FPS on Mobile',
    content: 'Just deployed the live WebGPU compute pass demo! It calculates light dispersion through a crystalline polyhedron with multi-bounce internal reflections.\n\nAll computing happens in a single compute pass before rasterization. Tap "Open in Editor" to play with the Cauchy dispersion coefficients in real time!',
    mediaUrl: coverHyperWgsl,
    codeSnippet: {
      language: 'rust',
      filename: 'dispersion.wgsl',
      code: `@compute @workgroup_size(16, 16)\nfn compute_dispersion(\n    @builtin(global_invocation_id) id: vec3u\n) {\n    let uv = vec2f(id.xy) / vec2f(screen_dim);\n    let ray = generate_camera_ray(uv);\n    var col = vec3f(0.0);\n    \n    // Cauchy wavelength dispersion\n    for (var w = 0u; w < 3u; w++) {\n        let ior = 1.52 + (0.004 / (wavelengths[w] * wavelengths[w]));\n        col[w] = trace_refracted_ray(ray, ior).r;\n    }\n    textureStore(output_tex, id.xy, vec4f(col, 1.0));\n}`
    },
    milestone: {
      current: 3,
      total: 4,
      label: 'Sprint Phase 3: Mobile WebGPU Fallback & Optimizations',
      targetDate: 'Oct 30, 2026'
    },
    lookingForContributors: {
      active: true,
      roles: ['Shader Hacker', 'Vulkan/Metal Debugger'],
      sprintGoal: 'Add depth-aware screen-space ambient occlusion compute pass',
      openSeats: 1
    },
    likes: 412,
    isLiked: true,
    stars: 320,
    isStarred: false,
    commentsCount: 34,
    tags: ['webgpu', 'wgsl', 'graphics', 'shaders', '3d'],
    comments: [
      {
        id: 'c_3',
        author: OTHER_USERS.elena,
        content: 'Tested this on an Android Snapdragon 8 Gen 3—runs buttery smooth at 120Hz!',
        createdAt: '45m ago',
        likes: 21
      }
    ]
  },
  {
    id: 'post_3',
    author: OTHER_USERS.elena,
    createdAt: '3h ago',
    type: 'sprint_update',
    title: 'Kernel Sprint: PacketProbe eBPF v2 kicking off tonight',
    content: 'We are kicking off our 7-day development sprint to build an ultra-lightweight eBPF network packet analyzer for container namespaces.\n\nWe need 2 systems hackers who know Linux socket filters, ringbuffers, or React/Tailwind for the live inspection TUI.\n\nJump into the sprint room or tap Pair Now to hack on the ringbuf consumer!',
    mediaUrl: coverPacketProbe,
    codeSnippet: {
      language: 'c',
      filename: 'packet_probe.bpf.c',
      code: `SEC("tc")\nint handle_egress(struct __sk_buff *skb) {\n    void *data = (void *)(long)skb->data;\n    void *data_end = (void *)(long)skb->data_end;\n    \n    struct ethhdr *eth = data;\n    if ((void *)(eth + 1) > data_end) return TC_ACT_OK;\n    \n    // Zero-overhead ringbuf event submission\n    struct event *e = bpf_ringbuf_reserve(&events, sizeof(*e), 0);\n    if (!e) return TC_ACT_OK;\n    e->bytes = skb->len;\n    bpf_ringbuf_submit(e, 0);\n    return TC_ACT_OK;\n}`
    },
    milestone: {
      current: 1,
      total: 5,
      label: 'Sprint Phase 1: XDP/TC Hook Architecture & Ringbuf API',
      targetDate: 'Nov 05, 2026'
    },
    lookingForContributors: {
      active: true,
      roles: ['eBPF Kernel Dev', 'Terminal UI / Frontend'],
      sprintGoal: 'Ship sub-microsecond namespace packet latency monitoring',
      openSeats: 2
    },
    likes: 310,
    isLiked: false,
    stars: 195,
    isStarred: false,
    commentsCount: 14,
    tags: ['ebpf', 'linux', 'c', 'security', 'networking'],
    comments: []
  }
];

export const INITIAL_SPRINTS: Sprint[] = [
  {
    id: 'sprint_aether',
    title: 'AetherKernel: Zero-Copy Microkernel',
    repoName: 'kernelpulse/aether-kernel',
    description: 'A modular, high-throughput microkernel IPC and async ringbuffer driver designed for edge microservices and WebAssembly runtimes.',
    creator: CURRENT_USER,
    contributors: [CURRENT_USER, OTHER_USERS.maya, OTHER_USERS.elena],
    tags: ['Rust', 'Systems', 'WASM', 'Zero-Copy'],
    requiredSkills: ['Rust', 'WebAssembly', 'eBPF / Linux'],
    difficulty: 'Hardcore Systems',
    status: 'in_progress',
    startDate: 'Oct 20, 2026',
    endDate: 'Nov 10, 2026',
    openPositions: ['Async I/O Subsystem Lead', 'WASM SIMD Tester'],
    matchScore: 96,
    milestones: [
      {
        id: 'm_1',
        title: 'Core Shared-Memory IPC Ringbuffer',
        description: 'Implement lock-free single-producer multi-consumer queue with cacheline padding.',
        status: 'completed',
        targetDate: 'Oct 24, 2026',
        assigneeName: 'Claudia Vance',
        assigneeAvatar: '/src/assets/images/developer_hacker_avatar_1793109904736.jpg',
        prLink: 'PR #12 (Merged)'
      },
      {
        id: 'm_2',
        title: 'Async Epoll / Kqueue Driver Shim',
        description: 'Expose cross-platform asynchronous readiness notifications via POSIX abstractions.',
        status: 'completed',
        targetDate: 'Oct 27, 2026',
        assigneeName: 'Maya Chen',
        assigneeAvatar: OTHER_USERS.maya.avatar,
        prLink: 'PR #19 (Merged)'
      },
      {
        id: 'm_3',
        title: 'Microsecond Latency Benchmarking Suite',
        description: 'Run automated end-to-end stress tests with 100k concurrent client simulations.',
        status: 'in_progress',
        targetDate: 'Nov 02, 2026',
        assigneeName: 'Elena Rostova',
        assigneeAvatar: OTHER_USERS.elena.avatar,
        prLink: 'PR #24 (Open)'
      },
      {
        id: 'm_4',
        title: 'Wasmtime Runtime Native Embedding',
        description: 'Run untrusted sandboxed wasm modules with fine-grained capability tokens.',
        status: 'upcoming',
        targetDate: 'Nov 08, 2026'
      },
      {
        id: 'm_5',
        title: 'v0.5 Public Release & Documentation',
        description: 'Publish crates.io package and interactive playground documentation.',
        status: 'upcoming',
        targetDate: 'Nov 10, 2026'
      }
    ]
  },
  {
    id: 'sprint_pulseast',
    title: 'PulseAST: Blazing Fast JS/TS Parser',
    repoName: 'kernelpulse/pulse-ast',
    description: 'Next-generation TypeScript parser written in Rust with zero-allocation AST arena nodes and incremental re-parsing.',
    creator: OTHER_USERS.maya,
    contributors: [OTHER_USERS.maya, OTHER_USERS.devon],
    tags: ['Rust', 'Compilers', 'TypeScript', 'SIMD'],
    requiredSkills: ['Rust', 'TypeScript', 'LLVM / Compilers'],
    difficulty: 'Intermediate',
    status: 'in_progress',
    startDate: 'Oct 15, 2026',
    endDate: 'Nov 02, 2026',
    openPositions: ['JSX Syntax Parser', 'Benchmark Profiler'],
    matchScore: 92,
    milestones: [
      {
        id: 'mp_1',
        title: 'SIMD Tokenizer Architecture',
        description: 'Scan string and keyword tokens using AVX2 vectorized lookups.',
        status: 'completed',
        targetDate: 'Oct 18, 2026',
        assigneeName: 'Maya Chen',
        prLink: 'PR #04 (Merged)'
      },
      {
        id: 'mp_2',
        title: 'Recursive Descent TypeScript Expression Parser',
        description: 'Handle complex generics, mapped types, and conditional typings.',
        status: 'completed',
        targetDate: 'Oct 23, 2026',
        assigneeName: 'Devon Hayes',
        prLink: 'PR #09 (Merged)'
      },
      {
        id: 'mp_3',
        title: 'Zero-Copy AST Arena Serialization',
        description: 'Flat buffer binary serialization to communicate with Node/V8 without JSON overhead.',
        status: 'in_progress',
        targetDate: 'Oct 29, 2026',
        assigneeName: 'Maya Chen',
        prLink: 'PR #15 (Reviewing)'
      },
      {
        id: 'mp_4',
        title: 'LSP Diagnostics & Quick Fix Integration',
        description: 'Emit human-readable errors with colored code frames and code-action fixes.',
        status: 'upcoming',
        targetDate: 'Nov 02, 2026'
      }
    ]
  },
  {
    id: 'sprint_hyperwgsl',
    title: 'HyperWGSL: WebGPU Shader Studio',
    repoName: 'kernelpulse/hyper-wgsl',
    description: 'A mobile-first real-time WebGPU shader visualizer and hot-reloading shader playground with compute pass telemetry.',
    creator: OTHER_USERS.kenji,
    contributors: [OTHER_USERS.kenji],
    tags: ['WebGPU', 'WGSL', 'Graphics', 'Three.js'],
    requiredSkills: ['WebGPU', 'WGSL / GLSL', 'TypeScript'],
    difficulty: 'Intermediate',
    status: 'recruiting',
    startDate: 'Oct 22, 2026',
    endDate: 'Nov 12, 2026',
    openPositions: ['Mobile WebGPU Optimizer', 'Compute Shader Engineer'],
    matchScore: 78,
    milestones: [
      {
        id: 'mw_1',
        title: 'WGSL Live Reflection Parser',
        description: 'Extract uniforms, bindgroups, and buffer layouts from shader strings automatically.',
        status: 'completed',
        targetDate: 'Oct 24, 2026',
        assigneeName: 'Kenji Sato',
        prLink: 'PR #01 (Merged)'
      },
      {
        id: 'mw_2',
        title: 'Touch Gesture Uniform Controls',
        description: 'Bind touchscreen multi-touch rotation and pinch directly to shader uniforms.',
        status: 'in_progress',
        targetDate: 'Oct 31, 2026',
        assigneeName: 'Kenji Sato',
        prLink: 'PR #03 (Open)'
      },
      {
        id: 'mw_3',
        title: 'Raymarching Presets & Dispersion',
        description: 'Add volumetric fog, fractal SDFs, and chromatic dispersion demos.',
        status: 'upcoming',
        targetDate: 'Nov 06, 2026'
      }
    ]
  }
];

export const SAMPLE_CODE_SNIPPETS = {
  javascript: `// High-Performance Debounced Search Worker
function createDebouncedSearch(index, delay = 250) {
  let timer = null;
  const cache = new Map();

  return async function search(query) {
    if (cache.has(query)) {
      return { fromCache: true, results: cache.get(query) };
    }
    
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(() => {
        const hits = index.filter(item => 
          item.toLowerCase().includes(query.toLowerCase())
        );
        cache.set(query, hits);
        resolve({ fromCache: false, hits: hits.length, results: hits });
      }, delay);
    });
  };
}

// Quick Test execution
const sampleIndex = ["AetherKernel", "PulseAST", "HyperWGSL", "PacketProbe", "ZeroCopyIO"];
const searchFn = createDebouncedSearch(sampleIndex, 50);

searchFn("kernel").then(res => console.log("[Search Results]:", res));
console.log("Worker initialized with 5 registered modules.");`,

  rust: `// Lock-Free Single-Producer Single-Consumer (SPSC) Ring Buffer
use std::sync::atomic::{AtomicUsize, Ordering};

pub struct SpscRing<T, const CAP: usize> {
    buffer: [Option<T>; CAP],
    head: AtomicUsize,
    tail: AtomicUsize,
}

impl<T: Copy, const CAP: usize> SpscRing<T, CAP> {
    pub const fn new() -> Self {
        Self {
            buffer: [None; CAP],
            head: AtomicUsize::new(0),
            tail: AtomicUsize::new(0),
        }
    }

    pub fn push(&mut self, item: T) -> Result<(), &'static str> {
        let head = self.head.load(Ordering::Relaxed);
        let tail = self.tail.load(Ordering::Acquire);
        if (head + 1) % CAP == tail {
            return Err("Ring buffer full");
        }
        self.buffer[head] = Some(item);
        self.head.store((head + 1) % CAP, Ordering::Release);
        Ok(())
    }
}`,

  python: `# Async Task Pipeline with Graceful Backpressure
import asyncio

async def worker(queue: asyncio.Queue, worker_id: int):
    while True:
        task_id = await queue.get()
        print(f"Worker {worker_id} processing packet {task_id}")
        await asyncio.sleep(0.05) # Simulated kernel I/O
        queue.task_done()

async def main():
    q = asyncio.Queue(maxsize=10)
    workers = [asyncio.create_task(worker(q, i)) for i in range(3)]
    for i in range(8):
        await q.put(i)
    await q.join()
    for w in workers:
        w.cancel()
    print("All kernel packets synchronized.")

asyncio.run(main())`,

  typescript: `// Real-Time CRDT State Synchronization
interface Operation {
  id: string;
  clock: number;
  author: string;
  delta: string;
}

class CollaborativeBuffer {
  private clock = 0;
  private history: Operation[] = [];

  constructor(public readonly docId: string) {}

  applyRemote(op: Operation): boolean {
    if (op.clock <= this.clock) return false;
    this.history.push(op);
    this.clock = Math.max(this.clock, op.clock) + 1;
    return true;
  }

  broadcast(author: string, delta: string): Operation {
    this.clock += 1;
    const op: Operation = {
      id: crypto.randomUUID(),
      clock: this.clock,
      author,
      delta,
    };
    this.history.push(op);
    return op;
  }
}

const doc = new CollaborativeBuffer("pair-session-0x89");
console.log("CRDT session primed. Clock:", 1);`
};

export const INITIAL_COLLABORATORS: Collaborator[] = [
  {
    id: 'collab_me',
    name: 'Claudia Vance (You)',
    handle: '0xclaudia',
    avatar: avatarClaudia,
    color: '#10b981', // emerald
    cursorLine: 8,
    cursorCol: 14,
    isOnline: true,
    currentFile: 'ring_buffer.rs',
    status: 'idle'
  },
  {
    id: 'collab_kael',
    name: 'Kaelen Thorne',
    handle: '0xKael',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    color: '#f59e0b', // amber
    cursorLine: 18,
    cursorCol: 6,
    isOnline: true,
    currentFile: 'ring_buffer.rs',
    status: 'typing'
  },
  {
    id: 'collab_elena',
    name: 'Elena Rostova',
    handle: 'elena_kernel',
    avatar: OTHER_USERS.elena.avatar,
    color: '#06b6d4', // cyan
    cursorLine: 24,
    cursorCol: 2,
    isOnline: true,
    currentFile: 'packet_probe.bpf.c',
    status: 'reviewing'
  },
  {
    id: 'collab_maya',
    name: 'Maya Chen',
    handle: 'mayacodes',
    avatar: OTHER_USERS.maya.avatar,
    color: '#a855f7', // purple
    cursorLine: 12,
    cursorCol: 20,
    isOnline: true,
    currentFile: 'lexer_simd.rs',
    status: 'idle'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_aether',
    title: 'AetherKernel: Zero-Copy Microkernel',
    repoName: 'kernelpulse/aether-kernel',
    description: 'Modular high-throughput microkernel IPC and lock-free ringbuffer driver designed for edge microservices and WebAssembly runtime sandboxes.',
    language: 'Rust',
    techStack: ['Kernel & Systems', 'Zero-Copy', 'WASM', 'Async I/O'],
    stage: 'in progress',
    stars: 1420,
    isStarred: true,
    forks: 218,
    activePRs: 3,
    openIssues: 8,
    createdAt: '2026-09-15T10:00:00Z',
    lastActiveAt: '2026-10-27T06:45:00Z',
    author: CURRENT_USER,
    contributors: [CURRENT_USER, OTHER_USERS.maya, OTHER_USERS.elena],
    coverImage: coverAether,
    codeSample: {
      filename: 'spsc_ring.rs',
      language: 'rust',
      code: `#[repr(align(64))]\npub struct SpscRing<T, const CAP: usize> {\n    buffer: [Option<T>; CAP],\n    head: AtomicUsize,\n    tail: AtomicUsize,\n}`
    },
    seekingRoles: ['Async I/O Subsystem Lead', 'WASM SIMD Tester']
  },
  {
    id: 'proj_pulseast',
    title: 'PulseAST: Blazing Fast JS/TS Parser',
    repoName: 'kernelpulse/pulse-ast',
    description: 'Next-generation TypeScript parser written in Rust with bumpalo memory arenas, SIMD-accelerated lexing, and incremental syntax re-parsing.',
    language: 'Rust',
    techStack: ['Compilers & AST', 'TypeScript', 'SIMD', 'Performance'],
    stage: 'seeking contributors',
    stars: 2840,
    isStarred: false,
    forks: 340,
    activePRs: 5,
    openIssues: 12,
    createdAt: '2026-08-10T14:30:00Z',
    lastActiveAt: '2026-10-27T06:12:00Z',
    author: OTHER_USERS.maya,
    contributors: [OTHER_USERS.maya, OTHER_USERS.devon],
    coverImage: coverPulseAst,
    codeSample: {
      filename: 'arena_lexer.rs',
      language: 'rust',
      code: `pub fn scan_token_simd(chunk: &[u8; 32]) -> u32 {\n    // Vectorized ASCII identifier lookup\n    unsafe { _mm256_movemask_epi8(is_alpha) as u32 }\n}`
    },
    seekingRoles: ['JSX Syntax Parser', 'Benchmark Profiler']
  },
  {
    id: 'proj_hyperwgsl',
    title: 'HyperWGSL: WebGPU Shader Studio',
    repoName: 'kernelpulse/hyper-wgsl',
    description: 'Real-time WebGPU compute shader engine with chromatic dispersion, volumetric raymarching, and touch gesture uniform bindings.',
    language: 'WebGPU/WGSL',
    techStack: ['WebGPU / Graphics', 'Three.js', 'Compute Shaders', '3D'],
    stage: 'seeking contributors',
    stars: 3410,
    isStarred: true,
    forks: 412,
    activePRs: 2,
    openIssues: 6,
    createdAt: '2026-09-01T08:00:00Z',
    lastActiveAt: '2026-10-26T22:30:00Z',
    author: OTHER_USERS.kenji,
    contributors: [OTHER_USERS.kenji],
    coverImage: coverHyperWgsl,
    codeSample: {
      filename: 'dispersion.wgsl',
      language: 'rust',
      code: `@compute @workgroup_size(16, 16)\nfn compute_dispersion(@builtin(global_invocation_id) id: vec3u) {\n    let ior = 1.52 + (0.004 / (wavelength * wavelength));\n}`
    },
    seekingRoles: ['Mobile WebGPU Optimizer', 'Compute Shader Engineer']
  },
  {
    id: 'proj_packetprobe',
    title: 'PacketProbe: eBPF Network Inspector',
    repoName: 'kernelpulse/packet-probe',
    description: 'Sub-microsecond Linux kernel telemetry and socket tracing with zero-overhead eBPF ringbuffers and container namespace filtering.',
    language: 'C',
    techStack: ['Security & eBPF', 'Linux Kernel', 'Networking', 'Zero-Overhead'],
    stage: 'in progress',
    stars: 4200,
    isStarred: false,
    forks: 510,
    activePRs: 4,
    openIssues: 9,
    createdAt: '2026-07-20T12:00:00Z',
    lastActiveAt: '2026-10-27T04:20:00Z',
    author: OTHER_USERS.elena,
    contributors: [OTHER_USERS.elena, CURRENT_USER],
    coverImage: coverPacketProbe,
    codeSample: {
      filename: 'probe.bpf.c',
      language: 'c',
      code: `SEC("tc") int egress(struct __sk_buff *skb) {\n    struct event *e = bpf_ringbuf_reserve(&events, sizeof(*e), 0);\n    if (!e) return TC_ACT_OK;\n    bpf_ringbuf_submit(e, 0);\n}`
    },
    seekingRoles: ['eBPF Kernel Dev', 'Terminal UI Engineer']
  },
  {
    id: 'proj_crdt',
    title: 'PulseCRDT: Decentralized State Sync',
    repoName: 'kernelpulse/pulse-crdt',
    description: 'Lock-free distributed state synchronization engine with causal tree order, compressed bitset clocks, and WebRTC data channels.',
    language: 'TypeScript',
    techStack: ['CRDT & Networking', 'WebSockets', 'Real-Time Sync', 'Decentralized'],
    stage: 'completed',
    stars: 1980,
    isStarred: false,
    forks: 185,
    activePRs: 0,
    openIssues: 3,
    createdAt: '2026-05-14T09:00:00Z',
    lastActiveAt: '2026-10-25T16:40:00Z',
    author: OTHER_USERS.devon,
    contributors: [OTHER_USERS.devon, CURRENT_USER],
    coverImage: coverPulseCrdt,
    codeSample: {
      filename: 'crdt.ts',
      language: 'typescript',
      code: `applyRemote(op: Operation): boolean {\n  if (op.clock <= this.clock) return false;\n  this.history.push(op);\n  this.clock = Math.max(this.clock, op.clock) + 1;\n  return true;\n}`
    }
  },
  {
    id: 'proj_zenithjit',
    title: 'ZenithTensor: CUDA JIT Compiler',
    repoName: 'kernelpulse/zenith-tensor',
    description: 'Just-In-Time compiler for PyTorch neural tensor graphs with automated kernel fusion, memory coalescing, and mixed precision support.',
    language: 'Python',
    techStack: ['AI & Neural Runtimes', 'CUDA', 'JIT Compilers', 'PyTorch'],
    stage: 'seeking contributors',
    stars: 5120,
    isStarred: true,
    forks: 630,
    activePRs: 6,
    openIssues: 14,
    createdAt: '2026-10-01T15:00:00Z',
    lastActiveAt: '2026-10-27T07:01:00Z',
    author: OTHER_USERS.maya,
    contributors: [OTHER_USERS.maya, CURRENT_USER],
    coverImage: coverZenithCuda,
    codeSample: {
      filename: 'jit_fuse.py',
      language: 'python',
      code: `@torch.compile(backend="zenith_jit")\ndef fused_mha(q, k, v, scale):\n    return torch.nn.functional.scaled_dot_product_attention(q, k, v, scale=scale)`
    },
    seekingRoles: ['CUDA Kernel Optimizer', 'Autograd Graph Developer']
  }
];

export const INITIAL_COMMITS: GitCommit[] = [
  {
    hash: 'a7b8e19',
    message: 'perf: Add cacheline padding #[repr(align(64))] to SpscRing buffer',
    author: 'Claudia Vance',
    authorAvatar: avatarClaudia,
    timestamp: '14m ago',
    diffStats: { additions: 24, deletions: 6, filesChanged: 2 },
    branch: 'main'
  },
  {
    hash: '3f2c904',
    message: 'feat: Add epoll/kqueue async notification readiness driver shim',
    author: 'Maya Chen',
    authorAvatar: OTHER_USERS.maya.avatar,
    timestamp: '2h ago',
    diffStats: { additions: 112, deletions: 18, filesChanged: 4 },
    branch: 'main'
  },
  {
    hash: '8d41a55',
    message: 'test: Concurrency stress tests with 100k simulated packet events',
    author: 'Elena Rostova',
    authorAvatar: OTHER_USERS.elena.avatar,
    timestamp: '5h ago',
    diffStats: { additions: 86, deletions: 12, filesChanged: 3 },
    branch: 'feat/stress-test'
  },
  {
    hash: '1e99b02',
    message: 'fix: Prevent potential memory leak on unaligned slice offsets',
    author: 'Kaelen Thorne',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    timestamp: '1d ago',
    diffStats: { additions: 15, deletions: 4, filesChanged: 1 },
    branch: 'main'
  }
];

export const INITIAL_PULL_REQUESTS: PullRequest[] = [
  {
    id: 24,
    title: 'feat(memory): Implement lock-free cacheline aligned SPSC ringbuffer',
    author: CURRENT_USER,
    branchSource: 'feat/aligned-ringbuffer',
    branchTarget: 'main',
    status: 'open',
    description: 'Eliminates false sharing between producer and consumer threads by isolating head and tail into independent 64-byte L1 cachelines. Benchmark shows +340% throughput on 64-core ARM systems.',
    createdAt: '1h ago',
    checksStatus: 'passing',
    changedFilesCount: 3,
    diffText: `@@ -12,6 +12,12 @@
+#[repr(align(64))]
 pub struct SpscRing<T, const CAP: usize> {
-    head: usize,
-    tail: usize,
+    head: AtomicUsize,
+    _pad0: [u8; 56],
+    tail: AtomicUsize,
+    _pad1: [u8; 56],
 }`,
    commentsCount: 6
  },
  {
    id: 22,
    title: 'fix(ffi): Guard against null pointer dereference in C ABI bindings',
    author: OTHER_USERS.elena,
    branchSource: 'fix/ffi-null-safety',
    branchTarget: 'main',
    status: 'open',
    description: 'Adds non-null assertion verification and explicit panic recovery handler when interfacing with legacy glibc socket hooks.',
    createdAt: '4h ago',
    checksStatus: 'passing',
    changedFilesCount: 2,
    diffText: `@@ -45,3 +45,5 @@
+if ptr.is_null() {
+    return Err(KernelError::InvalidMemoryPointer);
+}`,
    commentsCount: 3
  },
  {
    id: 19,
    title: 'refactor(simd): Vectorize token identifier scanning using AVX2',
    author: OTHER_USERS.maya,
    branchSource: 'feat/simd-lexing',
    branchTarget: 'main',
    status: 'merged',
    description: 'Swapped sequential character loop with 32-byte chunk AVX2 SIMD mask evaluations. Parser speedup increased from 2.1x to 4.8x.',
    createdAt: '1d ago',
    checksStatus: 'passing',
    changedFilesCount: 5,
    diffText: `@@ -102,8 +102,4 @@
-for byte in chars {
-    if !is_ident(byte) { break; }
-}
+let mask = _mm256_movemask_epi8(is_alpha);`,
    commentsCount: 14
  }
 ];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    sender: 'peer',
    authorName: 'Elena Rostova',
    authorAvatar: OTHER_USERS.elena.avatar,
    content: 'Hey Claudia! I just ran the 100k client stress test on our latest branch. CPU usage dropped 18% with your cacheline alignment!',
    timestamp: '10:14 AM'
  },
  {
    id: 'msg_2',
    sender: 'user',
    authorName: 'Claudia Vance',
    authorAvatar: CURRENT_USER.avatar,
    content: 'Awesome! Can we double check that the memory barrier ordering on line 19 doesn\'t regress on weakly ordered architectures like ARM64?',
    timestamp: '10:16 AM'
  },
  {
    id: 'msg_3',
    sender: 'assistant',
    authorName: 'Gemini Pair Copilot (gemini-3.8-flash)',
    content: 'On ARM64 (weak memory model), `Ordering::Acquire` on the reader and `Ordering::Release` on the writer will emit an `LDAR` and `STLR` instruction. This correctly preserves happens-before relationships without requiring heavy `DMB ISH` fences. The current code is architecturally sound and leak-free.',
    timestamp: '10:17 AM',
    modelUsed: 'gemini-3.8-flash'
  },
  {
    id: 'msg_4',
    sender: 'peer',
    authorName: 'Kaelen Thorne',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    content: 'I am on line 18 now editing the unit test harness to mock ARM64 reorderings.',
    timestamp: '10:19 AM'
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'dm_elena',
    type: 'dm',
    participant: OTHER_USERS.elena,
    lastActive: 'Just now',
    unreadCount: 1,
    isPinned: true,
    messages: [
      {
        id: 'msg_e1',
        senderId: 'usr_elena',
        senderName: 'Elena Rostova',
        senderAvatar: avatarElena,
        text: 'Hey Claudia! I analyzed your lock-free queue in PR #24. Here is the architecture diagram showing how the L1/L2 cacheline isolation prevents false sharing between producer and consumer cores.',
        timestamp: '10:42 AM',
        mediaUrl: chatArchDiagram,
        mediaCaption: 'L1/L2 Cacheline Isolation & SPSC Ring Buffer Memory Layout',
        reactions: [
          { emoji: '🔥', count: 2, users: ['0xclaudia', 'elena_kernel'] },
          { emoji: '🧠', count: 1, users: ['0xclaudia'] }
        ],
        isRead: true
      },
      {
        id: 'msg_e2',
        senderId: 'usr_me',
        senderName: 'Claudia Vance',
        senderAvatar: avatarClaudia,
        text: 'This architecture diagram makes the 64-byte padding crystal clear! Did the eBPF packet loss trace pass on the 100Gbps SYN flood testbed?',
        timestamp: '10:44 AM',
        reactions: [
          { emoji: '🚀', count: 1, users: ['elena_kernel'] }
        ],
        isRead: true
      },
      {
        id: 'msg_e3',
        senderId: 'usr_elena',
        senderName: 'Elena Rostova',
        senderAvatar: avatarElena,
        text: 'Zero dropped packets across 10 million transactions! Here is the exact eBPF ringbuffer filter hook that verified zero contention:',
        timestamp: '10:46 AM',
        codeSnippet: {
          language: 'c',
          filename: 'ebpf_filter.c',
          code: `SEC("xdp")\nint xdp_ring_monitor(struct xdp_md *ctx) {\n    void *data = (void *)(long)ctx->data;\n    void *data_end = (void *)(long)ctx->data_end;\n    struct ethhdr *eth = data;\n    if ((void *)(eth + 1) > data_end) return XDP_PASS;\n    \n    // Direct zero-copy ringbuf event commit\n    struct ring_event *e = bpf_ringbuf_reserve(&ring_events, sizeof(*e), 0);\n    if (e) {\n        e->packet_len = ctx->data_end - ctx->data;\n        bpf_ringbuf_submit(e, 0);\n    }\n    return XDP_PASS;\n}`
        },
        reactions: [
          { emoji: '💻', count: 2, users: ['0xclaudia', 'elena_kernel'] }
        ],
        isRead: true
      },
      {
        id: 'msg_e4',
        senderId: 'usr_elena',
        senderName: 'Elena Rostova',
        senderAvatar: avatarElena,
        text: 'Ready to pair on merging the crate to main whenever you are online!',
        timestamp: 'Just now',
        isRead: false
      }
    ]
  },
  {
    id: 'dm_maya',
    type: 'dm',
    participant: OTHER_USERS.maya,
    lastActive: '12m ago',
    unreadCount: 1,
    isPinned: true,
    messages: [
      {
        id: 'msg_m1',
        senderId: 'usr_maya',
        senderName: 'Maya Chen',
        senderAvatar: avatarMaya,
        text: 'Claudia! The bumpalo memory arena parser just passed our 50,000 LOC stress benchmark. 1.4ms total parse time!',
        timestamp: '09:15 AM',
        isRead: true
      },
      {
        id: 'msg_m2',
        senderId: 'usr_me',
        senderName: 'Claudia Vance',
        senderAvatar: avatarClaudia,
        text: 'That is 4.8x faster than swc! Did the SIMD token scanner handle multi-byte UTF-8 identifiers without fallback penalty?',
        timestamp: '09:20 AM',
        isRead: true
      },
      {
        id: 'msg_m3',
        senderId: 'usr_maya',
        senderName: 'Maya Chen',
        senderAvatar: avatarMaya,
        text: 'Yes, we vectorized the ASCII fast path with AVX2/NEON and branch only on the high bit. Want to review PR #15 together in the Live IDE?',
        timestamp: '12m ago',
        isRead: false
      }
    ]
  },
  {
    id: 'dm_kenji',
    type: 'dm',
    participant: OTHER_USERS.kenji,
    lastActive: '45m ago',
    unreadCount: 0,
    messages: [
      {
        id: 'msg_k1',
        senderId: 'usr_kenji',
        senderName: 'Kenji Sato',
        senderAvatar: avatarKenji,
        text: 'Check out the new WebGPU crystal dispersion compute shader pass. Cauchy wavelength dispersion running at 120 FPS on mobile!',
        timestamp: '08:30 AM',
        codeSnippet: {
          language: 'rust',
          filename: 'dispersion.wgsl',
          code: `@compute @workgroup_size(16, 16)\nfn compute_dispersion(@builtin(global_invocation_id) id: vec3u) {\n    let ior = 1.52 + (0.004 / (wavelength * wavelength));\n    textureStore(output_tex, id.xy, vec4f(col, 1.0));\n}`
        },
        reactions: [
          { emoji: '⚡', count: 1, users: ['0xclaudia'] }
        ],
        isRead: true
      },
      {
        id: 'msg_k2',
        senderId: 'usr_me',
        senderName: 'Claudia Vance',
        senderAvatar: avatarClaudia,
        text: 'The internal reflections look hyper-realistic! I will test it on the WebGPU canvas in the app editor.',
        timestamp: '08:45 AM',
        isRead: true
      }
    ]
  },
  {
    id: 'dm_devon',
    type: 'dm',
    participant: OTHER_USERS.devon,
    lastActive: '2h ago',
    unreadCount: 0,
    messages: [
      {
        id: 'msg_d1',
        senderId: 'usr_devon',
        senderName: 'Devon Hayes',
        senderAvatar: avatarDevon,
        text: 'Hey Claudia, I patched the CRDT state synchronizer causal tree order for concurrent offline merges.',
        timestamp: 'Yesterday',
        isRead: true
      },
      {
        id: 'msg_d2',
        senderId: 'usr_me',
        senderName: 'Claudia Vance',
        senderAvatar: avatarClaudia,
        text: 'Awesome work Devon. Let us run an automated latency simulation tonight.',
        timestamp: '2h ago',
        isRead: true
      }
    ]
  },
  {
    id: 'chan_systems',
    type: 'channel',
    channelName: 'systems-kernel',
    channelTopic: 'Low-level microkernels, lock-free ringbuffers & eBPF',
    channelIcon: 'Terminal',
    lastActive: '5m ago',
    unreadCount: 2,
    messages: [
      {
        id: 'msg_c1',
        senderId: 'usr_elena',
        senderName: 'Elena Rostova',
        senderAvatar: avatarElena,
        text: 'Warning to anyone profiling on Apple Silicon: remember that ARM weak memory ordering requires explicit Acquire/Release pairs on atomic loads/stores.',
        timestamp: '10:00 AM',
        isRead: true
      },
      {
        id: 'msg_c2',
        senderId: 'usr_maya',
        senderName: 'Maya Chen',
        senderAvatar: avatarMaya,
        text: 'Confirmed! We caught a data race on x86 vs M3 Max yesterday. Moving to atomic Ordering::Acquire resolved it instantly.',
        timestamp: '10:12 AM',
        isRead: true
      },
      {
        id: 'msg_c3',
        senderId: 'usr_me',
        senderName: 'Claudia Vance',
        senderAvatar: avatarClaudia,
        text: 'PR #24 addresses exactly this with 64-byte cacheline isolation and strict acquire/release fences.',
        timestamp: '10:25 AM',
        reactions: [
          { emoji: '🔥', count: 3, users: ['elena_kernel', 'mayacodes'] }
        ],
        isRead: true
      }
    ]
  },
  {
    id: 'chan_midnight',
    type: 'channel',
    channelName: 'midnight-hackers',
    channelTopic: 'Late-night debugging marathons & caffeine fueled sprints',
    channelIcon: 'Moon',
    lastActive: '1h ago',
    unreadCount: 0,
    messages: [
      {
        id: 'msg_m_1',
        senderId: 'usr_kenji',
        senderName: 'Kenji Sato',
        senderAvatar: avatarKenji,
        text: 'Who is still hacking? The 02:00 AM sentinel badge just triggered for Claudia and Elena!',
        timestamp: '02:05 AM',
        isRead: true
      },
      {
        id: 'msg_m_2',
        senderId: 'usr_me',
        senderName: 'Claudia Vance',
        senderAvatar: avatarClaudia,
        text: 'Still here tuning the ringbuffer assembly output! Sleep is for when the kernel is stable.',
        timestamp: '02:10 AM',
        reactions: [
          { emoji: '🚀', count: 4, users: ['kenji_gpu', 'elena_kernel', 'mayacodes', 'devon_sh'] }
        ],
        isRead: true
      }
    ]
  }
];

