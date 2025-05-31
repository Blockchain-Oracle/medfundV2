// Simple Express server for handling Stripe API requests in development
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { db, campaigns, campaignUpdates, donations, users } from './server.config.js';
import { eq } from 'drizzle-orm';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes

// Get all campaigns
app.get('/api/campaigns', async (req, res) => {
  try {
    const allCampaigns = await db.select().from(campaigns);
    res.json(allCampaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// Get campaign by ID with related user data
app.get('/api/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Fetch campaign
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id)).limit(1);
    
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    // Fetch campaign organizer (user)
    if (campaign.userId) {
      const [user] = await db.select().from(users).where(eq(users.id, campaign.userId)).limit(1);
      if (user) {
        // Add user data but exclude sensitive fields
        const { password, ...safeUserData } = user;
        campaign.user = safeUserData;
      }
    }
    
    res.json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
});

// Get campaign updates
app.get('/api/campaigns/:id/updates', async (req, res) => {
  try {
    const { id } = req.params;
    
    const updates = await db.select()
      .from(campaignUpdates)
      .where(eq(campaignUpdates.campaignId, id))
      .orderBy(campaignUpdates.updateDate);
    
    res.json(updates);
  } catch (error) {
    console.error('Error fetching campaign updates:', error);
    res.status(500).json({ error: 'Failed to fetch campaign updates' });
  }
});

// Get campaign donations with user data
app.get('/api/campaigns/:id/donations', async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 5;
    
    const donationsList = await db.select()
      .from(donations)
      .where(eq(donations.campaignId, id))
      .orderBy(donations.createdAt)
      .limit(limit);
    
    // Fetch user data for each donation
    const donationsWithUsers = await Promise.all(
      donationsList.map(async (donation) => {
        if (donation.userId && !donation.anonymous) {
          const [user] = await db.select().from(users).where(eq(users.id, donation.userId)).limit(1);
          if (user) {
            // Add user data but exclude sensitive fields
            const { password, ...safeUserData } = user;
            return { ...donation, user: safeUserData };
          }
        }
        return donation;
      })
    );
    
    res.json(donationsWithUsers);
  } catch (error) {
    console.error('Error fetching campaign donations:', error);
    res.status(500).json({ error: 'Failed to fetch campaign donations' });
  }
});

// Handle SPA routing by serving the index.html for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 