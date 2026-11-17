import React, { useState } from 'react';
import { 
  Terminal, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Monitor, 
  Bell, 
  Radio, 
  Check, 
  X, 
  Download, 
  MessageSquare,
  LogIn,
  UserPlus,
  LogOut,
  User as UserIcon,
  ChevronDown,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { User } from '../types';
import { playTechClick } from '../utils/audio';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  onOpenPairLive: () => void;
  onOpenPublishModal?: () => void;
  onOpenMessages?: () => void;
  unreadMessagesCount?: number;
  currentUser?: User;
  isLoggedIn?: boolean;
  onOpenAuth?: (mode: 'signin' | 'signup') => void;
  onSignOut?: () => void;
  onNavigateProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  soundEnabled,
  onToggleSound,
  isMobileFrame,
  onToggleMobileFrame,
  onOpenPairLive,
  onOpenPublishModal,
  onOpenMessages,
  unreadMessagesCount = 0,
  currentUser,
  isLoggedIn = true,
  onOpenAuth,
  onSignOut,
  onNavigateProfile
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Pair Programming Invite',
      desc: '@elena_kernel invited you to pair on packet_probe.bpf.c',
      time: '4m ago',
      unread: true,
      action: 'Join Room'
    },
    {
      id: 2,
      title: 'Sprint Match Found (96%)',
      desc: 'Your Rust skills matched the AetherKernel Async I/O sprint',
      time: '1h ago',
      unread: true
    },
    {
      id: 3,
      title: 'Badge Unlocked',
      desc: 'You earned the "02:00 AM Sentinel" achievement badge',
      time: '1d ago',
      unread: false
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between">
        
        {/* Left: Brand Wordmark & Live Ping */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Terminal className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                KernelPulse
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-wider">
                DEV &amp; HACKER NET
              </span>
            </div>
          </div>

          {/* Quick Live Pair Session shortcut */}
          <button
            onClick={() => {
              playTechClick(900);
              onOpenPairLive();
            }}
            title="Open Active Pair Programming Session"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>PAIR LIVE</span>
          </button>
        </div>

        {/* Right: Actions and Toggles */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Publish / Play Store & Install Guide Button */}
          {onOpenPublishModal && (
            <button
              onClick={() => {
                playTechClick(850);
                onOpenPublishModal();
              }}
              title="Publish to Google Play Store & Internet"
              className="hidden xs:flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-mono font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Play Store &amp; Web</span>
            </button>
          )}

          {/* Sound toggle */}
          <button
            onClick={() => {
              playTechClick(650);
              onToggleSound();
            }}
            title={soundEnabled ? 'Mute Interface Clicks' : 'Enable Tactile Audio'}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
            aria-label="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Device Frame Viewport Toggle (visible on tablet/desktop) */}
          <button
            onClick={() => {
              playTechClick(750);
              onToggleMobileFrame();
            }}
            title={isMobileFrame ? 'Expand to Responsive Web Layout' : 'Preview as Mobile Device Frame'}
            className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
            aria-label="Toggle Device View"
          >
            {isMobileFrame ? (
              <Monitor className="w-4 h-4 text-emerald-500" />
            ) : (
              <Smartphone className="w-4 h-4" />
            )}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => {
              playTechClick(820);
              onToggleDarkMode();
            }}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Direct Messages Shortcut */}
          {onOpenMessages && (
            <button
              onClick={() => {
                playTechClick(850);
                onOpenMessages();
              }}
              title="Open Kernel Messages & Chats"
              className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
              aria-label="Direct Messages"
            >
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              {unreadMessagesCount > 0 && (
                <span className="absolute top-1 right-1 px-1 py-0.2 rounded-full bg-emerald-500 text-slate-950 font-bold text-[8px] font-mono shadow-xs">
                  {unreadMessagesCount}
                </span>
              )}
            </button>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                playTechClick(700);
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                      Telemetry &amp; Alerts
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono">
                      {unreadCount} new
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setNotifications(notifications.map(n => ({ ...n, unread: false })));
                        playTechClick(600);
                      }}
                      className="text-[11px] text-slate-500 hover:text-emerald-500 px-1.5 py-0.5 rounded transition-colors"
                    >
                      Mark all read
                    </button>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded-lg text-left transition-colors ${
                        item.unread 
                          ? 'bg-slate-50 dark:bg-slate-800/60 border border-emerald-500/30' 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        {item.desc}
                      </p>
                      {item.action && (
                        <button
                          onClick={() => {
                            setShowNotifications(false);
                            onOpenPairLive();
                          }}
                          className="mt-2 text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <Radio className="w-3 h-3 text-emerald-500" />
                          {item.action} &rarr;
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Authentication & User Account Menu */}
          {isLoggedIn && currentUser ? (
            <div className="relative pl-1">
              <button
                onClick={() => {
                  playTechClick(750);
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors"
                title={`Logged in as ${currentUser.name} (@${currentUser.handle})`}
              >
                <div className="relative">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg object-cover ring-1 ring-emerald-500/50"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-slate-900" />
                </div>
                <span className="hidden sm:inline text-xs font-mono font-medium text-slate-800 dark:text-slate-200 max-w-[80px] truncate">
                  @{currentUser.handle}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Account Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 text-left">
                  {/* User Profile Card Header */}
                  <div className="flex items-start gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/40 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 truncate">
                        @{currentUser.handle}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 truncate">
                        {currentUser.email || 'developer@kernelpulse.dev'}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="my-2.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{currentUser.role || 'Kernel Developer'}</span>
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 font-bold">
                      ACTIVE
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="space-y-1">
                    {onNavigateProfile && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          playTechClick(800);
                          onNavigateProfile();
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-emerald-500" />
                        <span>My Hacker Profile</span>
                      </button>
                    )}

                    {onOpenAuth && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          playTechClick(750);
                          onOpenAuth('signin');
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <LogIn className="w-4 h-4 text-cyan-500" />
                        <span>Switch Persona / Relog</span>
                      </button>
                    )}

                    {onOpenAuth && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          playTechClick(750);
                          onOpenAuth('signup');
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <UserPlus className="w-4 h-4 text-emerald-400" />
                        <span>Create New Node / Account</span>
                      </button>
                    )}

                    {onSignOut && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          playTechClick(600);
                          onSignOut();
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-mono text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors pt-2 border-t border-slate-100 dark:border-slate-800"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Disconnect Session (Sign Out)</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 pl-1">
              <button
                onClick={() => {
                  playTechClick(800);
                  onOpenAuth?.('signin');
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-mono font-medium transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-500" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => {
                  playTechClick(850);
                  onOpenAuth?.('signup');
                }}
                className="hidden xs:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold transition-colors shadow-sm shadow-emerald-500/20"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
