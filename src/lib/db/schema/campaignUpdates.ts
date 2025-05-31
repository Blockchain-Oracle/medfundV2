import { pgTable, text, varchar, timestamp } from 'drizzle-orm/pg-core';
import { createId } from '../utils';
import { campaigns } from './campaigns';
import { relations } from 'drizzle-orm';

export const campaignUpdates = pgTable('campaign_updates', {
  id: text('id').primaryKey().$defaultFn(createId),
  campaignId: text('campaign_id').notNull().references(() => campaigns.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  updateDate: timestamp('update_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Define relations for the campaign updates table
export const campaignUpdatesRelations = relations(campaignUpdates, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [campaignUpdates.campaignId],
    references: [campaigns.id],
  }),
}));

export type CampaignUpdate = typeof campaignUpdates.$inferSelect;
export type NewCampaignUpdate = typeof campaignUpdates.$inferInsert; 