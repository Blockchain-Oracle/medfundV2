import { pgTable, text, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';
import { createId } from '../utils';

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(createId),
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

// Relations are handled in their respective schema files

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert; 