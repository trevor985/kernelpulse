import { User, Skill } from '../types';
import { CURRENT_USER, OTHER_USERS, ASSET_IMAGES } from '../data/initialData';

export interface StoredAccount {
  id: string;
  email: string;
  handle: string;
  passwordHash: string; // Stored locally
  user: User;
  createdAt: string;
}

const STORAGE_ACCOUNTS_KEY = 'kp_registered_accounts';
const STORAGE_SESSION_KEY = 'kp_auth_session';

export const AVATAR_PRESETS = [
  { id: 'claudia', label: 'Systems Cyberpunk', url: ASSET_IMAGES.avatarClaudia },
  { id: 'elena', label: 'eBPF Kernel Hacker', url: ASSET_IMAGES.avatarElena },
  { id: 'maya', label: 'Compiler Specialist', url: ASSET_IMAGES.avatarMaya },
  { id: 'kenji', label: 'WebGPU Shader Artist', url: ASSET_IMAGES.avatarKenji },
  { id: 'devon', label: 'CRDT Sync Architect', url: ASSET_IMAGES.avatarDevon },
];

export const ROLE_TRACKS = [
  'Systems & Low-Level (Rust, C, eBPF)',
  'AI Systems & Compiler Engineering',
  'Fullstack & Distributed Collaboration',
  'WebGPU & Real-Time Graphics',
  'Cloud Infrastructure & Kubernetes'
];

export const DEFAULT_TECH_SKILLS = [
  { name: 'Rust', level: 90, category: 'systems' as const, verified: true, endorsements: 12 },
  { name: 'TypeScript', level: 85, category: 'web' as const, verified: true, endorsements: 8 },
  { name: 'Linux & Kernel', level: 80, category: 'security' as const, verified: false, endorsements: 5 },
  { name: 'Docker / Cloud', level: 78, category: 'cloud' as const, verified: false, endorsements: 3 }
];

export function getInitialAccounts(): StoredAccount[] {
  return [
    {
      id: CURRENT_USER.id,
      email: CURRENT_USER.email || 'purityclaudia9@gmail.com',
      handle: CURRENT_USER.handle,
      passwordHash: 'kernelpulse2026!',
      user: CURRENT_USER,
      createdAt: '2026-01-15T08:00:00Z'
    },
    {
      id: OTHER_USERS.elena.id,
      email: 'elena@kernelpulse.dev',
      handle: OTHER_USERS.elena.handle,
      passwordHash: 'ebpfmaster2026!',
      user: {
        ...OTHER_USERS.elena,
        email: 'elena@kernelpulse.dev',
        role: 'Kernel & eBPF Security'
      },
      createdAt: '2026-02-01T12:00:00Z'
    },
    {
      id: OTHER_USERS.kenji.id,
      email: 'kenji@kernelpulse.dev',
      handle: OTHER_USERS.kenji.handle,
      passwordHash: 'webgpushader!',
      user: {
        ...OTHER_USERS.kenji,
        email: 'kenji@kernelpulse.dev',
        role: 'WebGPU & Graphics Engine'
      },
      createdAt: '2026-02-10T14:30:00Z'
    },
    {
      id: OTHER_USERS.maya.id,
      email: 'maya@kernelpulse.dev',
      handle: OTHER_USERS.maya.handle,
      passwordHash: 'llvmcompiler!',
      user: {
        ...OTHER_USERS.maya,
        email: 'maya@kernelpulse.dev',
        role: 'Compiler Architect'
      },
      createdAt: '2026-02-18T10:15:00Z'
    }
  ];
}

export function getRegisteredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
    if (!raw) {
      const initial = getInitialAccounts();
      localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load registered accounts:', err);
    return getInitialAccounts();
  }
}

export function saveRegisteredAccounts(accounts: StoredAccount[]) {
  try {
    localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed to save accounts:', err);
  }
}

export function getCurrentSession(): { isLoggedIn: boolean; user: User } {
  try {
    const rawUser = localStorage.getItem('kp_current_user');
    const rawLoggedIn = localStorage.getItem(STORAGE_SESSION_KEY);
    
    // Default to true if user was already exploring or first time
    const isLoggedIn = rawLoggedIn !== null ? rawLoggedIn === 'true' : true;
    const user = rawUser ? JSON.parse(rawUser) : CURRENT_USER;
    
    return { isLoggedIn, user };
  } catch {
    return { isLoggedIn: true, user: CURRENT_USER };
  }
}

export function saveCurrentSession(isLoggedIn: boolean, user: User) {
  try {
    localStorage.setItem(STORAGE_SESSION_KEY, String(isLoggedIn));
    localStorage.setItem('kp_current_user', JSON.stringify(user));
  } catch (err) {
    console.error('Failed to save session:', err);
  }
}

export function authenticateUser(
  identifier: string,
  pass: string
): { success: boolean; user?: User; error?: string } {
  const cleanId = identifier.trim().toLowerCase().replace(/^@/, '');
  const cleanPass = pass.trim();

  if (!cleanId) {
    return { success: false, error: 'Enter your email or hacker handle.' };
  }
  if (!cleanPass) {
    return { success: false, error: 'Password required.' };
  }

  const accounts = getRegisteredAccounts();
  const match = accounts.find(
    (acc) =>
      acc.email.toLowerCase() === cleanId ||
      acc.handle.toLowerCase() === cleanId
  );

  if (!match) {
    // If user enters any test credentials in demo, check if it's default admin or allow easy recovery
    return {
      success: false,
      error: `No hacker node registered with handle or email "${identifier}". Try quick demo login or sign up.`
    };
  }

  // Check password or demo bypass if matched
  if (match.passwordHash && match.passwordHash !== cleanPass) {
    return { success: false, error: 'Invalid master passphrase or key mismatch.' };
  }

  return { success: true, user: match.user };
}

export interface SignUpPayload {
  name: string;
  handle: string;
  email: string;
  password: string;
  roleTrack?: string;
  headline?: string;
  bio?: string;
  github?: string;
  location?: string;
  avatarUrl?: string;
}

export function registerNewUser(
  payload: SignUpPayload
): { success: boolean; user?: User; error?: string } {
  const cleanHandle = payload.handle.trim().toLowerCase().replace(/^@/, '');
  const cleanEmail = payload.email.trim().toLowerCase();
  const cleanName = payload.name.trim();

  if (!cleanName) {
    return { success: false, error: 'Full name or hacker alias is required.' };
  }
  if (!cleanHandle || cleanHandle.length < 3) {
    return { success: false, error: 'Hacker handle must be at least 3 characters.' };
  }
  if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    return { success: false, error: 'Valid email address is required.' };
  }
  if (!payload.password || payload.password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const accounts = getRegisteredAccounts();
  const emailExists = accounts.some((a) => a.email.toLowerCase() === cleanEmail);
  if (emailExists) {
    return { success: false, error: 'An account with this email address already exists. Please sign in.' };
  }

  const handleExists = accounts.some((a) => a.handle.toLowerCase() === cleanHandle);
  if (handleExists) {
    return { success: false, error: `Handle @${cleanHandle} is already claimed. Pick another unique handle.` };
  }

  const newId = `usr_${cleanHandle}_${Date.now()}`;
  const newUser: User = {
    id: newId,
    name: cleanName,
    handle: cleanHandle,
    email: cleanEmail,
    role: payload.roleTrack || 'Systems & Network Engineer',
    avatar: payload.avatarUrl || ASSET_IMAGES.avatarClaudia,
    headline: payload.headline || `${payload.roleTrack || 'Software Engineer'} & Open Source Hacker`,
    bio: payload.bio || 'New developer on KernelPulse. Excited to pair program, collaborate on sprints, and ship performant systems.',
    location: payload.location || 'Remote / Worldwide',
    github: payload.github ? (payload.github.startsWith('http') ? payload.github : `https://github.com/${payload.github}`) : `https://github.com/${cleanHandle}`,
    reputation: 150,
    starsCount: 12,
    collaborationsCount: 1,
    pairProgrammingHours: 4,
    isOnline: true,
    activeSprintTitle: 'Genesis Sprint',
    skills: DEFAULT_TECH_SKILLS,
    badges: [
      {
        id: 'b_welcome',
        title: 'Kernel Pulse Initiate',
        description: 'Successfully initialized cryptographic node and developer keypair on KernelPulse.',
        rarity: 'common',
        category: 'systems',
        icon: 'Shield',
        unlockedAt: 'Today',
        criteria: 'Register developer account and verify identity.'
      }
    ]
  };

  const newAccount: StoredAccount = {
    id: newId,
    email: cleanEmail,
    handle: cleanHandle,
    passwordHash: payload.password,
    user: newUser,
    createdAt: new Date().toISOString()
  };

  accounts.unshift(newAccount);
  saveRegisteredAccounts(accounts);

  return { success: true, user: newUser };
}

export function calculatePasswordStrength(pass: string): {
  score: number; // 0 to 4
  label: 'Very Weak' | 'Weak' | 'Medium' | 'Strong' | 'Military-Grade';
  color: string;
  checks: {
    length: boolean;
    hasUpper: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
} {
  const checks = {
    length: pass.length >= 8,
    hasUpper: /[A-Z]/.test(pass),
    hasNumber: /[0-9]/.test(pass),
    hasSpecial: /[^A-Za-z0-9]/.test(pass)
  };

  let score = 0;
  if (pass.length >= 6) score++;
  if (checks.length) score++;
  if (checks.hasUpper && checks.hasNumber) score++;
  if (checks.hasSpecial && checks.length) score++;

  let label: 'Very Weak' | 'Weak' | 'Medium' | 'Strong' | 'Military-Grade' = 'Very Weak';
  let color = 'bg-rose-500';

  if (score === 1) {
    label = 'Weak';
    color = 'bg-amber-500';
  } else if (score === 2) {
    label = 'Medium';
    color = 'bg-yellow-400';
  } else if (score === 3) {
    label = 'Strong';
    color = 'bg-emerald-400';
  } else if (score >= 4) {
    label = 'Military-Grade';
    color = 'bg-emerald-500 shadow-sm shadow-emerald-500/50';
  }

  return { score, label, color, checks };
}
