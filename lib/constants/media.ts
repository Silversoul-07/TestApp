import type { LibrarySortOption, MediaStatus, MediaType } from '@/lib/types/media';
import { FilmIcon, LibraryIcon, ListChecksIcon, StarIcon, TrendingUpIcon } from 'lucide-react-native';

type FilterOption<T extends string> = {
  label: string;
  value: T;
};

type StatCardDefinition = {
  key: 'inProgress' | 'completed' | 'total';
  label: string;
  icon: typeof FilmIcon;
};

export const MEDIA_TYPE_FILTERS: FilterOption<'all' | MediaType>[] = [
  { label: 'All', value: 'all' },
  { label: 'Anime', value: 'anime' },
  { label: 'Manga', value: 'manga' },
  { label: 'Light Novels', value: 'light-novel' },
  { label: 'Novels', value: 'novel' },
  { label: 'Movies', value: 'movie' },
  { label: 'TV Series', value: 'tv' },
  { label: 'Drama', value: 'drama' },
  { label: 'Games', value: 'game' },
];

export const STATUS_FILTERS: FilterOption<'all' | MediaStatus>[] = [
  { label: 'All', value: 'all' },
  { label: 'Watching/Reading', value: 'watching' },
  { label: 'Completed', value: 'completed' },
  { label: 'Plan to', value: 'planned' },
  { label: 'On Hold', value: 'on-hold' },
  { label: 'Dropped', value: 'dropped' },
];

export const SORT_OPTIONS: FilterOption<LibrarySortOption>[] = [
  { label: 'Title', value: 'title' },
  { label: 'Rating', value: 'rating' },
  { label: 'Progress', value: 'progress' },
  { label: 'Last Updated', value: 'lastUpdated' },
  { label: 'Date Added', value: 'dateAdded' },
];

// Removed: STAT_CARD_DEFINITIONS - unused export

export const TRENDING_TABS: FilterOption<'anime' | 'manga' | 'tv' | 'movie'>[] = [
  { label: 'Anime', value: 'anime' },
  { label: 'Manga', value: 'manga' },
  { label: 'TV', value: 'tv' },
  { label: 'Movies', value: 'movie' },
];

// Removed: SECTION_ACTIONS and DASHBOARD_ACTIONS - unused exports
