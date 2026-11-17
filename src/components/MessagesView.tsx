import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Send, 
  Image as ImageIcon, 
  Code2, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  Phone, 
  Video, 
  ArrowLeft, 
  Check, 
  CheckCheck, 
  Pin, 
  Radio, 
  Plus, 
  Copy, 
  Flame, 
  Rocket, 
  Cpu, 
  Zap, 
  Sparkles,
  ExternalLink,
  Users,
  Hash,
  X,
  Volume2
} from 'lucide-react';
import { Conversation, TextMessage, TextMessageReaction, User } from '../types';
import { ImageWithFallback } from './ImageWithFallback';
import { playTechClick, playSuccessChime } from '../utils/audio';
import { ASSET_IMAGES } from '../data/initialData';

interface MessagesViewProps {
  conversations: Conversation[];
  currentUser: User;
  onUpdateConversations: (conversations: Conversation[]) => void;
  onOpenLiveIDE: (code?: string, language?: string, filename?: string) => void;
  onViewUserProfile: (user: User) => void;
  initialSelectedId?: string | null;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  conversations,
  currentUser,
  onUpdateConversations,
  onOpenLiveIDE,
  onViewUserProfile,
  initialSelectedId
}) => {
  const [selectedConvId, setSelectedConvId] = useState<string>(() => {
    if (initialSelectedId && conversations.some(c => c.id === initialSelectedId)) {
      return initialSelectedId;
    }
    return conversations[0]?.id || '';
  });

  const [filterType, setFilterType] = useState<'all' | 'dm' | 'channel'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  
  // Attachments state
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedImageCaption, setAttachedImageCaption] = useState<string>('');
  const [showCodeSnippetModal, setShowCodeSnippetModal] = useState(false);
  const [codeModalLang, setCodeModalLang] = useState('rust');
  const [codeModalFilename, setCodeModalFilename] = useState('atomic_queue.rs');
  const [codeModalContent, setCodeModalContent] = useState('pub struct SpscRing<T> { head: AtomicUsize, tail: AtomicUsize }');

  // New Chat Modal
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  // Copied code snippet status
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  // Call simulation state
  const [isCallActive, setIsCallActive] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Select initial conversation when changed from outside (e.g. from User Profile "Message" button)
  useEffect(() => {
    if (initialSelectedId && conversations.some(c => c.id === initialSelectedId)) {
      setSelectedConvId(initialSelectedId);
    }
  }, [initialSelectedId, conversations]);

  const activeConversation = conversations.find(c => c.id === selectedConvId) || conversations[0];

  // Mark active conversation as read
  useEffect(() => {
    if (activeConversation && activeConversation.unreadCount > 0) {
      const updated = conversations.map(c => {
        if (c.id === activeConversation.id) {
          return {
            ...c,
            unreadCount: 0,
            messages: c.messages.map(m => ({ ...m, isRead: true }))
          };
        }
        return c;
      });
      onUpdateConversations(updated);
    }
  }, [selectedConvId]);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, isTyping]);

  // Filter conversations
  const filteredConversations = conversations.filter(c => {
    if (filterType === 'dm' && c.type !== 'dm') return false;
    if (filterType === 'channel' && c.type !== 'channel') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const title = c.type === 'dm' ? c.participant?.name.toLowerCase() : c.channelName?.toLowerCase();
      const lastMsg = c.messages[c.messages.length - 1]?.text.toLowerCase() || '';
      return (title && title.includes(q)) || lastMsg.includes(q);
    }
    return true;
  });

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputText).trim();
    if (!text && !attachedImage) return;

    playTechClick(850);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMessage: TextMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: text,
      timestamp: timeStr,
      mediaUrl: attachedImage || undefined,
      mediaCaption: attachedImageCaption || undefined,
      isRead: true
    };

    const targetConvId = activeConversation.id;
    const isDM = activeConversation.type === 'dm';
    const partner = activeConversation.participant;

    const updated = conversations.map(c => {
      if (c.id === targetConvId) {
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastActive: 'Just now'
        };
      }
      return c;
    });

    onUpdateConversations(updated);
    setInputText('');
    setAttachedImage(null);
    setAttachedImageCaption('');

    // Simulate smart interactive reply from partner or channel member
    if (isDM && partner && partner.id !== currentUser.id) {
      setIsTyping(true);
      setTypingUser(partner.name);

      setTimeout(() => {
        setIsTyping(false);
        setTypingUser(null);
        playSuccessChime();

        // Realistic technical developer replies
        let replyText = `Confirmed! Analyzing this patch against the latest benchmark invariants. Ready to review.`;
        let codeSnippet: TextMessage['codeSnippet'] = undefined;
        let replyMedia: string | undefined = undefined;

        const lower = text.toLowerCase();
        if (lower.includes('ring') || lower.includes('queue') || lower.includes('buffer')) {
          replyText = `The 64-byte aligned ring buffer handles 12M ops/sec with zero false sharing. Memory fences check out on ARM64!`;
          replyMedia = ASSET_IMAGES.chatArchDiagram;
        } else if (lower.includes('bench') || lower.includes('speed') || lower.includes('faster')) {
          replyText = `Ran the stress suite: 4.8x latency drop and zero contention. Merging commit to main branch!`;
        } else if (lower.includes('pr') || lower.includes('pull')) {
          replyText = `Reviewed PR #24. Invariants are clean, tests are green, LGTM!`;
        } else if (lower.includes('pair') || lower.includes('code')) {
          replyText = `I am primed in the Live IDE. Let us connect now!`;
          codeSnippet = {
            language: 'rust',
            filename: 'concurrency_fix.rs',
            code: `#[inline(always)]\npub fn verify_ordering() -> bool {\n    head.load(Ordering::Acquire) != tail.load(Ordering::Relaxed)\n}`
          };
        } else if (lower.includes('image') || lower.includes('diagram') || lower.includes('architecture')) {
          replyText = `Here is the L1/L2 cacheline isolation and SPSC queue layout diagram:`;
          replyMedia = ASSET_IMAGES.chatArchDiagram;
        } else {
          replyText = `Got it, Claudia. Let us lock in these changes for the sprint milestone!`;
        }

        const replyMsg: TextMessage = {
          id: `msg_reply_${Date.now()}`,
          senderId: partner.id,
          senderName: partner.name,
          senderAvatar: partner.avatar,
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mediaUrl: replyMedia,
          codeSnippet,
          reactions: [{ emoji: '🔥', count: 1, users: [currentUser.handle] }],
          isRead: true
        };

        const refreshed = updated.map(c => {
          if (c.id === targetConvId) {
            return {
              ...c,
              messages: [...c.messages, replyMsg],
              lastActive: 'Just now'
            };
          }
          return c;
        });

        onUpdateConversations(refreshed);
      }, 1600);
    } else if (activeConversation.type === 'channel') {
      // Channel response
      setIsTyping(true);
      setTypingUser('Systems Bot');
      setTimeout(() => {
        setIsTyping(false);
        setTypingUser(null);
        playSuccessChime();

        const channelReply: TextMessage = {
          id: `msg_chan_${Date.now()}`,
          senderId: 'usr_elena',
          senderName: 'Elena Rostova',
          senderAvatar: ASSET_IMAGES.avatarElena,
          text: `Merged to #${activeConversation.channelName}. Benchmark monitors are reporting nominal latency.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reactions: [{ emoji: '🚀', count: 2, users: [currentUser.handle, 'elena_kernel'] }],
          isRead: true
        };

        const refreshed = updated.map(c => {
          if (c.id === targetConvId) {
            return {
              ...c,
              messages: [...c.messages, channelReply],
              lastActive: 'Just now'
            };
          }
          return c;
        });
        onUpdateConversations(refreshed);
      }, 1800);
    }
  };

  const handleToggleReaction = (messageId: string, emoji: string) => {
    playTechClick(700);
    const updated = conversations.map(c => {
      if (c.id === activeConversation.id) {
        return {
          ...c,
          messages: c.messages.map(m => {
            if (m.id === messageId) {
              const reactions = m.reactions ? [...m.reactions] : [];
              const existingIdx = reactions.findIndex(r => r.emoji === emoji);
              const userHandle = currentUser.handle;

              if (existingIdx >= 0) {
                const reaction = reactions[existingIdx];
                const hasReacted = reaction.users.includes(userHandle);

                if (hasReacted) {
                  const filteredUsers = reaction.users.filter(u => u !== userHandle);
                  if (filteredUsers.length === 0) {
                    reactions.splice(existingIdx, 1);
                  } else {
                    reactions[existingIdx] = {
                      ...reaction,
                      count: reaction.count - 1,
                      users: filteredUsers
                    };
                  }
                } else {
                  reactions[existingIdx] = {
                    ...reaction,
                    count: reaction.count + 1,
                    users: [...reaction.users, userHandle]
                  };
                }
              } else {
                reactions.push({
                  emoji,
                  count: 1,
                  users: [userHandle]
                });
              }

              return { ...m, reactions };
            }
            return m;
          })
        };
      }
      return c;
    });

    onUpdateConversations(updated);
  };

  const handleAddCodeSnippet = () => {
    if (!codeModalContent.trim()) return;
    playSuccessChime();

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage: TextMessage = {
      id: `msg_code_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: `Pushed code snippet for review: \`${codeModalFilename}\``,
      timestamp: timeStr,
      codeSnippet: {
        language: codeModalLang,
        filename: codeModalFilename,
        code: codeModalContent
      },
      isRead: true
    };

    const updated = conversations.map(c => {
      if (c.id === activeConversation.id) {
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastActive: 'Just now'
        };
      }
      return c;
    });

    onUpdateConversations(updated);
    setShowCodeSnippetModal(false);
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetId(id);
    playSuccessChime();
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-8.5rem)] sm:h-[calc(100vh-7rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl m-2 sm:m-4">
      
      {/* Conversations List Sidebar */}
      <div className={`w-full md:w-80 lg:w-96 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 shrink-0 ${
        selectedConvId ? 'hidden md:flex' : 'flex'
      }`}>
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                Kernel Messages
              </h2>
            </div>
            <button
              onClick={() => {
                playTechClick(800);
                setShowNewChatModal(true);
              }}
              className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-sm"
              title="Start New Chat"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          {/* Search Contacts */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search hackers & channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Segmented Filter Pills */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl text-xs font-mono">
            <button
              onClick={() => {
                playTechClick(700);
                setFilterType('all');
              }}
              className={`flex-1 py-1 rounded-lg text-center font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                playTechClick(700);
                setFilterType('dm');
              }}
              className={`flex-1 py-1 rounded-lg text-center font-medium transition-colors ${
                filterType === 'dm'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              DMs
            </button>
            <button
              onClick={() => {
                playTechClick(700);
                setFilterType('channel');
              }}
              className={`flex-1 py-1 rounded-lg text-center font-medium transition-colors ${
                filterType === 'channel'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Rooms
            </button>
          </div>
        </div>

        {/* Conversation Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/40">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <Users className="w-8 h-8 mx-auto text-slate-500/60" />
              <p className="text-xs font-mono">No conversations found</p>
            </div>
          ) : (
            filteredConversations.map(conv => {
              const isSelected = conv.id === activeConversation?.id;
              const lastMsg = conv.messages[conv.messages.length - 1];
              const isDM = conv.type === 'dm';
              const name = isDM ? conv.participant?.name : `#${conv.channelName}`;
              const avatar = isDM ? conv.participant?.avatar : undefined;
              const isOnline = isDM ? conv.participant?.isOnline : true;

              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    playTechClick(750);
                    setSelectedConvId(conv.id);
                  }}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors relative text-left ${
                    isSelected
                      ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-l-4 border-emerald-500'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {/* Avatar / Channel Icon */}
                  <div className="relative shrink-0">
                    {isDM ? (
                      <div className="w-11 h-11 rounded-full overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700">
                        <ImageWithFallback
                          src={avatar}
                          alt={name}
                          fallbackText={name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-2xl bg-slate-800 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm border border-slate-700">
                        <Hash className="w-5 h-5" />
                      </div>
                    )}

                    {isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                    )}
                  </div>

                  {/* Body preview */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {conv.lastActive}
                      </span>
                    </div>

                    {isDM && (
                      <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 truncate">
                        @{conv.participant?.handle}
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2 mt-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                        {lastMsg?.mediaUrl && <ImageIcon className="w-3 h-3 text-emerald-400 shrink-0" />}
                        {lastMsg?.codeSnippet && <Code2 className="w-3 h-3 text-cyan-400 shrink-0" />}
                        <span>{lastMsg?.text || (lastMsg?.mediaUrl ? 'Sent an image attachment' : 'No messages yet')}</span>
                      </p>

                      {conv.unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold font-mono shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Conversation Screen */}
      {activeConversation ? (
        <div className={`flex-1 flex flex-col h-full bg-white dark:bg-slate-900/60 min-w-0 ${
          !selectedConvId ? 'hidden md:flex' : 'flex'
        }`}>
          
          {/* Active Chat Header */}
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {/* Back button on mobile */}
              <button
                onClick={() => setSelectedConvId('')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 md:hidden"
                title="Back to conversations"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* Participant Avatar / Room Info */}
              <div 
                className="relative cursor-pointer shrink-0"
                onClick={() => {
                  if (activeConversation.participant) {
                    onViewUserProfile(activeConversation.participant);
                  }
                }}
              >
                {activeConversation.type === 'dm' ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700">
                    <ImageWithFallback
                      src={activeConversation.participant?.avatar}
                      alt={activeConversation.participant?.name}
                      fallbackText={activeConversation.participant?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm border border-slate-700">
                    <Hash className="w-5 h-5" />
                  </div>
                )}
                {activeConversation.participant?.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 
                    onClick={() => {
                      if (activeConversation.participant) {
                        onViewUserProfile(activeConversation.participant);
                      }
                    }}
                    className="text-sm font-bold text-slate-900 dark:text-white truncate cursor-pointer hover:text-emerald-500 transition-colors"
                  >
                    {activeConversation.type === 'dm' ? activeConversation.participant?.name : `#${activeConversation.channelName}`}
                  </h3>
                  {activeConversation.type === 'dm' && (
                    <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                      @{activeConversation.participant?.handle}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  {isTyping ? (
                    <span className="text-emerald-400 font-mono font-medium animate-pulse flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      {typingUser || 'Developer'} is typing...
                    </span>
                  ) : activeConversation.type === 'dm' ? (
                    <span>{activeConversation.participant?.headline || 'Low-Level Systems Hacker'}</span>
                  ) : (
                    <span>{activeConversation.channelTopic}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Header Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Pair in Live IDE */}
              <button
                onClick={() => {
                  playTechClick(800);
                  const lastCode = activeConversation.messages.find(m => m.codeSnippet)?.codeSnippet;
                  onOpenLiveIDE(lastCode?.code, lastCode?.language, lastCode?.filename);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                title="Open Shared Pair IDE"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden sm:inline">Pair Live</span>
              </button>

              {/* Simulated Discord/Phone call */}
              <button
                onClick={() => {
                  playTechClick(850);
                  setIsCallActive(!isCallActive);
                }}
                className={`p-2 rounded-xl transition-colors ${
                  isCallActive 
                    ? 'bg-emerald-500 text-slate-950 animate-pulse' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                title={isCallActive ? 'Disconnect Voice Channel' : 'Join Voice Channel'}
              >
                <Phone className="w-4 h-4" />
              </button>

              {/* View Profile */}
              {activeConversation.participant && (
                <button
                  onClick={() => {
                    playTechClick(750);
                    onViewUserProfile(activeConversation.participant!);
                  }}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  title="View Profile Details"
                >
                  <Users className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Call Active Banner (if simulated audio channel is on) */}
          {isCallActive && (
            <div className="px-4 py-2 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center justify-between text-xs font-mono text-emerald-400">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 animate-bounce" />
                <span>Voice Connected · 48kHz Opus · 14ms latency</span>
              </div>
              <button
                onClick={() => setIsCallActive(false)}
                className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 font-bold"
              >
                Leave
              </button>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Conversation Starter notice */}
            <div className="text-center py-2">
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-200 dark:border-slate-700/60">
                End-to-End Encrypted Hacker Channel · Verified Git Committers
              </span>
            </div>

            {activeConversation.messages.map(msg => {
              const isMine = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Sender Avatar */}
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-1 ring-1 ring-slate-200 dark:ring-slate-700">
                    <ImageWithFallback
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      fallbackText={msg.senderName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Message Bubble container */}
                  <div className={`max-w-[85%] sm:max-w-md lg:max-w-lg space-y-1.5 text-left ${isMine ? 'items-end' : 'items-start'}`}>
                    
                    {/* Author & Timestamp */}
                    <div className={`flex items-center gap-2 text-[10px] font-mono text-slate-400 ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {isMine ? 'You' : msg.senderName}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {/* Bubble Content */}
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed space-y-2 shadow-sm ${
                      isMine
                        ? 'bg-emerald-600 text-white rounded-tr-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/70 rounded-tl-xs'
                    }`}>
                      {/* Text */}
                      {msg.text && (
                        <p className="whitespace-pre-line font-sans">
                          {msg.text}
                        </p>
                      )}

                      {/* Visible Attached Image with Lightbox Zoom! */}
                      {msg.mediaUrl && (
                        <div className="rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-slate-950 mt-1">
                          <ImageWithFallback
                            src={msg.mediaUrl}
                            alt={msg.mediaCaption || 'Shared Image'}
                            enableZoom={true}
                            caption={msg.mediaCaption}
                            className="w-full max-h-64 object-cover hover:scale-[1.02] transition-transform duration-300"
                          />
                          {msg.mediaCaption && (
                            <div className="px-2.5 py-1 bg-slate-950/80 text-[10px] font-mono text-slate-300">
                              {msg.mediaCaption}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Code Snippet Box */}
                      {msg.codeSnippet && (
                        <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden text-left mt-2">
                          <div className="px-3 py-1.5 bg-slate-900 flex items-center justify-between text-[11px] font-mono text-slate-300 border-b border-slate-800">
                            <span className="text-emerald-400 font-semibold truncate max-w-xs">
                              {msg.codeSnippet.filename || 'snippet'}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleCopyCode(msg.codeSnippet!.code, msg.id)}
                                className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                                title="Copy snippet"
                              >
                                {copiedSnippetId === msg.id ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                              <button
                                onClick={() => onOpenLiveIDE(msg.codeSnippet!.code, msg.codeSnippet!.language, msg.codeSnippet!.filename)}
                                className="text-emerald-400 hover:underline flex items-center gap-0.5 text-[10px]"
                                title="Open in IDE"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>IDE</span>
                              </button>
                            </div>
                          </div>
                          <pre className="p-3 text-[11px] font-mono text-slate-200 overflow-x-auto leading-relaxed">
                            <code>{msg.codeSnippet.code}</code>
                          </pre>
                        </div>
                      )}
                    </div>

                    {/* Emoji Reactions & Add Reaction Trigger */}
                    <div className={`flex flex-wrap items-center gap-1 pt-0.5 ${isMine ? 'justify-end' : 'justify-start'}`}>
                      {msg.reactions && msg.reactions.map(r => {
                        const hasReacted = r.users.includes(currentUser.handle);
                        return (
                          <button
                            key={r.emoji}
                            onClick={() => handleToggleReaction(msg.id, r.emoji)}
                            className={`px-2 py-0.5 rounded-full text-[11px] font-mono flex items-center gap-1 border transition-all ${
                              hasReacted
                                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 font-bold'
                                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                            }`}
                          >
                            <span>{r.emoji}</span>
                            <span>{r.count}</span>
                          </button>
                        );
                      })}

                      {/* Quick Emoji Reaction buttons */}
                      <div className="flex items-center gap-0.5 opacity-60 hover:opacity-100 transition-opacity">
                        {['🔥', '🚀', '💻', '⚡'].map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => handleToggleReaction(msg.id, emoji)}
                            className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-xs transition-transform active:scale-125"
                            title={`React with ${emoji}`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 animate-pulse pl-10">
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-[11px] text-slate-400">{typingUser || 'Elena'} is writing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Suggestion Chips */}
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Quick:
            </span>
            <button
              onClick={() => handleSendMessage('Reviewed PR #24 cacheline alignment. Lock-free invariants verified!')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-700 dark:text-slate-300 hover:border-emerald-500 transition-colors whitespace-nowrap shrink-0"
            >
              🚀 PR #24 Review
            </button>
            <button
              onClick={() => {
                setAttachedImage(ASSET_IMAGES.chatArchDiagram);
                setAttachedImageCaption('L1/L2 Cacheline Isolation & SPSC Ring Buffer Architecture');
              }}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-700 dark:text-slate-300 hover:border-emerald-500 transition-colors whitespace-nowrap shrink-0"
            >
              🖼️ Attach Architecture Diagram
            </button>
            <button
              onClick={() => setShowCodeSnippetModal(true)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-700 dark:text-slate-300 hover:border-emerald-500 transition-colors whitespace-nowrap shrink-0"
            >
              💻 Send Code Block
            </button>
            <button
              onClick={() => handleSendMessage('Let us start a pair programming session on the WASM compiler export.')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-700 dark:text-slate-300 hover:border-emerald-500 transition-colors whitespace-nowrap shrink-0"
            >
              ⚡ Invite to Pair Live
            </button>
          </div>

          {/* Pending Attached Image Preview */}
          {attachedImage && (
            <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={attachedImage}
                  alt="Attachment preview"
                  className="w-12 h-12 rounded-lg object-cover border border-emerald-500"
                />
                <div className="text-left">
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white block">
                    Attached Image
                  </span>
                  <input
                    type="text"
                    placeholder="Add a caption..."
                    value={attachedImageCaption}
                    onChange={(e) => setAttachedImageCaption(e.target.value)}
                    className="text-xs font-mono bg-transparent border-b border-slate-300 dark:border-slate-600 focus:outline-none focus:border-emerald-500 text-slate-700 dark:text-slate-300"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  setAttachedImage(null);
                  setAttachedImageCaption('');
                }}
                className="p-1 rounded-full text-slate-400 hover:text-rose-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Input Box Bar */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Attachment Actions */}
              <div className="flex items-center gap-1">
                {/* Image attach button */}
                <button
                  type="button"
                  onClick={() => {
                    playTechClick(750);
                    setAttachedImage(ASSET_IMAGES.chatArchDiagram);
                    setAttachedImageCaption('L1/L2 Cacheline Isolation Architecture');
                  }}
                  className="p-2 rounded-xl text-slate-500 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Attach Architecture Diagram"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>

                {/* Code block attach button */}
                <button
                  type="button"
                  onClick={() => {
                    playTechClick(750);
                    setShowCodeSnippetModal(true);
                  }}
                  className="p-2 rounded-xl text-slate-500 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Attach Code Snippet"
                >
                  <Code2 className="w-4 h-4" />
                </button>
              </div>

              {/* Text Input */}
              <input
                type="text"
                placeholder={
                  activeConversation.type === 'dm'
                    ? `Message ${activeConversation.participant?.name}...`
                    : `Message #${activeConversation.channelName}...`
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim() && !attachedImage}
                className={`p-2.5 rounded-xl font-bold transition-all shadow-md ${
                  inputText.trim() || attachedImage
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 active:scale-95'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
                title="Send Message"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          </div>

        </div>
      ) : (
        <div className="flex-1 hidden md:flex items-center justify-center p-8 text-center text-slate-400 bg-white dark:bg-slate-900/60">
          <div className="space-y-3 max-w-sm">
            <Radio className="w-12 h-12 mx-auto text-emerald-500/50" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Select a Conversation
            </h3>
            <p className="text-xs text-slate-500">
              Direct message fellow programmers, review code snippets, or jump into sprint rooms.
            </p>
          </div>
        </div>
      )}

      {/* Code Snippet Attachment Modal */}
      {showCodeSnippetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Attach Code Snippet</h3>
              </div>
              <button
                onClick={() => setShowCodeSnippetModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  Language
                </label>
                <select
                  value={codeModalLang}
                  onChange={(e) => setCodeModalLang(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="rust">Rust</option>
                  <option value="c">C / eBPF</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="wgsl">WebGPU / WGSL</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  Filename
                </label>
                <input
                  type="text"
                  value={codeModalFilename}
                  onChange={(e) => setCodeModalFilename(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                Source Code
              </label>
              <textarea
                rows={6}
                value={codeModalContent}
                onChange={(e) => setCodeModalContent(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCodeSnippetModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCodeSnippet}
                className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold"
              >
                Insert Snippet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Chat Contact Picker Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Direct Message Developer</h3>
              </div>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Select a developer from your sprint team or discovery network:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {conversations
                .filter(c => c.type === 'dm' && c.participant)
                .map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      playTechClick(800);
                      setSelectedConvId(c.id);
                      setShowNewChatModal(false);
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-800 flex items-center gap-3 cursor-pointer transition-colors"
                  >
                    <img
                      src={c.participant?.avatar}
                      alt={c.participant?.name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-white block truncate">
                        {c.participant?.name}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">
                        @{c.participant?.handle}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      Chat →
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
