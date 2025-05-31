import { db } from '@/lib/db';
import { campaigns, type NewCampaign } from '@/lib/db/schema/campaigns';
import { createId } from '@/lib/db/utils';

interface CreateCampaignRequest {
  title: string;
  description: string;
  storyContent: string;
  goal: string;
  category: "surgery" | "treatment" | "therapy" | "emergency" | "medication" | "rehabilitation" | "other";
  isUrgent: boolean;
  walletAddress: string;
  location: string | null;
  userId: string;
  imageUrl: string | null;
  documentsUrl: string[] | null;
}

export async function handler(req: Request) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Parse request body
    const body = await req.json() as CreateCampaignRequest;
    
    // Create campaign data object
    const campaignData: NewCampaign = {
      id: createId(),
      userId: body.userId,
      title: body.title,
      description: body.description,
      storyContent: body.storyContent,
      goal: body.goal,
      category: body.category,
      isUrgent: body.isUrgent,
      walletAddress: body.walletAddress,
      location: body.location,
      status: 'pending',
      imageUrl: body.imageUrl,
      documentsUrl: body.documentsUrl || [],
    };
    
    // Insert into database
    const [campaign] = await db.insert(campaigns).values(campaignData).returning();
    
    // Return success response
    return new Response(JSON.stringify({ 
      success: true, 
      campaign 
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error creating campaign:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 