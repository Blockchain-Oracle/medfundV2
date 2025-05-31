import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Search, Filter, ArrowLeft, MapPin, Clock, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

// API client function
const fetchCampaigns = async () => {
  const { data } = await axios.get('/api/campaigns');
  return data;
};

interface Campaign {
  id: string;
  title: string;
  description: string;
  raised: string;
  goal: string;
  isUrgent: boolean;
  category: string;
  imageUrl?: string;
  location?: string;
  endDate?: string;
  createdAt: string;
  donorCount?: number;
}

const Campaigns = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");

  // Fetch campaigns
  const { data: campaigns = [], isLoading, error } = useQuery({
    queryKey: ['campaigns'],
    queryFn: fetchCampaigns,
  });

  // Filter and sort campaigns
  const processedCampaigns = campaigns
    .filter((campaign: Campaign) => {
      const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterBy === "all" || 
                           (filterBy === "urgent" && campaign.isUrgent) ||
                           (filterBy === campaign.category);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a: Campaign, b: Campaign) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "goal_high":
          return parseFloat(b.goal) - parseFloat(a.goal);
        case "goal_low":
          return parseFloat(a.goal) - parseFloat(b.goal);
        case "progress":
          return (parseFloat(b.raised) / parseFloat(b.goal)) - (parseFloat(a.raised) / parseFloat(a.goal));
        default:
          return 0;
      }
    });

  // Calculate days left for a campaign
  const getDaysLeft = (endDateStr?: string) => {
    if (!endDateStr) return 0;
    const endDate = new Date(endDateStr);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-white text-xl">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Error loading campaigns</h2>
          <p className="mb-6">There was a problem fetching the campaigns.</p>
          <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 relative overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      {/* Page Header */}
      <section className="relative z-10 py-12 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4 mb-6">
            <Link to="/">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">Browse Campaigns</h1>
          <p className="text-xl text-blue-100 mb-8">
            Discover medical fundraising campaigns that need your support
          </p>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-300"
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="goal_high">Highest Goal</SelectItem>
                <SelectItem value="goal_low">Lowest Goal</SelectItem>
                <SelectItem value="progress">Most Progress</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                <SelectItem value="urgent">Urgent Only</SelectItem>
                <SelectItem value="surgery">Surgery</SelectItem>
                <SelectItem value="treatment">Treatment</SelectItem>
                <SelectItem value="therapy">Therapy</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Campaigns Grid */}
      <section className="relative z-10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processedCampaigns.map((campaign: Campaign) => (
              <Card key={campaign.id} className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
                {/* Campaign Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={campaign.imageUrl || "/images/campaign1.jpeg"} 
                    alt={campaign.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {campaign.isUrgent && <Badge variant="destructive">Urgent</Badge>}
                    <Badge variant="secondary" className="bg-white/90 text-gray-800">
                      {campaign.category}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-gray-800 text-lg line-clamp-2">{campaign.title}</CardTitle>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {campaign.location || "Location not specified"}
                  </div>
                  <CardDescription className="text-gray-600 line-clamp-2 mt-2">
                    {campaign.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <Progress value={(parseFloat(campaign.raised) / parseFloat(campaign.goal)) * 100} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">A{parseFloat(campaign.raised).toLocaleString()} raised</span>
                      <span className="text-gray-600">A{parseFloat(campaign.goal).toLocaleString()} goal</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {campaign.donorCount ? `${campaign.donorCount} donors` : "0 donors"}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {getDaysLeft(campaign.endDate)} days left
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Link to={`/campaign/${campaign.id}`} className="flex-1">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          View Campaign
                        </Button>
                      </Link>
                      <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {processedCampaigns.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white text-xl">No campaigns found matching your criteria.</p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setFilterBy("all");
                }}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Campaigns;
