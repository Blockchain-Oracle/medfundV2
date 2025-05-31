// CommonJS seed script
const { migrate } = require('drizzle-orm/postgres-js/migrator');
const postgres = require('postgres');
const { drizzle } = require('drizzle-orm/postgres-js');
const path = require('path');
const { randomUUID } = require('crypto');

// Database connection
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/medfund';
const client = postgres(connectionString);
const db = drizzle(client);

// The provided wallet address to use for all mock data
const WALLET_ADDRESS = "addr_test1qqfpkkpkhhlrd9ve0smzjphc09hafcmgj74k5sskxz6sxxc0uufz0d0k8h4sfgfwh9v6tgtxea806qw7dmeg4c8yqtdstcyu88";

// Utility function to create IDs
const createId = () => randomUUID();

// Run migrations first
async function runMigrations() {
  const migrationsFolder = path.join(__dirname, 'migrations');
  
  console.log('Running migrations from:', migrationsFolder);
  
  // For migrations
  const migrationClient = postgres(connectionString, { max: 1 });
  const migrationDb = drizzle(migrationClient);

  try {
    console.log('Starting migrations...');
    await migrate(migrationDb, { migrationsFolder });
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Error running migrations:', error);
  } finally {
    await migrationClient.end();
  }
}

// Main seed function
async function seedDatabase() {
  console.log("Starting database seeding...");
  
  // First, run migrations to ensure schema is up to date
  await runMigrations();

  try {
    // Create mock users
    console.log("Creating users...");
    const userIds = await createUsers();
    
    // Create mock campaigns
    console.log("Creating campaigns...");
    const campaignIds = await createCampaigns(userIds);
    
    // Create campaign updates
    console.log("Creating campaign updates...");
    await createCampaignUpdates(campaignIds);
    
    // Create donations
    console.log("Creating donations...");
    await createDonations(userIds, campaignIds);
    
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    // Close the database connection
    await client.end();
  }
}

async function createUsers() {
  const usersData = [
    {
      id: createId(),
      email: "john@example.com",
      fullName: "John Smith",
      password: "hashed_password_here", // In a real app, you'd use bcrypt
      phone: "+61412345678",
      address: "Sydney, Australia",
      walletAddress: WALLET_ADDRESS,
      isVerified: true,
      role: "user"
    },
    {
      id: createId(),
      email: "sarah@example.com",
      fullName: "Sarah Johnson",
      password: "hashed_password_here", // In a real app, you'd use bcrypt
      phone: "+61487654321",
      address: "Melbourne, Australia",
      walletAddress: WALLET_ADDRESS,
      isVerified: true,
      role: "user"
    },
    {
      id: createId(),
      email: "admin@medfund.org",
      fullName: "Admin User",
      password: "hashed_admin_password", // In a real app, you'd use bcrypt
      phone: "+61499999999",
      address: "Brisbane, Australia",
      walletAddress: WALLET_ADDRESS,
      isVerified: true,
      role: "admin"
    }
  ];

  const insertedUsers = await db.insert('users').values(usersData).returning();
  return insertedUsers.map(user => user.id);
}

async function createCampaigns(userIds) {
  const campaignsData = [
    {
      id: createId(),
      userId: userIds[0], // John Smith
      title: "Emergency Heart Surgery",
      description: "Help John receive his life-saving heart surgery. Your contribution makes a difference!",
      storyContent: `John is a 45-year-old father of two who recently suffered a massive heart attack. The doctors have determined that he needs emergency bypass surgery to save his life.

The surgery is scheduled for next month, and the total cost including hospital stay, medication, and follow-up care is 50,000 ADA. John's insurance covers only a portion of these costs, leaving the family with a significant financial burden.

John has been the sole provider for his family, and his wife Sarah has been unable to work while caring for him and their children. Every donation, no matter how small, brings us closer to giving John the chance to live and continue being the loving father and husband his family needs.

The funds will be used for:
- Surgical procedure costs: 30,000 ADA
- Hospital stay and monitoring: 12,000 ADA
- Medications and aftercare: 5,000 ADA
- Transportation and accommodation for family: 3,000 ADA`,
      goal: "50000",
      raised: "35000",
      category: "surgery",
      status: "active",
      isUrgent: true,
      imageUrl: "/images/campaign1.jpeg",
      location: "Sydney, Australia",
      walletAddress: WALLET_ADDRESS,
      startDate: new Date("2024-01-15"),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days from now
    },
    {
      id: createId(),
      userId: userIds[1], // Sarah Johnson
      title: "Cancer Treatment Fund",
      description: "Supporting Maria through her cancer treatment journey with chemotherapy and care.",
      storyContent: `Maria is a 38-year-old mother of three who was recently diagnosed with stage 2 breast cancer. This diagnosis came as a shock to her and her family, but they are determined to fight through this challenging time with the support of their community.

The treatment plan includes surgery, chemotherapy, radiation therapy, and ongoing medications. The total cost of treatment is estimated at 40,000 ADA, with insurance covering only a small portion.

Maria works as a teacher and has had to take unpaid leave to focus on her treatment. Her husband is working extra hours to support the family, but the medical expenses are overwhelming.

Your donations will help with:
- Chemotherapy sessions: 15,000 ADA
- Radiation therapy: 10,000 ADA
- Specialized medications: 8,000 ADA
- Supportive care and therapy: 7,000 ADA

Any amount you can contribute will make a significant difference in Maria's fight against cancer. Thank you for your support during this difficult time.`,
      goal: "40000",
      raised: "22000",
      category: "treatment",
      status: "active",
      isUrgent: false,
      imageUrl: "/images/campaign2.jpg",
      location: "Melbourne, Victoria",
      walletAddress: WALLET_ADDRESS,
      startDate: new Date("2024-02-01"),
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) // 45 days from now
    },
    // Additional campaigns would be here...
  ];

  const insertedCampaigns = await db.insert('campaigns').values(campaignsData).returning();
  return insertedCampaigns.map(campaign => campaign.id);
}

async function createCampaignUpdates(campaignIds) {
  const updatesData = [
    // Updates for Campaign 1
    {
      id: createId(),
      campaignId: campaignIds[0],
      title: "Surgery Date Confirmed",
      content: "Great news! The hospital has confirmed John's surgery date for next month. Thank you to everyone who has donated so far. Your generosity means we're getting closer to our goal and John is one step closer to receiving this life-saving surgery.",
      updateDate: new Date("2024-01-20")
    },
    {
      id: createId(),
      campaignId: campaignIds[0],
      title: "Medical Clearance Received",
      content: "John has received medical clearance for the surgery. The doctors have performed all the necessary pre-operative tests and are confident that the surgery will be successful. We're getting closer to our goal and every donation helps.",
      updateDate: new Date("2024-01-18")
    },
    
    // Updates for Campaign 2
    {
      id: createId(),
      campaignId: campaignIds[1],
      title: "First Round of Chemo Completed",
      content: "Maria has completed her first round of chemotherapy. While the side effects have been challenging, she remains positive and determined. The doctors are pleased with her progress so far. Thank you for your continued support during this journey.",
      updateDate: new Date("2024-02-15")
    }
  ];

  await db.insert('campaign_updates').values(updatesData);
}

async function createDonations(userIds, campaignIds) {
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
    },
    {
      id: createId(),
      campaignId: campaignIds[0],
      userId: userIds[2], // Admin
      amount: "1000",
      status: "completed",
      message: "Our thoughts are with you and your family.",
      anonymous: true,
      transactionId: "tx_" + createId(),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    }
  ];

  await db.insert('donations').values(donationsData);
}

// Run the seed script
seedDatabase()
  .then(() => {
    console.log("Database seeding completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  }); 