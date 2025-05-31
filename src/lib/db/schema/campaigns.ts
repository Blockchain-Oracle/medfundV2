import { pgTable, text, varchar, timestamp, boolean, pgEnum, decimal } from 'drizzle-orm/pg-core';
import { createId } from '../utils';
import { users } from './users';
import { relations } from 'drizzle-orm';
import { campaignUpdates } from './campaignUpdates';

// Create an enum for campaign status
export const campaignStatusEnum = pgEnum('campaign_status', [
  'pending',
  'active',
  'completed',
  'rejected',
  'cancelled'
]);

// Create an enum for campaign categories
export const campaignCategoryEnum = pgEnum('campaign_category', [
  'surgery',
  'treatment',
  'therapy',
  'emergency',
  'medication',
  'rehabilitation',
  'other'
]);

export const campaigns = pgTable('campaigns', {
  id: text('id').primaryKey().$defaultFn(createId),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  storyContent: text('story_content'),
  goal: decimal('goal', { precision: 10, scale: 2 }).notNull(),
  raised: decimal('raised', { precision: 10, scale: 2 }).default('0').notNull(),
  category: campaignCategoryEnum('category').notNull(),
  status: campaignStatusEnum('status').default('pending').notNull(),
  isUrgent: boolean('is_urgent').default(false),
  imageUrl: text('image_url'),
  location: varchar('location', { length: 255 }),
  documentsUrl: text('documents_url').array(),
  walletAddress: text('wallet_address'),
  startDate: timestamp('start_date').defaultNow(),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Define relations for the campaigns table
export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  user: one(users, {
    fields: [campaigns.userId],
    references: [users.id],
  }),
  // Add relation to campaign updates
  updates: many(campaignUpdates),
  // donations relation will be defined in the donations schema
}));

export type Campaign = typeof campaigns.$inferSelect;
export type NewCampaign = typeof campaigns.$inferInsert; 