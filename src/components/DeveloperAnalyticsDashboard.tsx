import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  ComposedChart
} from 'recharts';
import {
  GitCommit as GitCommitIcon,
  GitPullRequest,
  Flame,
  Code2,
  Trophy,
  Calendar,
  Layers,
  Sparkles,
  Download,
  CheckCircle2,
  TrendingUp,
  Activity,
  Terminal,
  Filter
} from 'lucide-react';
import { User, Sprint, GitCommit, PullRequest } from '../types';
import { playTechClick, playSuccessChime } from '../utils/audio';

interface DeveloperAnalyticsDashboardProps {
  user: User;
  sprints?: Sprint[];
  commits?: GitCommit[];
  pullRequests?: PullRequest[];
  onExportReport?: () => void;
}

type TimeRange = '30d' | '90d' | '1y';
type ActivityFilter = 'all' | 'commits' | 'prs';

// Language breakdown data
interface LanguageStat {
  name: string;
  share: number; // percentage
  loc: number; // lines of code
  color: string;
  reposCount: number;
}

const LANGUAGE_DATA: LanguageStat[] = [
  { name: 'Rust', share: 44, loc: 142800, color: '#f97316', reposCount: 9 },
  { name: 'TypeScript', share: 26, loc: 84300, color: '#3b82f6', reposCount: 14 },
  { name: 'Go', share: 14, loc: 45400, color: '#06b6d4', reposCount: 5 },
  { name: 'C++', share: 8, loc: 25900, color: '#a855f7', reposCount: 4 },
  { name: 'WebAssembly', share: 5, loc: 16200, color: '#10b981', reposCount: 3 },
  { name: 'Python', share: 3, loc: 9700, color: '#eab308', reposCount: 6 }
];

export const DeveloperAnalyticsDashboard: React.FC<DeveloperAnalyticsDashboardProps> = ({
  user,
  sprints = [],
  commits = [],
  pullRequests = []
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('90d');
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Time-series contribution data for 30d, 90d, 1y
  const contributionData = useMemo(() => {
    if (timeRange === '30d') {
      // Last 30 days (sampled daily intervals)
      return [
        { date: 'Day 1', commits: 4, prs: 1, reviews: 2, total: 7 },
        { date: 'Day 3', commits: 6, prs: 2, reviews: 1, total: 9 },
        { date: 'Day 6', commits: 2, prs: 0, reviews: 3, total: 5 },
        { date: 'Day 9', commits: 8, prs: 3, reviews: 2, total: 13 },
        { date: 'Day 12', commits: 5, prs: 1, reviews: 1, total: 7 },
        { date: 'Day 15', commits: 11, prs: 4, reviews: 4, total: 19 },
        { date: 'Day 18', commits: 7, prs: 2, reviews: 2, total: 11 },
        { date: 'Day 21', commits: 9, prs: 2, reviews: 3, total: 14 },
        { date: 'Day 24', commits: 14, prs: 5, reviews: 4, total: 23 },
        { date: 'Day 27', commits: 8, prs: 3, reviews: 2, total: 13 },
        { date: 'Day 30', commits: 12, prs: 4, reviews: 5, total: 21 }
      ];
    } else if (timeRange === '90d') {
      // 12 Weeks breakdown
      return [
        { date: 'W01', commits: 28, prs: 8, reviews: 12, total: 48 },
        { date: 'W02', commits: 34, prs: 11, reviews: 15, total: 60 },
        { date: 'W03', commits: 22, prs: 7, reviews: 9, total: 38 },
        { date: 'W04', commits: 41, prs: 14, reviews: 18, total: 73 },
        { date: 'W05', commits: 38, prs: 12, reviews: 16, total: 66 },
        { date: 'W06', commits: 45, prs: 15, reviews: 20, total: 80 },
        { date: 'W07', commits: 31, prs: 9, reviews: 14, total: 54 },
        { date: 'W08', commits: 52, prs: 18, reviews: 24, total: 94 },
        { date: 'W09', commits: 48, prs: 16, reviews: 19, total: 83 },
        { date: 'W10', commits: 39, prs: 13, reviews: 17, total: 69 },
        { date: 'W11', commits: 58, prs: 20, reviews: 26, total: 104 },
        { date: 'W12', commits: 64, prs: 22, reviews: 28, total: 114 }
      ];
    } else {
      // 12 Months
      return [
        { date: 'Nov', commits: 142, prs: 44, reviews: 62, total: 248 },
        { date: 'Dec', commits: 118, prs: 36, reviews: 48, total: 202 },
        { date: 'Jan', commits: 165, prs: 52, reviews: 71, total: 288 },
        { date: 'Feb', commits: 188, prs: 59, reviews: 83, total: 330 },
        { date: 'Mar', commits: 210, prs: 68, reviews: 95, total: 373 },
        { date: 'Apr', commits: 194, prs: 61, reviews: 88, total: 343 },
        { date: 'May', commits: 225, prs: 74, reviews: 102, total: 401 },
        { date: 'Jun', commits: 208, prs: 67, reviews: 94, total: 369 },
        { date: 'Jul', commits: 240, prs: 82, reviews: 110, total: 432 },
        { date: 'Aug', commits: 265, prs: 89, reviews: 124, total: 478 },
        { date: 'Sep', commits: 252, prs: 85, reviews: 118, total: 455 },
        { date: 'Oct', commits: 278, prs: 94, reviews: 132, total: 504 }
      ];
    }
  }, [timeRange]);

  // Aggregate metrics for summary cards
  const metricsSummary = useMemo(() => {
    const totalCommitsInPeriod = contributionData.reduce((acc, curr) => acc + curr.commits, 0);
    const totalPrsInPeriod = contributionData.reduce((acc, curr) => acc + curr.prs, 0);
    const totalReviewsInPeriod = contributionData.reduce((acc, curr) => acc + curr.reviews, 0);
    const totalContributions = totalCommitsInPeriod + totalPrsInPeriod + totalReviewsInPeriod;

    return {
      totalCommits: totalCommitsInPeriod,
      totalPrs: totalPrsInPeriod,
      totalReviews: totalReviewsInPeriod,
      totalContributions,
      currentStreak: 28,
      longestStreak: 74,
      avgPrVelocityHours: '3.4h',
      codeReviewCoverage: '98.2%'
    };
  }, [contributionData]);

  // Sprint participation and velocity history data
  const sprintParticipationData = useMemo(() => {
    return [
      {
        cycle: 'S-14',
        name: 'SPSC Ring Buffer',
        milestonesTotal: 5,
        milestonesDone: 5,
        velocityPoints: 34,
        efficiencyPct: 100
      },
      {
        cycle: 'S-15',
        name: 'Async IO Runtime',
        milestonesTotal: 6,
        milestonesDone: 6,
        velocityPoints: 42,
        efficiencyPct: 100
      },
      {
        cycle: 'S-16',
        name: 'ZeroCopy Memory',
        milestonesTotal: 7,
        milestonesDone: 6,
        velocityPoints: 48,
        efficiencyPct: 86
      },
      {
        cycle: 'S-17',
        name: 'SIMD Parser Core',
        milestonesTotal: 8,
        milestonesDone: 8,
        velocityPoints: 55,
        efficiencyPct: 100
      },
      {
        cycle: 'S-18',
        name: 'WebGPU Pipeline',
        milestonesTotal: 9,
        milestonesDone: 8,
        velocityPoints: 58,
        efficiencyPct: 89
      },
      {
        cycle: 'S-19',
        name: 'Microkernel IPC',
        milestonesTotal: 10,
        milestonesDone: 10,
        velocityPoints: 64,
        efficiencyPct: 100
      },
      {
        cycle: 'S-20',
        name: 'Kernel Scheduler',
        milestonesTotal: 8,
        milestonesDone: 7,
        velocityPoints: 52,
        efficiencyPct: 88
      }
    ];
  }, []);

  const handleSimulateGitSync = () => {
    playTechClick(850);
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      playSuccessChime();
      setCopiedNotification('Git metrics synced with active branches & local commits!');
      setTimeout(() => setCopiedNotification(null), 3000);
    }, 700);
  };

  const handleExportMetrics = () => {
    playSuccessChime();
    const exportPayload = {
      developer: user.name,
      handle: user.handle,
      generatedAt: new Date().toISOString(),
      summary: metricsSummary,
      languages: LANGUAGE_DATA,
      sprintVelocityHistory: sprintParticipationData
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kernelpulse_metrics_${user.handle}_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setCopiedNotification('Exported Developer Telemetry JSON report!');
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  // Custom sleek tooltip for Recharts
  const CustomContributionTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2.5 rounded-xl bg-slate-950/95 border border-slate-700/80 shadow-2xl text-xs font-mono text-left space-y-1.5 z-50">
          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 flex items-center justify-between gap-4">
            <span>Period: {label}</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              VERIFIED
            </span>
          </div>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-bold text-white tabular-nums">
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomSprintTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = sprintParticipationData.find(s => s.cycle === label);
      return (
        <div className="p-2.5 rounded-xl bg-slate-950/95 border border-slate-700/80 shadow-2xl text-xs font-mono text-left space-y-1.5 z-50">
          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1">
            <span className="text-emerald-400">{label}</span>: {dataPoint?.name || 'Sprint Cycle'}
          </div>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-bold text-white tabular-nums">
                {entry.value}
              </span>
            </div>
          ))}
          {dataPoint && (
            <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-1 flex justify-between">
              <span>Delivery Efficiency:</span>
              <span className="text-emerald-400 font-bold">{dataPoint.efficiencyPct}%</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4 text-left">
      
      {/* Toast Notification */}
      {copiedNotification && (
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono flex items-center justify-between gap-2 animate-in fade-in">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{copiedNotification}</span>
          </span>
          <button
            onClick={() => setCopiedNotification(null)}
            className="text-[10px] hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-bold font-mono tracking-wide text-slate-900 dark:text-white uppercase">
              Developer Telemetry &amp; Velocity
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
            Quantitative analysis of commits, multi-language codebase volume, and sprint milestones.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Time range switcher */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200/70 dark:border-slate-800">
            {(['30d', '90d', '1y'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => {
                  playTechClick(800);
                  setTimeRange(range);
                }}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition-colors uppercase ${
                  timeRange === range
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Sync Button */}
          <button
            onClick={handleSimulateGitSync}
            disabled={isSyncing}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono transition-colors flex items-center gap-1 border border-slate-200 dark:border-slate-700"
            title="Sync metrics with active git node"
          >
            <TrendingUp className={`w-3.5 h-3.5 text-emerald-500 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>

          {/* Export Button */}
          <button
            onClick={handleExportMetrics}
            className="p-1.5 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono transition-colors flex items-center gap-1 border border-slate-200 dark:border-slate-700"
            title="Download JSON telemetry log"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* KPI Headline Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
            <span>Contributions</span>
            <GitCommitIcon className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {metricsSummary.totalContributions.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            {metricsSummary.totalCommits} commits · {metricsSummary.totalPrs} PRs
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
            <span>Active Streak</span>
            <Flame className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-500 tabular-nums">
            {metricsSummary.currentStreak} Days
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            Peak: {metricsSummary.longestStreak} days continuous
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
            <span>PR Velocity</span>
            <GitPullRequest className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-cyan-400 tabular-nums">
            {metricsSummary.avgPrVelocityHours}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            Median merge turnaround
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
            <span>Sprint Velocity</span>
            <Trophy className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-bold font-mono text-indigo-400 tabular-nums">
            {metricsSummary.codeReviewCoverage}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            On-time milestone delivery
          </div>
        </div>
      </div>

      {/* CHART 1: Contribution Frequency Time-Series */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 dark:text-white">
                Contribution Frequency Over Time
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Aggregated code commits, submitted PRs, and verified peer reviews.
            </p>
          </div>

          {/* Activity filter toggles */}
          <div className="flex items-center gap-1 text-[11px] font-mono self-start sm:self-auto">
            <span className="text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span className="hidden sm:inline">Filter:</span>
            </span>
            {(['all', 'commits', 'prs'] as ActivityFilter[]).map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  playTechClick(800);
                  setActivityFilter(filter);
                }}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  activityFilter === filter
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {filter === 'all' ? 'All Activity' : filter === 'commits' ? 'Commits' : 'PRs & Reviews'}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="w-full h-56 sm:h-64 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={contributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorPrs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.25} />
              <XAxis
                dataKey="date"
                tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                axisLine={{ stroke: '#475569', opacity: 0.4 }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                axisLine={{ stroke: '#475569', opacity: 0.4 }}
                tickLine={false}
              />
              <Tooltip content={<CustomContributionTooltip />} />
              
              {(activityFilter === 'all' || activityFilter === 'commits') && (
                <Area
                  type="monotone"
                  dataKey="commits"
                  name="Code Commits"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCommits)"
                />
              )}

              {(activityFilter === 'all' || activityFilter === 'prs') && (
                <Area
                  type="monotone"
                  dataKey="prs"
                  name="Pull Requests"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPrs)"
                />
              )}

              {activityFilter === 'all' && (
                <Area
                  type="monotone"
                  dataKey="reviews"
                  name="Peer Reviews"
                  stroke="#818cf8"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#colorReviews)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Commits</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <span>Pull Requests</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
              <span>Peer Reviews</span>
            </span>
          </div>
          <span className="text-[10px] text-slate-400">
            Cadence: {timeRange === '30d' ? 'Daily' : timeRange === '90d' ? 'Weekly' : 'Monthly'}
          </span>
        </div>
      </div>

      {/* TWO COLUMNS: Language Distribution & Sprint Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* CHART 2: Language Distribution Donut & Metrics (5 cols) */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-orange-500" />
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 dark:text-white">
                  Language Distribution
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                324.3k LOC Total
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Code volume across compiled systems and web runtimes.
            </p>
          </div>

          {/* Donut Chart */}
          <div className="w-full h-44 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={LANGUAGE_DATA}
                  dataKey="share"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  onClick={(entry: any) => {
                    playTechClick(850);
                    const targetName = entry?.name ? String(entry.name) : null;
                    setSelectedLanguage(prev => (prev === targetName ? null : targetName));
                  }}
                >
                  {LANGUAGE_DATA.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.color}
                      stroke={selectedLanguage === entry.name ? '#ffffff' : 'none'}
                      strokeWidth={2}
                      cursor="pointer"
                      opacity={selectedLanguage && selectedLanguage !== entry.name ? 0.4 : 1}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [`${value}% volume`, `${name}`]}
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    color: '#f8fafc'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Primary</span>
              <span className="text-sm font-bold font-mono text-orange-500">
                {selectedLanguage ? selectedLanguage : 'Rust (44%)'}
              </span>
            </div>
          </div>

          {/* Interactive Language breakdown table */}
          <div className="space-y-1.5 pt-1">
            {LANGUAGE_DATA.map((lang) => {
              const isSelected = selectedLanguage === lang.name;
              return (
                <div
                  key={lang.name}
                  onClick={() => {
                    playTechClick(800);
                    setSelectedLanguage(isSelected ? null : lang.name);
                  }}
                  className={`p-1.5 px-2.5 rounded-xl border text-xs font-mono transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-100 dark:bg-slate-800 border-slate-400 dark:border-slate-600 scale-[1.01]'
                      : 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-100 dark:border-slate-800/60 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: lang.color }} />
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {lang.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                    <span className="text-[11px] tabular-nums">
                      {(lang.loc / 1000).toFixed(1)}k LOC
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums w-8 text-right">
                      {lang.share}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 3: Sprint Participation Over Time (7 cols) */}
        <div className="lg:col-span-7 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 dark:text-white">
                  Sprint Participation &amp; Velocity
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                94.7% ON-TIME RATE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Completed milestones (bars) against earned story velocity points (line).
            </p>
          </div>

          {/* Recharts Composed Chart (Bar + Line) */}
          <div className="w-full h-56 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={sprintParticipationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.25} />
                <XAxis
                  dataKey="cycle"
                  tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                  axisLine={{ stroke: '#475569', opacity: 0.4 }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                  axisLine={{ stroke: '#475569', opacity: 0.4 }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: '#818cf8', fontSize: 10, fontFamily: 'monospace' }}
                  axisLine={{ stroke: '#818cf8', opacity: 0.4 }}
                  tickLine={false}
                />
                <Tooltip content={<CustomSprintTooltip />} />
                <Bar
                  yAxisId="left"
                  dataKey="milestonesDone"
                  name="Milestones Completed"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="velocityPoints"
                  name="Velocity Points"
                  stroke="#818cf8"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#818cf8' }}
                  activeDot={{ r: 6, fill: '#6366f1' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Sprint Highlights & Audit Trail */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Total Sprints Shipped:</span>
              </span>
              <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                {sprintParticipationData.length} completed cycles
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Cumulative Velocity:</span>
              </span>
              <span className="font-bold text-indigo-400 tabular-nums">
                {sprintParticipationData.reduce((acc, s) => acc + s.velocityPoints, 0)} story points
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
