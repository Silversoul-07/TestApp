export type MediaType =
  | 'anime'
  | 'manga'
  | 'light-novel'
  | 'novel'
  | 'movie'
  | 'tv'
  | 'drama'
  | 'game'
  | 'other';

export type MediaStatus =
  | 'watching'
  | 'reading'
  | 'completed'
  | 'planned'
  | 'on-hold'
  | 'dropped';

export type MediaProgressUnit = 'episodes' | 'chapters' | 'volumes' | 'entries';

export type PlatformLink = {
  label: string;
  url: string;
};

export type GenreChipData = {
  id: string;
  label: string;
};

export type MediaEntry = {
  id: string;
  title: string;
  alternateTitle?: string;
  year?: number;
  mediaType: MediaType;
  status: MediaStatus;
  totalUnits?: number;
  progressUnits?: number;
  unitLabel: MediaProgressUnit;
  rating?: number;
  synopsis?: string;
  studioOrAuthor?: string;
  source?: string;
  coverImage: string;
  bannerImage?: string;
  genres: string[];
  platforms: PlatformLink[];
  notes?: string;
  updatedAt: string;
  releaseDate?: string;
  trendingRank?: number;
  seasonalRank?: number;
  recommendationRank?: number;
  isFavorite?: boolean;
  isPrivate?: boolean;
  scoreHistory?: Array<{ date: string; value: number }>;
};

export type ActivityLog = {
  id: string;
  mediaId: string;
  delta: number;
  totalAfter: number;
  createdAt: string;
};

export type MediaStats = {
  totalEntries: number;
  completed: number;
  inProgress: number;
  meanScore: number;
  episodesWatched: number;
  chaptersRead: number;
  daysWatched: number;
};

export type DistributionDatum = {
  mediaType: MediaType | 'other';
  value: number;
};

export type GenreDistribution = {
  genre: string;
  value: number;
};

export type ActivityPoint = {
  date: string;
  value: number;
};

export type LibrarySortOption =
  | 'title'
  | 'rating'
  | 'progress'
  | 'lastUpdated'
  | 'dateAdded';

export type LibraryViewMode = 'grid' | 'list';
