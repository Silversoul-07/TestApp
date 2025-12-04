import React from 'react';

import {
  fetchMediaEntries,
  incrementProgress as incrementProgressDb,
  initializeDatabase,
  upsertMediaEntry,
} from '@/lib/db';
import type {
  LibrarySortOption,
  MediaEntry,
  MediaStats,
  MediaStatus,
  MediaType,
} from '@/lib/types/media';

interface MediaContextValue {
  loading: boolean;
  entries: MediaEntry[];
  stats: MediaStats;
  trendingByType: Record<string, MediaEntry[]>;
  continueWatching: MediaEntry[];
  recentlyUpdated: MediaEntry[];
  search: (query: string, options?: { mediaType?: MediaType | 'all'; status?: MediaStatus | 'all' }) => MediaEntry[];
  sortEntries: (entries: MediaEntry[], sort: LibrarySortOption) => MediaEntry[];
  getEntry: (id: string) => MediaEntry | undefined;
  incrementProgress: (id: string, delta?: number) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  updateStatus: (id: string, status: MediaStatus) => Promise<void>;
  saveEntry: (entry: MediaEntry) => Promise<void>;
  refresh: () => Promise<void>;
}

const MediaContext = React.createContext<MediaContextValue | null>(null);

export function MediaProvider({ children }: React.PropsWithChildren) {
  const [entries, setEntries] = React.useState<MediaEntry[]>([]);
  const [loading, setLoading] = React.useState(true);

  const hydrate = React.useCallback(async () => {
    setLoading(true);
    try {
      await initializeDatabase();
      const data = await fetchMediaEntries();
      setEntries(data);
    } catch (error) {
      console.error('Failed to hydrate media data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const stats = React.useMemo<MediaStats>(() => {
    const totalEntries = entries.length;
    const completed = entries.filter((entry) => entry.status === 'completed').length;
    const inProgress = entries.filter((entry) => entry.status === 'watching' || entry.status === 'reading').length;
    const rated = entries.filter((entry) => entry.rating && entry.rating > 0);

    const meanScore = rated.length
      ? rated.reduce((acc, entry) => acc + (entry.rating ?? 0), 0) / rated.length
      : 0;

    const episodesWatched = entries
      .filter((entry) => entry.unitLabel === 'episodes')
      .reduce((acc, entry) => acc + (entry.progressUnits ?? 0), 0);

    const chaptersRead = entries
      .filter((entry) => entry.unitLabel === 'chapters')
      .reduce((acc, entry) => acc + (entry.progressUnits ?? 0), 0);

    const daysWatched = Number((episodesWatched / 3).toFixed(1));

    return {
      totalEntries,
      completed,
      inProgress,
      meanScore: Number(meanScore.toFixed(2)),
      episodesWatched,
      chaptersRead,
      daysWatched,
    };
  }, [entries]);

  const trendingByType = React.useMemo<Record<string, MediaEntry[]>>(() => {
    return entries.reduce<Record<string, MediaEntry[]>>((acc, entry) => {
      const key = entry.mediaType;
      if (!acc[key]) acc[key] = [];
      acc[key].push(entry);
      acc[key] = acc[key]
        .sort((a, b) => (a.trendingRank ?? Infinity) - (b.trendingRank ?? Infinity))
        .slice(0, 6);
      return acc;
    }, {});
  }, [entries]);

  const continueWatching = React.useMemo(() => {
    return entries
      .filter((entry) => (entry.totalUnits ?? 0) > (entry.progressUnits ?? 0))
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
      .slice(0, 8);
  }, [entries]);

  const recentlyUpdated = React.useMemo(() => {
    return [...entries].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)).slice(0, 8);
  }, [entries]);

  const search = React.useCallback(
    (query: string, options?: { mediaType?: MediaType | 'all'; status?: MediaStatus | 'all' }) => {
      const normalized = query.trim().toLowerCase();
      return entries.filter((entry) => {
        const matchesQuery = normalized
          ? entry.title.toLowerCase().includes(normalized) ||
            (entry.alternateTitle?.toLowerCase().includes(normalized) ?? false)
          : true;
        const matchesType = options?.mediaType && options.mediaType !== 'all'
          ? entry.mediaType === options.mediaType
          : true;
        const matchesStatus = options?.status && options.status !== 'all'
          ? entry.status === options.status
          : true;
        return matchesQuery && matchesType && matchesStatus;
      });
    },
    [entries]
  );

  const sortEntries = React.useCallback((list: MediaEntry[], sort: LibrarySortOption) => {
    const sorted = [...list];
    switch (sort) {
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'rating':
        return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      case 'progress':
        return sorted.sort(
          (a, b) => (b.progressUnits ?? 0) / (b.totalUnits ?? 1) - (a.progressUnits ?? 0) / (a.totalUnits ?? 1)
        );
      case 'dateAdded':
        return sorted.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
      case 'lastUpdated':
      default:
        return sorted.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
    }
  }, []);

  const getEntry = React.useCallback(
    (id: string) => entries.find((entry) => entry.id === id),
    [entries]
  );

  const incrementProgress = React.useCallback(
    async (id: string, delta = 1) => {
      if (delta === 0) return;
      
      // Optimistically update UI
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === id
            ? {
                ...entry,
                progressUnits: Math.max(
                  0,
                  Math.min((entry.totalUnits ?? Infinity), (entry.progressUnits ?? 0) + delta)
                ),
                updatedAt: new Date().toISOString(),
              }
            : entry
        )
      );
      
      // Update database in background
      try {
        await incrementProgressDb(id, delta);
      } catch (error) {
        console.error('Failed to increment progress:', error);
        // Revert on error
        const data = await fetchMediaEntries();
        setEntries(data);
      }
    },
    []
  );

  const toggleFavorite = React.useCallback(async (id: string) => {
    const target = entries.find((entry) => entry.id === id);
    if (!target) return;
    const updated = { ...target, isFavorite: !target.isFavorite, updatedAt: new Date().toISOString() };
    setEntries((prev) => prev.map((entry) => (entry.id === id ? updated : entry)));
    await upsertMediaEntry(updated);
  }, [entries]);

  const updateStatus = React.useCallback(async (id: string, status: MediaStatus) => {
    const target = entries.find((entry) => entry.id === id);
    if (!target) return;
    const updated = { ...target, status, updatedAt: new Date().toISOString() };
    setEntries((prev) => prev.map((entry) => (entry.id === id ? updated : entry)));
    await upsertMediaEntry(updated);
  }, [entries]);

  const saveEntry = React.useCallback(async (entry: MediaEntry) => {
    const timestamped = { ...entry, updatedAt: new Date().toISOString() };
    setEntries((prev) => {
      const exists = prev.some((item) => item.id === entry.id);
      return exists ? prev.map((item) => (item.id === entry.id ? timestamped : item)) : [timestamped, ...prev];
    });
    await upsertMediaEntry(timestamped);
  }, []);

  const value = React.useMemo<MediaContextValue>(
    () => ({
      loading,
      entries,
      stats,
      trendingByType,
      continueWatching,
      recentlyUpdated,
      search,
      sortEntries,
      getEntry,
      incrementProgress,
      toggleFavorite,
      updateStatus,
      saveEntry,
      refresh: hydrate,
    }),
    [loading, entries, stats, trendingByType, continueWatching, recentlyUpdated, search, sortEntries, getEntry, incrementProgress, toggleFavorite, updateStatus, saveEntry, hydrate]
  );

  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
}

export function useMediaContext() {
  const ctx = React.useContext(MediaContext);
  if (!ctx) {
    throw new Error('MediaContext not found');
  }
  return ctx;
}
