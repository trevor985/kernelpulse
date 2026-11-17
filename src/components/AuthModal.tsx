import React, { useState } from 'react';
import { 
  Terminal, 
  Lock, 
  UserPlus, 
  LogIn, 
  Github, 
  Mail, 
  Eye, 
  EyeOff, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  X, 
  Sparkles, 
  KeyRound, 
  Cpu, 
  CheckCircle2, 
  ChevronRight,
  UserCheck,
  Code2,
  Globe
} from 'lucide-react';
import { User } from '../types';
import { 
  authenticateUser, 
  registerNewUser, 
  calculatePasswordStrength, 
  AVATAR_PRESETS, 
  ROLE_TRACKS, 
  getRegisteredAccounts,
  StoredAccount 
} from '../utils/auth';
import { playTechClick, playSuccessChime } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'signup';
  onClose: () => void;
  onSuccess: (user: User, isNewAccount: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'signin',
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  
  // Sign In form
  const [loginIdentifier, setLoginIdentifier] = useState('purityclaudia9@gmail.com');
  const [loginPassword, setLoginPassword] = useState('kernelpulse2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sign Up form
  const [signupName, setSignupName] = useState('');
  const [signupHandle, setSignupHandle] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupRoleTrack, setSignupRoleTrack] = useState(ROLE_TRACKS[0]);
  const [signupHeadline, setSignupHeadline] = useState('');
  const [signupBio, setSignupBio] = useState('');
  const [signupGithub, setSignupGithub] = useState('');
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(AVATAR_PRESETS[0].url);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupStep, setSignupStep] = useState<1 | 2>(1);

  // Forgot password flow
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  // Quick Demo Accounts list
  const registeredAccounts = getRegisteredAccounts();

  if (!isOpen) return null;

  const passwordStrength = calculatePasswordStrength(signupPassword);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);
    playTechClick(800);

    setTimeout(() => {
      const result = authenticateUser(loginIdentifier, loginPassword);
      setIsSubmitting(false);

      if (result.success && result.user) {
        playSuccessChime();
        onSuccess(result.user, false);
        onClose();
      } else {
        setLoginError(result.error || 'Authentication failed. Check credentials.');
      }
    }, 450);
  };

  const handleQuickDemoLogin = (account: StoredAccount) => {
    playTechClick(900);
    setLoginIdentifier(account.email);
    setLoginPassword(account.passwordHash || 'kernelpulse2026!');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      playSuccessChime();
      onSuccess(account.user, false);
      onClose();
    }, 350);
  };

  const handleSocialAuth = (provider: 'github' | 'google') => {
    playTechClick(850);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      playSuccessChime();
      
      if (provider === 'google') {
        // Log in with purityclaudia9@gmail.com
        const claudiaAccount = registeredAccounts.find(a => a.email.toLowerCase().includes('purityclaudia9')) || registeredAccounts[0];
        onSuccess(claudiaAccount.user, false);
      } else {
        // GitHub simulated auth
        const gitUser = registeredAccounts[0].user;
        onSuccess(gitUser, false);
      }
      onClose();
    }, 600);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);

    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match. Please verify.');
      return;
    }

    if (signupPassword.length < 6) {
      setSignupError('Master password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    playTechClick(820);

    setTimeout(() => {
      const result = registerNewUser({
        name: signupName,
        handle: signupHandle,
        email: signupEmail,
        password: signupPassword,
        roleTrack: signupRoleTrack,
        headline: signupHeadline || `${signupRoleTrack} Developer`,
        bio: signupBio,
        github: signupGithub,
        avatarUrl: selectedAvatarUrl
      });

      setIsSubmitting(false);

      if (result.success && result.user) {
        playSuccessChime();
        onSuccess(result.user, true);
        onClose();
      } else {
        setSignupError(result.error || 'Registration failed. Please check inputs.');
      }
    }, 500);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      setForgotSuccess(null);
      return;
    }
    playSuccessChime();
    const mockToken = `kp_rst_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    setForgotSuccess(`A secure reset token [${mockToken}] has been dispatched to ${forgotEmail}. Check your terminal or inbox to reset credentials.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Status Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <span>KernelPulse Auth</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                TLS 1.3 // 256-Bit Developer Keypair
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3" />
              <span>ZERO-LEAK</span>
            </span>
            <button
              onClick={() => {
                playTechClick(600);
                onClose();
              }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Toggle: Sign In vs Create Account */}
        <div className="grid grid-cols-2 p-1.5 mx-5 mt-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50">
          <button
            type="button"
            onClick={() => {
              playTechClick(750);
              setMode('signin');
              setLoginError(null);
              setShowForgotPassword(false);
            }}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold font-mono transition-all ${
              mode === 'signin' && !showForgotPassword
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-emerald-400 shadow-xs border border-slate-200/50 dark:border-emerald-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playTechClick(750);
              setMode('signup');
              setSignupError(null);
              setShowForgotPassword(false);
            }}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold font-mono transition-all ${
              mode === 'signup'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-emerald-400 shadow-xs border border-slate-200/50 dark:border-emerald-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Quick Social / Fast Connect Bar */}
        <div className="px-5 pt-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleSocialAuth('github')}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-medium transition-colors border border-slate-700/60 shadow-xs disabled:opacity-50"
            >
              <Github className="w-4 h-4 text-white" />
              <span>GitHub Key</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialAuth('google')}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-mono font-medium transition-colors border border-slate-200 dark:border-slate-700 shadow-xs disabled:opacity-50"
            >
              <Globe className="w-4 h-4 text-emerald-500" />
              <span>Google SSO</span>
            </button>
          </div>

          <div className="relative my-3 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <span className="relative px-2 bg-white dark:bg-slate-900 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              or authenticate with credentials
            </span>
          </div>
        </div>

        {/* VIEW 1: SIGN IN FORM */}
        {mode === 'signin' && !showForgotPassword && (
          <form onSubmit={handleSignIn} className="px-5 pb-5 space-y-3.5">
            {loginError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-mono text-[11px] leading-tight">{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 font-mono">
                Email or Hacker Handle
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="name@domain.com or @0xhandle"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
                  Master Passphrase
                </label>
                <button
                  type="button"
                  onClick={() => {
                    playTechClick(650);
                    setShowForgotPassword(true);
                  }}
                  className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Forgot Key?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-9 pr-10 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-emerald-500 focus:ring-emerald-400 focus:ring-offset-0 bg-slate-50 dark:bg-slate-800"
                />
                <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
                  Keep terminal session persistent
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs font-mono tracking-wide transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin" />
                  <span>Verifying Cryptographic Session...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Authenticate &amp; Enter Kernel</span>
                </>
              )}
            </button>

            {/* Quick Demo Accounts Switcher for Easy Testing */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                <span>1-Click Test Personas</span>
                <span className="text-emerald-500 text-[9px]">INSTANT LOGIN</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {registeredAccounts.slice(0, 4).map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleQuickDemoLogin(acc)}
                    className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 hover:bg-emerald-500/10 border border-slate-200/60 dark:border-slate-800 hover:border-emerald-500/40 text-left transition-colors"
                  >
                    <img 
                      src={acc.user.avatar} 
                      alt={acc.user.name} 
                      className="w-6 h-6 rounded-full object-cover border border-slate-700 shrink-0" 
                    />
                    <div className="truncate">
                      <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {acc.user.name.split(' ')[0]}
                      </div>
                      <div className="text-[9px] font-mono text-slate-400 truncate">
                        @{acc.handle}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'signin' && showForgotPassword && (
          <form onSubmit={handleForgotPassword} className="px-5 pb-5 space-y-3.5">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-800 dark:text-emerald-300">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <KeyRound className="w-4 h-4" />
                <span>Zero-Trust Credential Recovery</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Input your registered email address to receive an asymmetric cryptographic recovery token.
              </p>
            </div>

            {forgotSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-mono space-y-2 animate-in fade-in">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Recovery Token Generated</span>
                </div>
                <p className="text-[11px]">{forgotSuccess}</p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setLoginIdentifier(forgotEmail);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
                >
                  Return to Sign In
                </button>
              </div>
            )}

            {!forgotSuccess && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 font-mono">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="purityclaudia9@gmail.com"
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs font-mono tracking-wide transition-all shadow-md shadow-emerald-500/20"
                  >
                    Send Recovery Key
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </form>
        )}

        {/* VIEW 2: SIGN UP / REGISTRATION FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="px-5 pb-5 space-y-3.5">
            {signupError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-mono text-[11px] leading-tight">{signupError}</span>
              </div>
            )}

            {/* Stepper Tabs */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setSignupStep(1)}
                className={`flex items-center gap-1.5 ${signupStep === 1 ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}
              >
                <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">1</span>
                <span>Credentials</span>
              </button>
              <span className="text-slate-400">&rarr;</span>
              <button
                type="button"
                onClick={() => {
                  if (!signupName || !signupHandle || !signupEmail) {
                    setSignupError('Please fill in Name, Handle, and Email first.');
                    return;
                  }
                  setSignupError(null);
                  setSignupStep(2);
                }}
                className={`flex items-center gap-1.5 ${signupStep === 2 ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}
              >
                <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">2</span>
                <span>Hacker Persona &amp; Avatar</span>
              </button>
            </div>

            {/* STEP 1: Core Credentials */}
            {signupStep === 1 && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 font-mono">
                      Full Name / Alias
                    </label>
                    <input
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="e.g. Claudia Vance"
                      required
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 font-mono">
                      Hacker Handle
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1.5 text-xs text-slate-400 font-mono">@</span>
                      <input
                        type="text"
                        value={signupHandle}
                        onChange={(e) => setSignupHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                        placeholder="0xclaudia"
                        required
                        className="w-full pl-6 pr-2 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 font-mono">
                    Developer Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="purityclaudia9@gmail.com"
                      required
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 font-mono">
                    Master Passphrase
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Min 6 characters (mix letters, numbers)"
                      required
                      className="w-full pl-9 pr-10 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {signupPassword && (
                    <div className="mt-1.5 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-400">Entropy Score:</span>
                        <span className={`font-semibold ${
                          passwordStrength.score >= 3 ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${passwordStrength.color}`} 
                          style={{ width: `${Math.max(20, (passwordStrength.score / 4) * 100)}%` }} 
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 font-mono">
                    Confirm Passphrase
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      placeholder="Repeat passphrase"
                      required
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!signupName || !signupHandle || !signupEmail || !signupPassword) {
                      setSignupError('Please fill out all credential fields.');
                      return;
                    }
                    if (signupPassword !== signupConfirmPassword) {
                      setSignupError('Passwords do not match.');
                      return;
                    }
                    setSignupError(null);
                    setSignupStep(2);
                  }}
                  className="w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Next: Persona &amp; Tech Stack</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: Hacker Persona & Tech Stack */}
            {signupStep === 2 && (
              <div className="space-y-3">
                {/* Avatar Picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
                    Select Hacker Portrait
                  </label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {AVATAR_PRESETS.map((p) => {
                      const isSelected = selectedAvatarUrl === p.url;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            playTechClick(700);
                            setSelectedAvatarUrl(p.url);
                          }}
                          className={`relative shrink-0 w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                            isSelected
                              ? 'border-emerald-500 ring-2 ring-emerald-500/40 scale-105'
                              : 'border-slate-300 dark:border-slate-700 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                          {isSelected && (
                            <span className="absolute bottom-0 right-0 p-0.5 bg-emerald-500 text-slate-950 rounded-tl-md">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 font-mono">
                    Engineering Track / Focus
                  </label>
                  <select
                    value={signupRoleTrack}
                    onChange={(e) => setSignupRoleTrack(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                  >
                    {ROLE_TRACKS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 font-mono">
                      Headline
                    </label>
                    <input
                      type="text"
                      value={signupHeadline}
                      onChange={(e) => setSignupHeadline(e.target.value)}
                      placeholder="e.g. Systems & Compiler Hacker"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 font-mono">
                      GitHub Handle
                    </label>
                    <input
                      type="text"
                      value={signupGithub}
                      onChange={(e) => setSignupGithub(e.target.value)}
                      placeholder="username"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 font-mono">
                    Bio / Hacker Manifesto
                  </label>
                  <textarea
                    rows={2}
                    value={signupBio}
                    onChange={(e) => setSignupBio(e.target.value)}
                    placeholder="Tell other engineers what you build, your favorite stack, and sprint interests..."
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSignupStep(1)}
                    className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs font-mono tracking-wide transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Cpu className="w-4 h-4 animate-spin" />
                        <span>Initializing Keypair...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Initialize Node &amp; Register</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}

        {/* Footer info */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Encrypted local session cache</span>
          </span>
          <span>KernelPulse v1.4</span>
        </div>
      </div>
    </div>
  );
};
