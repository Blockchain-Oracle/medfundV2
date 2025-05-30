import { pgTable, text, varchar, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { createId } from '../utils';
import { users } from './users';
import { relations } from 'drizzle-orm';

// Create an enum for record types
export const recordTypeEnum = pgEnum('record_type', [
  'diagnosis',
  'test_result',
  'prescription',
  'treatment',
  'surgery',
  'consultation',
  'other'
]);

export const medicalRecords = pgTable('medical_records', {
  id: text('id').primaryKey().$defaultFn(createId),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  recordType: recordTypeEnum('record_type').notNull(),
  fileUrl: text('file_url'),
  isShared: boolean('is_shared').default(false),
  sharedWith: text('shared_with').array(),
  recordDate: timestamp('record_date').notNull(),
  provider: varchar('provider', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Define relations for the medical records table
export const medicalRecordsRelations = relations(medicalRecords, ({ one }) => ({
  user: one(users, {
    fields: [medicalRecords.userId],
    references: [users.id],
  }),
}));

export type MedicalRecord = typeof medicalRecords.$inferSelect;
export type NewMedicalRecord = typeof medicalRecords.$inferInsert; 