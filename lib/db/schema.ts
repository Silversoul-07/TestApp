import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const mediaEntries = sqliteTable('media_entries', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  alternateTitle: text('alternate_title'),
  mediaType: text('media_type').notNull(),
  status: text('status').notNull(),
  totalUnits: integer('total_units'),
  progressUnits: integer('progress_units').default(0),
  unitLabel: text('unit_label').notNull().default('episodes'),
  rating: real('rating'),
  synopsis: text('synopsis'),
  studioOrAuthor: text('studio_or_author'),
  source: text('source'),
  coverImage: text('cover_image').notNull(),
  bannerImage: text('banner_image'),
  genres: text('genres').notNull().default('[]'),
  platforms: text('platforms').notNull().default('[]'),
  notes: text('notes'),
  releaseDate: text('release_date'),
  year: integer('year'),
  trendingRank: integer('trending_rank'),
  seasonalRank: integer('seasonal_rank'),
  recommendationRank: integer('recommendation_rank'),
  isFavorite: integer('is_favorite').notNull().default(0),
  isPrivate: integer('is_private').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const activityLogs = sqliteTable('activity_logs', {
  id: text('id').primaryKey(),
  mediaId: text('media_id')
    .notNull()
    .references(() => mediaEntries.id, { onDelete: 'cascade' }),
  delta: integer('delta').notNull(),
  totalAfter: integer('total_after').notNull(),
  createdAt: text('created_at').notNull(),
});

export const milestones = sqliteTable('milestones', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  achievedAt: text('achieved_at').notNull(),
  icon: text('icon').notNull(),
});

export type MediaEntryRow = typeof mediaEntries.$inferSelect;
export type ActivityLogRow = typeof activityLogs.$inferSelect;
export type MilestoneRow = typeof milestones.$inferSelect;
