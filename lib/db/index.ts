import { MediaEntryRow, activityLogs, mediaEntries } from '@/lib/db/schema';
import type { MediaEntry } from '@/lib/types/media';
import { eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

const randomId = () => Math.random().toString(36).slice(2, 10);

const expoDb = openDatabaseSync('media-tracker.db');
export const db = drizzle(expoDb);

let isInitialized = false;

const CREATE_MEDIA_TABLE = `
CREATE TABLE IF NOT EXISTS media_entries (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  alternate_title TEXT,
  media_type TEXT NOT NULL,
  status TEXT NOT NULL,
  total_units INTEGER,
  progress_units INTEGER DEFAULT 0,
  unit_label TEXT NOT NULL DEFAULT 'episodes',
  rating REAL,
  synopsis TEXT,
  studio_or_author TEXT,
  source TEXT,
  cover_image TEXT NOT NULL,
  banner_image TEXT,
  genres TEXT NOT NULL DEFAULT '[]',
  platforms TEXT NOT NULL DEFAULT '[]',
  notes TEXT,
  release_date TEXT,
  year INTEGER,
  trending_rank INTEGER,
  seasonal_rank INTEGER,
  recommendation_rank INTEGER,
  is_favorite INTEGER NOT NULL DEFAULT 0,
  is_private INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
`;

const CREATE_ACTIVITY_TABLE = `
CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY NOT NULL,
  media_id TEXT NOT NULL,
  delta INTEGER NOT NULL,
  total_after INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY(media_id) REFERENCES media_entries(id) ON DELETE CASCADE
);
`;

const CREATE_MILESTONE_TABLE = `
CREATE TABLE IF NOT EXISTS milestones (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  achieved_at TEXT NOT NULL,
  icon TEXT NOT NULL
);
`;

export async function initializeDatabase() {
  if (isInitialized) return;
  
  await expoDb.execAsync(CREATE_MEDIA_TABLE);
  await expoDb.execAsync(CREATE_ACTIVITY_TABLE);
  await expoDb.execAsync(CREATE_MILESTONE_TABLE);
  
  isInitialized = true;
}

export async function seedMediaEntries(seed: MediaEntry[]) {
  const countResult = await db
    .select({ count: sql<number>`count(*)`.as('count') })
    .from(mediaEntries)
    .get();
  if ((countResult?.count ?? 0) > 0) {
    return;
  }

  for (const entry of seed) {
    await db.insert(mediaEntries).values(mapEntryToRow(entry)).run();
  }
}

export function mapEntryToRow(entry: MediaEntry): MediaEntryRow {
  return {
    id: entry.id,
    title: entry.title,
    alternateTitle: entry.alternateTitle ?? null,
    mediaType: entry.mediaType,
    status: entry.status,
    totalUnits: entry.totalUnits ?? null,
    progressUnits: entry.progressUnits ?? 0,
    unitLabel: entry.unitLabel,
    rating: entry.rating ?? null,
    synopsis: entry.synopsis ?? null,
    studioOrAuthor: entry.studioOrAuthor ?? null,
    source: entry.source ?? null,
    coverImage: entry.coverImage,
    bannerImage: entry.bannerImage ?? null,
    genres: JSON.stringify(entry.genres ?? []),
    platforms: JSON.stringify(entry.platforms ?? []),
    notes: entry.notes ?? null,
    releaseDate: entry.releaseDate ?? null,
    year: entry.year ?? null,
    trendingRank: entry.trendingRank ?? null,
    seasonalRank: entry.seasonalRank ?? null,
    recommendationRank: entry.recommendationRank ?? null,
    isFavorite: entry.isFavorite ? 1 : 0,
    isPrivate: entry.isPrivate ? 1 : 0,
    createdAt: entry.updatedAt,
    updatedAt: entry.updatedAt,
  };
}

export function mapRowToEntry(row: MediaEntryRow): MediaEntry {
  return {
    id: row.id,
    title: row.title,
    alternateTitle: row.alternateTitle ?? undefined,
    mediaType: row.mediaType as MediaEntry['mediaType'],
    status: row.status as MediaEntry['status'],
    totalUnits: row.totalUnits ?? undefined,
    progressUnits: row.progressUnits ?? undefined,
    unitLabel: (row.unitLabel ?? 'episodes') as MediaEntry['unitLabel'],
    rating: row.rating ?? undefined,
    synopsis: row.synopsis ?? undefined,
    studioOrAuthor: row.studioOrAuthor ?? undefined,
    source: row.source ?? undefined,
    coverImage: row.coverImage,
    bannerImage: row.bannerImage ?? undefined,
    genres: JSON.parse(row.genres ?? '[]'),
    platforms: JSON.parse(row.platforms ?? '[]'),
    notes: row.notes ?? undefined,
    releaseDate: row.releaseDate ?? undefined,
    year: row.year ?? undefined,
    trendingRank: row.trendingRank ?? undefined,
    seasonalRank: row.seasonalRank ?? undefined,
    recommendationRank: row.recommendationRank ?? undefined,
    isFavorite: Boolean(row.isFavorite),
    isPrivate: Boolean(row.isPrivate),
    updatedAt: row.updatedAt,
  };
}

export async function incrementProgress(id: string, delta = 1) {
  const existing = await db.select().from(mediaEntries).where(eq(mediaEntries.id, id)).get();
  if (!existing) return null;

  const maxUnits = existing.totalUnits ?? Number.MAX_SAFE_INTEGER;
  const progress = Math.max(0, Math.min(maxUnits, (existing.progressUnits ?? 0) + delta));
  await db
    .update(mediaEntries)
    .set({ progressUnits: progress, updatedAt: new Date().toISOString() })
    .where(eq(mediaEntries.id, id))
    .run();

  await db
    .insert(activityLogs)
    .values({
      id: randomId(),
      mediaId: id,
      delta,
      totalAfter: progress,
      createdAt: new Date().toISOString(),
    })
    .run();

  return progress;
}

export async function upsertMediaEntry(entry: MediaEntry) {
  const row = mapEntryToRow(entry);
  const existing = await db
    .select({ id: mediaEntries.id, createdAt: mediaEntries.createdAt })
    .from(mediaEntries)
    .where(eq(mediaEntries.id, entry.id))
    .get();

  if (existing) {
    await db
      .update(mediaEntries)
      .set({ ...row, createdAt: existing.createdAt })
      .where(eq(mediaEntries.id, entry.id))
      .run();
    return;
  }

  await db.insert(mediaEntries).values(row).run();
}

export async function fetchMediaEntries() {
  const rows = await db.select().from(mediaEntries).all();
  return rows.map(mapRowToEntry);
}
