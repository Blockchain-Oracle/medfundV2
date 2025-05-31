import { db } from '@/lib/db';
import { donations } from '@/lib/db/schema/donations';
import { campaigns } from '@/lib/db/schema/campaigns';
import { users } from '@/lib/db/schema/users';
import { desc, eq, and } from 'drizzle-orm';

export async function handler(req: Request) {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Get the most recent donations across all campaigns
    const recentDonations = await db.select({
      id: donations.id,
      campaignId: donations.campaignId,
      userId: donations.userId,
      amount: donations.amount,
      status: donations.status,
      message: donations.message,
      anonymous: donations.anonymous,
      transactionId: donations.transactionId,
      paymentMethod: donations.paymentMethod,
      createdAt: donations.createdAt,
      updatedAt: donations.updatedAt,
      campaignTitle: campaigns.title,
      userName: users.fullName
    })
    .from(donations)
    .leftJoin(campaigns, eq(donations.campaignId, campaigns.id))
    .leftJoin(users, eq(donations.userId, users.id))
    .where(eq(donations.status, 'completed'))
    .orderBy(desc(donations.createdAt))
    .limit(10);

    // Format donations for the response
    const formattedDonations = recentDonations.map(donation => ({
      id: donation.id,
      campaignId: donation.campaignId,
      userId: donation.userId,
      amount: donation.amount,
      status: donation.status,
      message: donation.message,
      anonymous: donation.anonymous,
      transactionId: donation.transactionId,
      paymentMethod: donation.paymentMethod,
      createdAt: donation.createdAt,
      updatedAt: donation.updatedAt,
      campaign: { title: donation.campaignTitle },
      user: { fullName: donation.userName }
    }));

    return new Response(JSON.stringify(formattedDonations), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching recent donations:', error);
    
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 