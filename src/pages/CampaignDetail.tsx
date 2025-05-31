import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Heart, ArrowLeft, Share2, Calendar, Users, Target, Shield, FileText, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import DonationForm from "@/components/DonationForm";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { DEFAULT_RECIPIENT_ADDRESS } from "@/integrations/cardano/cardanoService";
import axios from "axios";

// Type definitions
interface User {
  id: string;
  fullName: string;
  email: string;
  walletAddress?: string;
}

interface Campaign {
  id: string;
  userId: string;
  title: string;
  description: string;
  storyContent?: string;
  goal: string;
  raised: string;
  category: string;
  status: string;
  isUrgent: boolean;
  imageUrl?: string;
  location?: string;
  documentsUrl?: string[];
  walletAddress?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  donorCount?: number;
}

interface CampaignUpdate {
  id: string;
  campaignId: string;
  title: string;
  content: string;
  updateDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface Donation {
  id: string;
  campaignId: string;
  userId: string;
  amount: string;
  status: string;
  message?: string;
  anonymous: boolean;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

// API client functions
const fetchCampaign = async (id: string): Promise<Campaign> => {
  const { data } = await axios.get(`/api/campaigns/${id}`);
  return data;
};

const fetchCampaignUpdates = async (id: string): Promise<CampaignUpdate[]> => {
  const { data } = await axios.get(`/api/campaigns/${id}/updates`);
  return data;
};

const fetchCampaignDonations = async (id: string): Promise<Donation[]> => {
  const { data } = await axios.get(`/api/campaigns/${id}/donations?limit=5`);
  return data;
};

const CampaignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDonationForm, setShowDonationForm] = useState(false);

  // Query for campaign data
  const { 
    data: campaign, 
    isLoading: campaignLoading, 
    error: campaignError 
  } = useQuery({
    queryKey: ['campaign', id],
    queryFn: () => fetchCampaign(id || ''),
    enabled: !!id,
  });

  // Query for campaign updates
  const { 
    data: updates = [], 
    isLoading: updatesLoading
  } = useQuery({
    queryKey: ['campaignUpdates', id],
    queryFn: () => fetchCampaignUpdates(id || ''),
    enabled: !!id,
  });

  // Query for recent donations
  const { 
    data: recentDonations = [], 
    isLoading: donationsLoading
  } = useQuery({
    queryKey: ['campaignDonations', id],
    queryFn: () => fetchCampaignDonations(id || ''),
    enabled: !!id,
  });

  const isLoading = campaignLoading || updatesLoading || donationsLoading;
  const error = campaignError ? (campaignError as Error).message : null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Campaign link copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-white text-xl">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-center">Error</CardTitle>
            <CardDescription className="text-center">{error || "Failed to load campaign"}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Button onClick={() => navigate('/campaigns')} className="mt-4">
              View All Campaigns
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progressPercentage = (parseFloat(campaign.raised) / parseFloat(campaign.goal)) * 100;
  const daysLeft = campaign.endDate 
    ? Math.max(0, Math.ceil((new Date(campaign.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) 
    : 0;

  // Use the campaign wallet address if available, otherwise use the default
  const walletAddress = campaign.walletAddress || DEFAULT_RECIPIENT_ADDRESS;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 relative overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      {/* Page Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/campaigns">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaigns
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Campaign Header */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {campaign.isUrgent && <Badge variant="destructive">Urgent</Badge>}
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl lg:text-3xl text-gray-800 mb-2">
                      {campaign.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Organized by {campaign.user?.fullName || "Anonymous"} • {campaign.location || "Unknown location"}
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={handleShare} className="ml-4">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Campaign Image */}
            {campaign.imageUrl && (
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src={campaign.imageUrl} 
                  alt={campaign.title} 
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* Campaign Story */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Campaign Story
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {campaign.storyContent ? (
                    campaign.storyContent.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    campaign.description.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Updates */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Campaign Updates</CardTitle>
              </CardHeader>
              <CardContent>
                {updates.length > 0 ? (
                  <div className="space-y-4">
                    {updates.map((update) => (
                      <div key={update.id} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-800">{update.title}</h4>
                          <span className="text-sm text-gray-500">
                            {new Date(update.updateDate || update.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600">{update.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No updates available yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Donation Card */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl sticky top-4">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-800">
                      A{parseFloat(campaign.raised).toLocaleString()}
                    </div>
                    <div className="text-gray-600">
                      raised of A{parseFloat(campaign.goal).toLocaleString()} goal
                    </div>
                  </div>
                  
                  <Progress value={progressPercentage} className="h-3" />
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-semibold text-gray-800">{campaign.donorCount || recentDonations.length}</div>
                      <div className="text-sm text-gray-600">donors</div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-gray-800">{daysLeft}</div>
                      <div className="text-sm text-gray-600">days left</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
                    onClick={() => setShowDonationForm(true)}
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    Donate Now
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      Secure donation processing powered by Stripe and Cardano
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Donations */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Recent Donations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentDonations.length > 0 ? (
                  <div className="space-y-3">
                    {recentDonations.map((donation) => (
                      <div key={donation.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-800">
                            {donation.anonymous ? "Anonymous" : donation.user?.fullName || "Anonymous"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(donation.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="font-semibold text-blue-600">
                          A{donation.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No donations yet. Be the first to donate!</p>
                )}
              </CardContent>
            </Card>

            {/* Campaign Details */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Campaign Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium capitalize">{campaign.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{campaign.location || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600 capitalize">{campaign.status} ✓</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Donation Form Modal */}
      {showDonationForm && (
        <DonationForm 
          campaign={{
            id: campaign.id,
            title: campaign.title,
            organizer: campaign.user?.fullName || "Anonymous",
            walletAddress: walletAddress
          }}
          onClose={() => setShowDonationForm(false)}
        />
      )}
    </div>
  );
};

export default CampaignDetail;
