// seed-db.mjs - Pure ESM seed script
import { drizzle } from 'drizzle-orm/postgres-js';
import { pgTable, text, varchar, timestamp, boolean, pgEnum, decimal } from 'drizzle-orm/pg-core';
import postgres from 'postgres';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

// Load environment variables
dotenv.config();

// Database connection
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/medfund';
const client = postgres(connectionString);
const db = drizzle(client);

// Helper function to create ID
const createId = () => randomUUID();

// The provided wallet address to use for all mock data
const WALLET_ADDRESS = "addr_test1qqfpkkpkhhlrd9ve0smzjphc09hafcmgj74k5sskxz6sxxc0uufz0d0k8h4sfgfwh9v6tgtxea806qw7dmeg4c8yqtdstcyu88";

// Define schema directly for seeding purposes
// Users table
const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  address: text('address'),
  avatarUrl: text('avatar_url'),
  isVerified: boolean('is_verified').default(false),
  role: varchar('role', { length: 50 }).default('user'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Campaigns table
const campaignStatusEnum = pgEnum('campaign_status', [
  'pending', 'active', 'completed', 'rejected', 'cancelled'
]);

const campaignCategoryEnum = pgEnum('campaign_category', [
  'surgery', 'treatment', 'therapy', 'emergency', 'medication', 'rehabilitation', 'other'
]);

const campaigns = pgTable('campaigns', {
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
  documentsUrl: text('documents_url').array(),
  startDate: timestamp('start_date').defaultNow(),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Campaign updates table
const campaignUpdates = pgTable('campaign_updates', {
  id: text('id').primaryKey(),
  campaignId: text('campaign_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  updateDate: timestamp('update_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Donations table
const donationStatusEnum = pgEnum('donation_status', [
  'pending', 'completed', 'failed', 'refunded'
]);

const donations = pgTable('donations', {
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

async function seedDatabase() {
  console.log("Starting database seeding...");
  
  try {
    // First run migrations script
    console.log("Running migrations...");
    try {
      await import('./migrate-db.mjs');
    } catch (err) {
      console.log("Migration already completed or skipped");
    }
    
    // Define the mock users we want to ensure exist
    const mockUsers = [
      {
        email: "john@example.com",
        fullName: "John Smith",
        password: "hashed_password_here",
        phone: "+61412345678",
        address: "Sydney, Australia",
        isVerified: true,
        role: "user"
      },
      {
        email: "sarah@example.com",
        fullName: "Sarah Johnson",
        password: "hashed_password_here",
        phone: "+61487654321",
        address: "Melbourne, Australia",
        isVerified: true,
        role: "user"
      },
      {
        email: "admin@medfund.org",
        fullName: "Admin User",
        password: "hashed_admin_password",
        phone: "+61499999999",
        address: "Brisbane, Australia",
        isVerified: true,
        role: "admin"
      }
    ];
    
    // Get or create users
    console.log("Getting or creating users...");
    const userIds = [];
    
    for (const userData of mockUsers) {
      // Check if user already exists using raw SQL
      const existingUsers = await client`
        SELECT * FROM users WHERE email = ${userData.email}
      `;
      
      if (existingUsers.length > 0) {
        console.log(`User with email ${userData.email} already exists, skipping creation`);
        userIds.push(existingUsers[0].id);
      } else {
        // Create the user if it doesn't exist
        const insertedUser = await db.insert(users).values({
          id: createId(),
          ...userData
        }).returning();
        
        userIds.push(insertedUser[0].id);
      }
    }
    
    // Now try to add wallet addresses to users
    console.log("Adding wallet addresses to users...");
    try {
      // Check if wallet_address column exists and add if needed
      await client`
        ALTER TABLE "users" 
        ADD COLUMN IF NOT EXISTS "wallet_address" text;
      `;
      
      // Update users with wallet addresses
      for (const userId of userIds) {
        await client`
          UPDATE "users" 
          SET "wallet_address" = ${WALLET_ADDRESS} 
          WHERE "id" = ${userId}
        `;
      }
      console.log("Wallet addresses added to users");
    } catch (err) {
      console.warn("Could not add wallet addresses to users:", err.message);
    }
    
    // Check if campaign already exists
    console.log("Getting or creating campaigns...");
    const campaignTitle = "Emergency Heart Surgery";
    
    // Check if campaign already exists using raw SQL
    const existingCampaigns = await client`
      SELECT * FROM campaigns WHERE title = ${campaignTitle}
    `;
    
    let campaignIds = [];
    
    if (existingCampaigns.length > 0) {
      console.log(`Campaign "${campaignTitle}" already exists, skipping creation`);
      campaignIds = existingCampaigns.map(c => c.id);
    } else {
      // Create mock campaigns
      const campaignsData = [
        {
          id: createId(),
          userId: userIds[0], // John Smith
          title: campaignTitle,
          description: "Help John receive his life-saving heart surgery. Your contribution makes a difference!",
          goal: "50000",
          raised: "35000",
          category: "surgery",
          status: "active",
          isUrgent: true,
          imageUrl: "/images/campaign1.jpeg",
          location: "Sydney, Australia",
          startDate: new Date("2024-01-15"),
          endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days from now
        }
      ];

      const insertedCampaigns = await db.insert(campaigns).values(campaignsData).returning();
      campaignIds = insertedCampaigns.map(campaign => campaign.id);
    }
    
    // Now try to add story_content and wallet_address to campaigns
    console.log("Adding wallet addresses and story content to campaigns...");
    try {
      // Check if columns exist
      await client`
        ALTER TABLE "campaigns" 
        ADD COLUMN IF NOT EXISTS "wallet_address" text;
      `;
      
      await client`
        ALTER TABLE "campaigns" 
        ADD COLUMN IF NOT EXISTS "story_content" text;
      `;
      
      // Update campaigns with wallet addresses and story content
      const storyContent = `John is a 45-year-old father of two who recently suffered a massive heart attack. The doctors have determined that he needs emergency bypass surgery to save his life.

The surgery is scheduled for next month, and the total cost including hospital stay, medication, and follow-up care is 50,000 ADA. John's insurance covers only a portion of these costs, leaving the family with a significant financial burden.

John has been the sole provider for his family, and his wife Sarah has been unable to work while caring for him and their children. Every donation, no matter how small, brings us closer to giving John the chance to live and continue being the loving father and husband his family needs.

The funds will be used for:
- Surgical procedure costs: 30,000 ADA
- Hospital stay and monitoring: 12,000 ADA
- Medications and aftercare: 5,000 ADA
- Transportation and accommodation for family: 3,000 ADA`;
      
      for (const campaignId of campaignIds) {
        await client`
          UPDATE "campaigns" 
          SET "wallet_address" = ${WALLET_ADDRESS}, 
              "story_content" = ${storyContent}
          WHERE "id" = ${campaignId}
        `;
      }
      console.log("Wallet addresses and story content added to campaigns");
    } catch (err) {
      console.warn("Could not add additional campaign data:", err.message);
    }
    
    // Check if campaign updates already exist
    console.log("Getting or creating campaign updates...");
    
    // Check for existing updates using raw SQL
    const existingUpdates = await client`
      SELECT * FROM campaign_updates WHERE campaign_id = ${campaignIds[0]}
    `;
    
    if (existingUpdates.length === 0) {
      // Create campaign updates
      const updatesData = [
        // Updates for Campaign 1
        {
          id: createId(),
          campaignId: campaignIds[0],
          title: "Surgery Date Confirmed",
          content: "Great news! The hospital has confirmed John's surgery date for next month. Thank you to everyone who has donated so far.",
          updateDate: new Date("2024-01-20")
        }
      ];

      await db.insert(campaignUpdates).values(updatesData);
      console.log("Campaign updates created");
    } else {
      console.log("Campaign updates already exist, skipping creation");
    }
    
    // Check if donations already exist
    console.log("Getting or creating donations...");
    
    // Check for existing donations using raw SQL
    const existingDonations = await client`
      SELECT * FROM donations WHERE campaign_id = ${campaignIds[0]}
    `;
    
    if (existingDonations.length === 0) {
      // Create donations
      const donationsData = [
        // Donations for Campaign 1
        {
          id: createId(),
          campaignId: campaignIds[0],
          userId: userIds[1], // Sarah Johnson
          amount: "500",
          status: "completed",
          message: "Wishing you a speedy recovery, John!",
          anonymous: false,
          transactionId: "tx_" + createId(),
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        }
      ];

      await db.insert(donations).values(donationsData);
      console.log("Donations created");
    } else {
      console.log("Donations already exist, skipping creation");
    }
    
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    // Close the database connection
    await client.end();
  }
}

seedDatabase()
  .then(() => {
    console.log("Database seeding completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  }); 