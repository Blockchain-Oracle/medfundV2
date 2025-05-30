import { pgTable, text, varchar, timestamp, boolean, decimal, pgEnum } from 'drizzle-orm/pg-core';
import { createId } from '../utils';
import { campaigns } from './campaigns';
import { users } from './users';
import { relations } from 'drizzle-orm';

// Create an enum for donation status
export const donationStatusEnum = pgEnum('donation_status', [
  'pending',
  'completed',
  'failed',
  'refunded'
]);

export const donations = pgTable('donations', {
  id: text('id').primaryKey().$defaultFn(createId),
  campaignId: text('campaign_id').notNull().references(() => campaigns.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: donationStatusEnum('status').default('pending').notNull(),
  message: text('message'),
  anonymous: boolean('anonymous').default(false),
  transactionId: text('transaction_id'),
  paymentMethod: varchar('payment_method', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Define relations for the donations table
export const donationsRelations = relations(donations, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [donations.campaignId],
    references: [campaigns.id],
  }),
  user: one(users, {
    fields: [donations.userId],
    references: [users.id],
  }),
}));

export type Donation = typeof donations.$inferSelect;
export type NewDonation = typeof donations.$inferInsert; 