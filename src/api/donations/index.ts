import { createDonation } from '@/lib/db/helpers';
import { NewDonation } from '@/lib/db/schema/donations';
import { findUserById, createUser } from '@/lib/db/helpers';
import { createId } from '@/lib/db/utils';

// Function to ensure an anonymous user exists in the database
async function ensureAnonymousUser() {
  // First, check if anonymous user already exists
  const anonymousUser = await findUserById('anonymous');
  
  // If not, create one
  if (!anonymousUser) {
    await createUser({
      id: 'anonymous',
      email: 'anonymous@medfund.org',
      fullName: 'Anonymous Donor',
      role: 'anonymous',
      isVerified: true
    });
  }
  
  return 'anonymous';
}

export async function handler(req: Request) {
  // Handle POST request to create a donation
  if (req.method === 'POST') {
    try {
      // Get donation data from request body
      const donationData: NewDonation = await req.json();
      
      // Validate the donation data
      if (!donationData.campaignId || !donationData.amount) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Missing required fields' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Set donation status to completed if not provided
      if (!donationData.status) {
        donationData.status = 'completed';
      }
      
      // Handle anonymous donations or users that don't exist in the database
      if (donationData.anonymous || !donationData.userId || donationData.userId.startsWith('did:') || donationData.userId === 'anonymous') {
        // Ensure the anonymous user exists in the database
        donationData.userId = await ensureAnonymousUser();
      } else {
        // Check if the user exists
        const user = await findUserById(donationData.userId);
        if (!user) {
          // If user doesn't exist, use anonymous user
          donationData.userId = await ensureAnonymousUser();
        }
      }
      
      // Create the donation in the database
      // This will also update the campaign's raised amount
      const donation = await createDonation(donationData);
      
      return new Response(JSON.stringify({ 
        success: true, 
        donation 
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error creating donation:', error);
      
      return new Response(JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  // Handle unsupported methods
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
} 