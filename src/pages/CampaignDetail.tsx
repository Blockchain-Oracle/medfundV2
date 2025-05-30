import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Heart, ArrowLeft, Share2, Calendar, Users, Target, Shield, FileText, CreditCard } from "lucide-react";
import { toast } from "sonner";
import DonationForm from "@/components/DonationForm";

const CampaignDetail = () => {
  const { id } = useParams();
  const [showDonationForm, setShowDonationForm] = useState(false);

  // Mock campaign data - in real app, this would be fetched based on ID
  const campaign = {
    id: 1,
    title: "Emergency Heart Surgery",
    description: "Help John receive his life-saving heart surgery. Your contribution makes a difference!",
    fullDescription: `John is a 45-year-old father of two who recently suffered a massive heart attack. The doctors have determined that he needs emergency bypass surgery to save his life. 

The surgery is scheduled for next month, and the total cost including hospital stay, medication, and follow-up care is $50,000. John's insurance covers only a portion of these costs, leaving the family with a significant financial burden.

John has been the sole provider for his family, and his wife Sarah has been unable to work while caring for him and their children. Every donation, no matter how small, brings us closer to giving John the chance to live and continue being the loving father and husband his family needs.

The funds will be used for:
- Surgical procedure costs: $30,000
- Hospital stay and monitoring: $12,000
- Medications and aftercare: $5,000
- Transportation and accommodation for family: $3,000`,
    raised: 35000,
    goal: 50000,
    urgent: true,
    category: "surgery",
    daysLeft: 15,
    donors: 234,
    createdDate: "2024-01-15",
    organizer: "Sarah Johnson",
    location: "Sydney, Australia",
    verified: true,
    updates: [
      {
        date: "2024-01-20",
        title: "Surgery Date Confirmed",
        content: "Great news! The hospital has confirmed John's surgery date for February 5th. Thank you to everyone who has donated so far."
      },
      {
        date: "2024-01-18",
        title: "Medical Clearance Received",
        content: "John has received medical clearance for the surgery. We're getting closer to our goal and every donation helps."
      }
    ],
    recentDonations: [
      { name: "Anonymous", amount: 500, time: "2 hours ago" },
      { name: "Maria S.", amount: 100, time: "5 hours ago" },
      { name: "David K.", amount: 250, time: "1 day ago" },
      { name: "Anonymous", amount: 1000, time: "2 days ago" },
      { name: "Lisa M.", amount: 75, time: "3 days ago" }
    ]
  };

  const progressPercentage = (campaign.raised / campaign.goal) * 100;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Campaign link copied to clipboard!");
  };

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
                      {campaign.urgent && <Badge variant="destructive">Urgent</Badge>}
                      {campaign.verified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl lg:text-3xl text-gray-800 mb-2">
                      {campaign.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Organized by {campaign.organizer} • {campaign.location}
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={handleShare} className="ml-4">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardHeader>
            </Card>

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
                  {campaign.fullDescription.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Updates */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Campaign Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaign.updates.map((update, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-800">{update.title}</h4>
                        <span className="text-sm text-gray-500">{update.date}</span>
                      </div>
                      <p className="text-gray-600">{update.content}</p>
                    </div>
                  ))}
                </div>
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
                      A{campaign.raised.toLocaleString()}
                    </div>
                    <div className="text-gray-600">
                      raised of A{campaign.goal.toLocaleString()} goal
                    </div>
                  </div>
                  
                  <Progress value={progressPercentage} className="h-3" />
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-semibold text-gray-800">{campaign.donors}</div>
                      <div className="text-sm text-gray-600">donors</div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-gray-800">{campaign.daysLeft}</div>
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
                      Secure donation processing powered by Stripe
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
                <div className="space-y-3">
                  {campaign.recentDonations.map((donation, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-800">{donation.name}</div>
                        <div className="text-sm text-gray-500">{donation.time}</div>
                      </div>
                      <div className="font-semibold text-blue-600">
                        A{donation.amount}
                      </div>
                    </div>
                  ))}
                </div>
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
                    <span className="font-medium">{campaign.createdDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{campaign.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Verification:</span>
                    <span className="font-medium text-green-600">Verified ✓</span>
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
          campaign={campaign}
          onClose={() => setShowDonationForm(false)}
        />
      )}
    </div>
  );
};

export default CampaignDetail;
