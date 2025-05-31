import { db } from './index';
import { users, User, NewUser } from './schema/users';
import { campaigns, Campaign, NewCampaign } from './schema/campaigns';
import { donations, Donation, NewDonation } from './schema/donations';
import { medicalRecords, MedicalRecord, NewMedicalRecord } from './schema/medicalRecords';
import { paymentMethods, PaymentMethod, NewPaymentMethod } from './schema/paymentMethods';
import { campaignUpdates, CampaignUpdate, NewCampaignUpdate } from './schema/campaignUpdates';
import { eq, and, or, desc, asc, count, sql } from 'drizzle-orm';
import { uploadFile, uploadMultipleFiles } from '@/integrations/supabase/fileStorage';
import { BUCKET_CAMPAIGN_DOCUMENTS, BUCKET_CAMPAIGN_IMAGES } from '@/integrations/supabase/createBuckets';

// User operations
export const findUserById = async (id: string): Promise<User | undefined> => {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
};

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0];
};

export const createUser = async (data: NewUser): Promise<User> => {
  const result = await db.insert(users).values(data).returning();
  return result[0];
};

export const updateUser = async (id: string, data: Partial<NewUser>): Promise<User | undefined> => {
  const result = await db.update(users).set(data).where(eq(users.id, id)).returning();
  return result[0];
};

// Campaign operations
export const findCampaignById = async (id: string): Promise<Campaign | undefined> => {
  const result = await db.select().from(campaigns).where(eq(campaigns.id, id)).limit(1);
  return result[0];
};

export const getUserCampaigns = async (userId: string): Promise<Campaign[]> => {
  return db.select().from(campaigns).where(eq(campaigns.userId, userId));
};

export const createCampaign = async (data: NewCampaign): Promise<Campaign> => {
  const result = await db.insert(campaigns).values(data).returning();
  return result[0];
};

export const updateCampaign = async (id: string, data: Partial<NewCampaign>): Promise<Campaign | undefined> => {
  const result = await db.update(campaigns).set(data).where(eq(campaigns.id, id)).returning();
  return result[0];
};

// Campaign Updates operations
export const getCampaignUpdates = async (campaignId: string): Promise<CampaignUpdate[]> => {
  return db.select()
    .from(campaignUpdates)
    .where(eq(campaignUpdates.campaignId, campaignId))
    .orderBy(desc(campaignUpdates.updateDate));
};

export const createCampaignUpdate = async (data: NewCampaignUpdate): Promise<CampaignUpdate> => {
  const result = await db.insert(campaignUpdates).values(data).returning();
  return result[0];
};

export const updateCampaignUpdate = async (id: string, data: Partial<NewCampaignUpdate>): Promise<CampaignUpdate | undefined> => {
  const result = await db.update(campaignUpdates).set(data).where(eq(campaignUpdates.id, id)).returning();
  return result[0];
};

export const deleteCampaignUpdate = async (id: string): Promise<boolean> => {
  const result = await db.delete(campaignUpdates).where(eq(campaignUpdates.id, id)).returning();
  return result.length > 0;
};

// Donation operations
export const createDonation = async (data: NewDonation): Promise<Donation> => {
  const result = await db.insert(donations).values(data).returning();
  
  // Update campaign raised amount and donor count
  const donation = result[0];
  const campaign = await findCampaignById(donation.campaignId);
  if (campaign && donation.status === 'completed') {
    // Check if this is a new donor for this campaign
    const existingDonations = await db.select()
      .from(donations)
      .where(
        and(
          eq(donations.campaignId, donation.campaignId),
          eq(donations.userId, donation.userId),
          eq(donations.status, 'completed')
        )
      );
    
    const isNewDonor = existingDonations.length === 1; // Only the current donation exists
    
    // Update campaign with new raised amount and donor count if needed
    const updateData: Partial<NewCampaign> = {
      raised: (Number(campaign.raised) + Number(donation.amount)).toString(),
    };
    
    // Increment donor count if this is a new donor
    if (isNewDonor) {
      updateData.donorCount = (campaign.donorCount || 0) + 1;
    }
    
    // Update the campaign
    await updateCampaign(campaign.id, updateData);
  }
  
  return donation;
};

export const getCampaignDonations = async (campaignId: string): Promise<Donation[]> => {
  return db.select()
    .from(donations)
    .where(eq(donations.campaignId, campaignId))
    .orderBy(desc(donations.createdAt));
};

export const getRecentCampaignDonations = async (campaignId: string, limit: number = 5): Promise<Donation[]> => {
  return db.select()
    .from(donations)
    .where(eq(donations.campaignId, campaignId))
    .orderBy(desc(donations.createdAt))
    .limit(limit);
};

export const getUserDonations = async (userId: string): Promise<Donation[]> => {
  return db.select().from(donations).where(eq(donations.userId, userId));
};

// Medical Records operations
export const getUserMedicalRecords = async (userId: string): Promise<MedicalRecord[]> => {
  return db.select().from(medicalRecords).where(eq(medicalRecords.userId, userId));
};

export const createMedicalRecord = async (data: NewMedicalRecord): Promise<MedicalRecord> => {
  const result = await db.insert(medicalRecords).values(data).returning();
  return result[0];
};

// Payment Methods operations
export const getUserPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  return db.select().from(paymentMethods).where(eq(paymentMethods.userId, userId));
};

export const createPaymentMethod = async (data: NewPaymentMethod): Promise<PaymentMethod> => {
  // If this is the default payment method, unset other defaults
  if (data.isDefault) {
    await db.update(paymentMethods)
      .set({ isDefault: false })
      .where(and(
        eq(paymentMethods.userId, data.userId),
        eq(paymentMethods.isDefault, true)
      ));
  }
  
  const result = await db.insert(paymentMethods).values(data).returning();
  return result[0];
};

// Create a campaign with image upload
export const createCampaignWithImage = async (data: NewCampaign, previewImage: File | null, documents: File[] = []): Promise<Campaign> => {
  let imageUrl = null;
  let documentUrls: string[] = [];
  
  // Upload preview image to Supabase storage if provided
  if (previewImage) {
    const { publicUrl, error } = await uploadFile(previewImage, BUCKET_CAMPAIGN_IMAGES, 'previews');
    
    if (error) {
      console.error('Error uploading preview image:', error);
      throw new Error(`Failed to upload preview image: ${error.message}`);
    }
    
    imageUrl = publicUrl;
  }
  
  // Upload documents to Supabase storage if provided
  if (documents.length > 0) {
    const { publicUrls, errors } = await uploadMultipleFiles(documents, BUCKET_CAMPAIGN_DOCUMENTS, 'medical');
    
    if (errors.length > 0) {
      console.error('Errors uploading documents:', errors);
      // We'll continue even if some documents failed to upload
    }
    
    documentUrls = publicUrls;
  }
  
  // Create campaign with uploaded URLs
  const campaignData = {
    ...data,
    imageUrl,
    documentsUrl: documentUrls.length > 0 ? documentUrls : undefined,
  };
  
  const result = await db.insert(campaigns).values(campaignData).returning();
  return result[0];
}; 