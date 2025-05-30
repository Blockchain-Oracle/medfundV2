import { pgTable, text, varchar, timestamp, boolean, integer } from 'drizzle-orm/pg-core';
import { createId } from '../utils';
import { users } from './users';
import { relations } from 'drizzle-orm';

export const paymentMethods = pgTable('payment_methods', {
  id: text('id').primaryKey().$defaultFn(createId),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull(), // credit_card, paypal, crypto, etc.
  name: varchar('name', { length: 255 }).notNull(),
  last4: varchar('last4', { length: 4 }),
  expiryMonth: integer('expiry_month'),
  expiryYear: integer('expiry_year'),
  isDefault: boolean('is_default').default(false),
  billingAddress: text('billing_address'),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Define relations for the payment methods table
export const paymentMethodsRelations = relations(paymentMethods, ({ one }) => ({
  user: one(users, {
    fields: [paymentMethods.userId],
    references: [users.id],
  }),
}));

export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type NewPaymentMethod = typeof paymentMethods.$inferInsert; 