// Exporting schema definitions for use in JavaScript ESM files
import { pgTable, text, varchar, timestamp, boolean, decimal } from 'drizzle-orm/pg-core';

// Users schema
export const usersSchema = pgTable('users', {
  id: text('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  address: text('address'),
  avatarUrl: text('avatar_url'),
  walletAddress: text('wallet_address'),
  isVerified: boolean('is_verified').default(false),
  role: varchar('role', { length: 50 }).default('user'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Campaigns schema
export const campaignsSchema = pgTable('campaigns', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  storyContent: text('story_content'),
  goal: decimal('goal', { precision: 10, scale: 2 }).notNull(),
  raised: decimal('raised', { precision: 10, scale: 2 }).default('0').notNull(),
  category: text('category').notNull(),
  status: text('status').default('pending').notNull(),
  isUrgent: boolean('is_urgent').default(false),
  imageUrl: text('image_url'),
  location: varchar('location', { length: 255 }),
  walletAddress: text('wallet_address'),
  documentsUrl: text('documents_url').array(),
  startDate: timestamp('start_date').defaultNow(),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Campaign updates schema
export const campaignUpdatesSchema = pgTable('campaign_updates', {
  id: text('id').primaryKey(),
  campaignId: text('campaign_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  updateDate: timestamp('update_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Donations schema
export const donationsSchema = pgTable('donations', {
  id: text('id').primaryKey(),
  campaignId: text('campaign_id').notNull(),
  userId: text('user_id').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status').default('pending').notNull(),
  message: text('message'),
  anonymous: boolean('anonymous').default(false),
  transactionId: text('transaction_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}); 