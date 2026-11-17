import React, { useMemo, useState, useEffect } from 'react';
import { Calendar, Layers, ChevronDown, ChevronUp, X, ArrowUpRight } from 'lucide-react';
import { Project } from '../types';
import { playTechClick } from '../utils/audio';

interface RepositoryContributionHeatmapProps {
  projects: Project[];
  activeRepoFilter?: string | null;
  onSelectRepoForFeed?: (repoName: string | null) => void;
}

type HeatmapMode = 'calendar' | 'matrix';
type MetricSource = 'all' | 'commits' | 'prs';

interface RepoDayBreakdown {
  projectId: string;
  repoName: string;
  shortName: string;
  language: string;
  commits: number;
  prs: number;
  reviews: number;
  total: number;
}

interface DayCell {
  dateIso: string;
  displayDate: string;
  weekday: number; // 0 = Sun, 1 = Mon ... 6 = Sat
  weekIndex: number;
  monthLabel: string;
  isFirstOfMonth: boolean;
  totalCommits: number;
  totalPrs: number;
  totalReviews: number;
  totalCount: number;
  level: 0 | 1 | 2 | 3 | 4;
  repos: RepoDayBreakdown[];
}

// Deterministic pseudo-random helper seeded by string so activity patterns remain stable per repo & date
function hashSeed(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

function getIntensityLevel(count: number, maxThreshold: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  const ratio = count / Math.max(maxThreshold, 1);
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.52) return 2;
  if (ratio <= 0.78) return 3;
  return 4;
}

const LEVEL_COLORS: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: 'bg-slate-100 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/40',
  1: 'bg-emerald-200 dark:bg-emerald-950 border-emerald-300/70 dark:border-emerald-800/70',
  2: 'bg-emerald-400 dark:bg-emerald-700 border-emerald-500/50 dark:border-emerald-600/70',
  3: 'bg-emerald-500 dark:bg-emerald-500 border-emerald-600/50 dark:border-emerald-400/70',
  4: 'bg-emerald-700 dark:bg-emerald-300 border-emerald-800/60 dark:border-emerald-200/80'
};

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const RepositoryContributionHeatmap: React.FC<RepositoryContributionHeatmapProps> = ({
  projects,
  activeRepoFilter = null,
  onSelectRepoForFeed
}) => {
  const [viewMode, setViewMode] = useState<HeatmapMode>('calendar');
  const [metricSource, setMetricSource] = useState<MetricSource>('all');
  const [selectedRepoId, setSelectedRepoId] = useState<string>('all');
  const [highlightedLevel, setHighlightedLevel] = useState<number | null>(null);
  const [inspectedDay, setInspectedDay] = useState<DayCell | null>(null);
  const [inspectedMatrixCell, setInspectedMatrixCell] = useState<{
    repoName: string;
    shortName: string;
    dateLabel: string;
    count: number;
    commits: number;
    prs: number;
  } | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Sync external activeRepoFilter if user searches or resets filters in parent
  useEffect(() => {
    if (!activeRepoFilter) {
      setSelectedRepoId('all');
      return;
    }
    const matched = projects.find(p => p.repoName.toLowerCase() === activeRepoFilter.toLowerCase());
    if (matched) {
      setSelectedRepoId(matched.id);
    }
  }, [activeRepoFilter, projects]);

  const effectiveSelectedRepoId = selectedRepoId;

  // Build 18 weeks (126 days) ending on latest project activity or reference date
  const weeksCount = 18;

  const calendarData = useMemo(() => {
    // Anchor end date to latest lastActiveAt or Nov 17, 2026
    const anchorDate = new Date('2026-11-17T12:00:00Z');
    // Align grid so the last column ends on anchorDate's week (or Saturday of anchor week)
    const endDayOfWeek = anchorDate.getUTCDay();
    const totalDays = (weeksCount - 1) * 7 + (endDayOfWeek + 1);

    const startDate = new Date(anchorDate);
    startDate.setUTCDate(anchorDate.getUTCDate() - (totalDays - 1));

    const rawDays: Omit<DayCell, 'level'>[] = [];

    for (let i = 0; i < totalDays; i++) {
      const current = new Date(startDate);
      current.setUTCDate(startDate.getUTCDate() + i);
      const iso = current.toISOString().slice(0, 10);
      const weekday = current.getUTCDay();
      const weekIndex = Math.floor(i / 7);
      const monthIdx = current.getUTCMonth();
      const dayOfMonth = current.getUTCDate();
      const monthLabel = MONTH_NAMES[monthIdx];
      const displayDate = `${monthLabel} ${dayOfMonth}, ${current.getUTCFullYear()}`;

      // Recency boost: last 30 days slightly warmer
      const recencyRatio = i / totalDays;
      const weekdayBoost = weekday === 0 || weekday === 6 ? 0.55 : 1.15;

      const repoBreakdowns: RepoDayBreakdown[] = projects.map((proj) => {
        const seed1 = hashSeed(`${proj.id}:${iso}:c`);
        const seed2 = hashSeed(`${proj.id}:${iso}:p`);
        const seed3 = hashSeed(`${proj.id}:${iso}:r`);

        // Weight by project stage & popularity
        const stageWeight =
          proj.stage === 'seeking contributors' ? 1.35 :
          proj.stage === 'in progress' ? 1.2 : 0.65;
        const popWeight = Math.min(1.6, 0.7 + proj.stars / 4500);

        const activityChance = (0.38 + recencyRatio * 0.34) * weekdayBoost * (stageWeight * 0.78);
        const isActiveDay = seed1 < Math.min(0.92, activityChance);

        const commits = isActiveDay ? Math.max(1, Math.floor(seed1 * 6 * stageWeight * popWeight)) : 0;
        const prs = isActiveDay && seed2 > 0.58 ? Math.max(1, Math.floor(seed2 * 3 * (proj.activePRs > 0 ? 1.3 : 0.7))) : 0;
        const reviews = isActiveDay && seed3 > 0.52 ? Math.floor(seed3 * 4) : 0;

        const shortName = proj.repoName.includes('/') ? proj.repoName.split('/')[1] : proj.repoName;
        return {
          projectId: proj.id,
          repoName: proj.repoName,
          shortName,
          language: proj.language,
          commits,
          prs,
          reviews,
          total: commits + prs + reviews
        };
      });

      const activeReposForCalc = effectiveSelectedRepoId === 'all'
        ? repoBreakdowns
        : repoBreakdowns.filter(r => r.projectId === effectiveSelectedRepoId);

      const totalCommits = activeReposForCalc.reduce((s, r) => s + r.commits, 0);
      const totalPrs = activeReposForCalc.reduce((s, r) => s + r.prs, 0);
      const totalReviews = activeReposForCalc.reduce((s, r) => s + r.reviews, 0);

      const totalCount =
        metricSource === 'commits' ? totalCommits :
        metricSource === 'prs' ? totalPrs + totalReviews :
        totalCommits + totalPrs + totalReviews;

      rawDays.push({
        dateIso: iso,
        displayDate,
        weekday,
        weekIndex,
        monthLabel,
        isFirstOfMonth: dayOfMonth <= 7 && weekday === 0,
        totalCommits,
        totalPrs,
        totalReviews,
        totalCount,
        repos: repoBreakdowns
      });
    }

    const maxDaily = rawDays.reduce((max, d) => Math.max(max, d.totalCount), 0);
    const scaleCap = effectiveSelectedRepoId === 'all' ? Math.max(16, maxDaily) : Math.max(6, maxDaily);

    const daysWithLevels: DayCell[] = rawDays.map(d => ({
      ...d,
      level: getIntensityLevel(d.totalCount, scaleCap)
    }));

    // Group into columns by weekIndex
    const weeks: (DayCell | null)[][] = Array.from({ length: weeksCount }, () => Array(7).fill(null));
    daysWithLevels.forEach(d => {
      if (d.weekIndex < weeksCount) {
        weeks[d.weekIndex][d.weekday] = d;
      }
    });

    // Determine month header labels per week column
    const weekMonthHeaders: string[] = weeks.map((week, idx) => {
      const firstValidDay = week.find(Boolean);
      if (!firstValidDay) return '';
      if (idx === 0) return firstValidDay.monthLabel;
      const prevWeekFirst = weeks[idx - 1].find(Boolean);
      if (prevWeekFirst && prevWeekFirst.monthLabel !== firstValidDay.monthLabel) {
        return firstValidDay.monthLabel;
      }
      return '';
    });

    // Calculate summary stats
    const totalEvents = daysWithLevels.reduce((s, d) => s + d.totalCount, 0);
    const peakDay = daysWithLevels.reduce((best, d) => (d.totalCount > best.totalCount ? d : best), daysWithLevels[0]);
    let currentStreak = 0;
    for (let idx = daysWithLevels.length - 1; idx >= 0; idx--) {
      if (daysWithLevels[idx].totalCount > 0) currentStreak++;
      else break;
    }

    return {
      days: daysWithLevels,
      weeks,
      weekMonthHeaders,
      totalEvents,
      peakDay,
      currentStreak
    };
  }, [projects, effectiveSelectedRepoId, metricSource, weeksCount]);

  // Matrix rows: Each project across the last 21 days (3 weeks) for crisp side-by-side repository comparison
  const matrixData = useMemo(() => {
    const recentDaysCount = 21;
    const recentDays = calendarData.days.slice(-recentDaysCount);

    const rows = projects.map((proj) => {
      const shortName = proj.repoName.includes('/') ? proj.repoName.split('/')[1] : proj.repoName;
      const cells = recentDays.map((day) => {
        const entry = day.repos.find(r => r.projectId === proj.id);
        const commits = entry?.commits || 0;
        const prs = (entry?.prs || 0) + (entry?.reviews || 0);
        const count =
          metricSource === 'commits' ? commits :
          metricSource === 'prs' ? prs :
          (entry?.total || 0);
        return {
          dateIso: day.dateIso,
          displayDate: day.displayDate,
          commits,
          prs,
          count,
          level: getIntensityLevel(count, 8)
        };
      });

      const totalRepoEvents = cells.reduce((s, c) => s + c.count, 0);
      return {
        project: proj,
        shortName,
        cells,
        totalRepoEvents
      };
    });

    return {
      recentDays,
      rows
    };
  }, [calendarData.days, projects, metricSource]);

  const activeDayToShow = inspectedDay || calendarData.peakDay;

  const handleSelectRepoFilter = (repoId: string) => {
    playTechClick(750);
    setSelectedRepoId(repoId);
    if (onSelectRepoForFeed) {
      if (repoId === 'all') {
        onSelectRepoForFeed(null);
      } else {
        const proj = projects.find(p => p.id === repoId);
        if (proj) {
          onSelectRepoForFeed(proj.repoName);
        }
      }
    }
  };

  return (
    <section
      aria-label="Repository Activity Heatmap"
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm p-4 space-y-3.5 text-left"
    >
      {/* Top Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
              Repository Activity Heatmap
            </h3>
            <button
              type="button"
              onClick={() => {
                playTechClick(700);
                setIsCollapsed(prev => !prev);
              }}
              aria-expanded={!isCollapsed}
              aria-label={isCollapsed ? 'Expand contribution heatmap' : 'Collapse contribution heatmap'}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums mt-0.5 truncate">
            {calendarData.totalEvents.toLocaleString()} events in {weeksCount}w
            <span className="mx-1.5 text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
            {projects.length} repositories
            <span className="mx-1.5 text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
            Peak {calendarData.peakDay?.totalCount || 0}/day
            <span className="mx-1.5 text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
            {calendarData.currentStreak}d active streak
          </p>
        </div>

        {/* Mode & Metric Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Calendar vs Repo Matrix toggle */}
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-200/70 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                playTechClick(800);
                setViewMode('calendar');
                setIsCollapsed(false);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
              <span>Calendar</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playTechClick(800);
                setViewMode('matrix');
                setIsCollapsed(false);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                viewMode === 'matrix'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-500" />
              <span>Repo Matrix</span>
            </button>
          </div>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* Filter Strip: Repository Scope & Event Type */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2 min-w-0">
              <label htmlFor="heatmap-repo-select" className="text-[11px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
                Repository:
              </label>
              <select
                id="heatmap-repo-select"
                value={effectiveSelectedRepoId}
                onChange={(e) => handleSelectRepoFilter(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 truncate max-w-[220px]"
              >
                <option value="all">All Repositories ({projects.length})</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.repoName}
                  </option>
                ))}
              </select>
              {effectiveSelectedRepoId !== 'all' && (
                <button
                  type="button"
                  onClick={() => handleSelectRepoFilter('all')}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-md"
                  title="Clear repository filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Metric Source Segmented Control */}
            <div className="flex items-center gap-1 self-start sm:self-auto">
              {([
                { id: 'all', label: 'All Events' },
                { id: 'commits', label: 'Commits' },
                { id: 'prs', label: 'PRs & Reviews' }
              ] as { id: MetricSource; label: string }[]).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    playTechClick(750);
                    setMetricSource(opt.id);
                  }}
                  className={`px-2 py-1 rounded-md text-[11px] font-mono transition-colors whitespace-nowrap shrink-0 ${
                    metricSource === opt.id
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* VIEW 1: Classic GitHub-style Calendar Grid */}
          {viewMode === 'calendar' && (
            <div className="space-y-2.5">
              <div className="overflow-x-auto pb-1 no-scrollbar">
                <div className="inline-block min-w-full">
                  {/* Month Labels Row */}
                  <div className="flex items-center mb-1 pl-8">
                    <div className="grid gap-[3px] flex-1" style={{ gridTemplateColumns: `repeat(${weeksCount}, minmax(12px, 1fr))` }}>
                      {calendarData.weekMonthHeaders.map((month, wIdx) => (
                        <div key={`m-${wIdx}`} className="text-[10px] font-mono text-slate-400 dark:text-slate-500 leading-none h-3">
                          {month}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weekday Labels + 7x18 Grid */}
                  <div className="flex items-stretch gap-1.5">
                    {/* Weekday column */}
                    <div className="grid grid-rows-7 gap-[3px] w-6 shrink-0 text-[10px] font-mono text-slate-400 dark:text-slate-500 select-none">
                      {WEEKDAY_LABELS.map((day, idx) => (
                        <div key={day} className="flex items-center justify-end pr-0.5 leading-none">
                          {idx === 1 || idx === 3 || idx === 5 ? day : ''}
                        </div>
                      ))}
                    </div>

                    {/* Columns of weeks */}
                    <div
                      className="grid gap-[3px] flex-1"
                      style={{ gridTemplateColumns: `repeat(${weeksCount}, minmax(12px, 1fr))` }}
                    >
                      {calendarData.weeks.map((week, wIdx) => (
                        <div key={`w-${wIdx}`} className="grid grid-rows-7 gap-[3px]">
                          {week.map((cell, dIdx) => {
                            if (!cell) {
                              return <div key={`empty-${wIdx}-${dIdx}`} className="aspect-square rounded-[3px] opacity-0 pointer-events-none" />;
                            }
                            const isInspected = inspectedDay?.dateIso === cell.dateIso;
                            const isDimmed = highlightedLevel !== null && cell.level !== highlightedLevel;

                            return (
                              <button
                                key={cell.dateIso}
                                type="button"
                                onMouseEnter={() => setInspectedDay(cell)}
                                onFocus={() => setInspectedDay(cell)}
                                onClick={() => {
                                  playTechClick(820);
                                  setInspectedDay(cell);
                                }}
                                aria-label={`${cell.displayDate}: ${cell.totalCount} events`}
                                title={`${cell.displayDate}: ${cell.totalCount} events`}
                                className={`aspect-square w-full min-w-[11px] rounded-[3px] border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                                  LEVEL_COLORS[cell.level]
                                } ${
                                  isInspected ? 'ring-2 ring-slate-900 dark:ring-white scale-110 z-10' : 'hover:scale-110'
                                } ${
                                  isDimmed ? 'opacity-25' : 'opacity-100'
                                }`}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Inspector Strip for Active/Hovered Day */}
              {activeDayToShow && (
                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {activeDayToShow.displayDate}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">
                      {activeDayToShow.totalCount} events
                    </span>
                    <span className="text-slate-400 text-[11px] tabular-nums">
                      ({activeDayToShow.totalCommits} commits, {activeDayToShow.totalPrs} PRs, {activeDayToShow.totalReviews} reviews)
                    </span>
                  </div>

                  {/* Per-repository breakdown on that day */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {activeDayToShow.repos
                      .filter(r => r.total > 0)
                      .sort((a, b) => b.total - a.total)
                      .slice(0, 3)
                      .map((r) => (
                        <button
                          key={r.projectId}
                          type="button"
                          onClick={() => handleSelectRepoFilter(r.projectId)}
                          className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 tabular-nums"
                          title={`Filter heatmap & feed to ${r.repoName}`}
                        >
                          <span>{r.shortName}:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{r.total}</span>
                        </button>
                      ))}
                    {activeDayToShow.repos.every(r => r.total === 0) && (
                      <span>No repository activity logged</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: Per-Repository Comparison Matrix (Repos × Last 21 Days) */}
          {viewMode === 'matrix' && (
            <div className="space-y-2.5">
              <div className="overflow-x-auto pb-1 no-scrollbar">
                <div className="min-w-[460px] space-y-1.5">
                  {/* Column header dates */}
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 dark:text-slate-500 pb-1">
                    <div className="w-32 sm:w-36 shrink-0">Repository</div>
                    <div className="flex-1 flex items-center justify-between">
                      <span>{matrixData.recentDays[0]?.displayDate.replace(', 2026', '')}</span>
                      <span>Last 21 Days Intensity</span>
                      <span>{matrixData.recentDays[matrixData.recentDays.length - 1]?.displayDate.replace(', 2026', '')}</span>
                    </div>
                    <div className="w-12 text-right shrink-0">Total</div>
                  </div>

                  {/* Repo Rows */}
                  {matrixData.rows.map((row) => {
                    const isRepoSelected = effectiveSelectedRepoId === row.project.id;
                    return (
                      <div
                        key={row.project.id}
                        className={`flex items-center gap-2 py-1 px-1.5 rounded-lg transition-colors ${
                          isRepoSelected
                            ? 'bg-emerald-500/10'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        {/* Repo Identifier Button */}
                        <button
                          type="button"
                          onClick={() => handleSelectRepoFilter(isRepoSelected ? 'all' : row.project.id)}
                          className="w-32 sm:w-36 shrink-0 text-left group flex items-center justify-between gap-1 pr-1"
                          title={`Filter discovery feed by ${row.project.repoName}`}
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-mono font-medium text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate">
                              {row.shortName}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400 truncate">
                              {row.project.language}
                            </div>
                          </div>
                          <ArrowUpRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity" />
                        </button>

                        {/* 21-day intensity cells */}
                        <div
                          className="flex-1 grid gap-[3px]"
                          style={{ gridTemplateColumns: 'repeat(21, minmax(12px, 1fr))' }}
                        >
                          {row.cells.map((cell) => {
                            const isDimmed = highlightedLevel !== null && cell.level !== highlightedLevel;
                            const isSelectedCell =
                              inspectedMatrixCell?.shortName === row.shortName &&
                              inspectedMatrixCell?.dateLabel === cell.displayDate;

                            return (
                              <button
                                key={`${row.project.id}-${cell.dateIso}`}
                                type="button"
                                onMouseEnter={() =>
                                  setInspectedMatrixCell({
                                    repoName: row.project.repoName,
                                    shortName: row.shortName,
                                    dateLabel: cell.displayDate,
                                    count: cell.count,
                                    commits: cell.commits,
                                    prs: cell.prs
                                  })
                                }
                                onClick={() => {
                                  playTechClick(820);
                                  setInspectedMatrixCell({
                                    repoName: row.project.repoName,
                                    shortName: row.shortName,
                                    dateLabel: cell.displayDate,
                                    count: cell.count,
                                    commits: cell.commits,
                                    prs: cell.prs
                                  });
                                }}
                                aria-label={`${row.shortName} on ${cell.displayDate}: ${cell.count} events`}
                                title={`${row.shortName} · ${cell.displayDate}: ${cell.count} events`}
                                className={`aspect-square w-full rounded-[3px] border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                                  LEVEL_COLORS[cell.level]
                                } ${
                                  isSelectedCell ? 'ring-2 ring-slate-900 dark:ring-white scale-110 z-10' : 'hover:scale-110'
                                } ${
                                  isDimmed ? 'opacity-25' : 'opacity-100'
                                }`}
                              />
                            );
                          })}
                        </div>

                        {/* Total Events Count */}
                        <div className="w-12 text-right shrink-0 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                          {row.totalRepoEvents}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Matrix Cell Inspector */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                {inspectedMatrixCell ? (
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {inspectedMatrixCell.repoName}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{inspectedMatrixCell.dateLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">
                      {inspectedMatrixCell.count} events ({inspectedMatrixCell.commits} commits, {inspectedMatrixCell.prs} PRs/reviews)
                    </span>
                  </div>
                ) : (
                  <span>Hover or select any repository cell to inspect daily commits and PR velocity.</span>
                )}
              </div>
            </div>
          )}

          {/* Color Scale Legend Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <span>
              Click a cell or repository to inspect &amp; filter discovery feed
            </span>

            <div className="flex items-center gap-1.5 select-none">
              <span>Less</span>
              {([0, 1, 2, 3, 4] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onMouseEnter={() => setHighlightedLevel(lvl)}
                  onMouseLeave={() => setHighlightedLevel(null)}
                  onClick={() => {
                    playTechClick(780);
                    setHighlightedLevel(prev => (prev === lvl ? null : lvl));
                  }}
                  aria-label={`Highlight intensity level ${lvl}`}
                  title={
                    lvl === 0 ? '0 events' :
                    lvl === 1 ? 'Low activity' :
                    lvl === 2 ? 'Moderate activity' :
                    lvl === 3 ? 'High activity' : 'Peak intensity'
                  }
                  className={`w-3 h-3 rounded-[3px] border transition-transform ${
                    LEVEL_COLORS[lvl]
                  } ${
                    highlightedLevel === lvl ? 'ring-2 ring-slate-900 dark:ring-white scale-125' : 'hover:scale-110'
                  }`}
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </>
      )}
    </section>
  );
};
