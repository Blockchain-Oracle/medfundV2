
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Search, Filter, ArrowLeft } from "lucide-react";

const Campaigns = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");

  // Mock campaigns data
  const campaigns = [
    {
      id: 1,
      title: "Emergency Heart Surgery",
      description: "Help John receive his life-saving heart surgery. Your contribution makes a difference!",
      raised: 35000,
      goal: 50000,
      urgent: true,
      category: "surgery",
      daysLeft: 15,
      donors: 234
    },
    {
      id: 2,
      title: "Cancer Treatment Fund",
      description: "Supporting Maria through her cancer treatment journey with chemotherapy and care.",
      raised: 22000,
      goal: 40000,
      urgent: false,
      category: "treatment",
      daysLeft: 45,
      donors: 156
    },
    {
      id: 3,
      title: "Child's Surgery Fund",
      description: "Help little Emma get the surgery she needs to walk again.",
      raised: 18000,
      goal: 25000,
      urgent: true,
      category: "surgery",
      daysLeft: 8,
      donors: 89
    },
    {
      id: 4,
      title: "Diabetes Management",
      description: "Supporting ongoing diabetes treatment and medication costs.",
      raised: 8500,
      goal: 15000,
      urgent: false,
      category: "treatment",
      daysLeft: 30,
      donors: 67
    },
    {
      id: 5,
      title: "Mental Health Support",
      description: "Therapy and mental health treatment for anxiety and depression.",
      raised: 5200,
      goal: 12000,
      urgent: false,
      category: "therapy",
      daysLeft: 60,
      donors: 43
    },
    {
      id: 6,
      title: "Emergency Accident Recovery",
      description: "Recovery from serious car accident requiring multiple surgeries.",
      raised: 42000,
      goal: 60000,
      urgent: true,
      category: "emergency",
      daysLeft: 20,
      donors: 312
    }
  ];

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterBy === "all" || 
                         (filterBy === "urgent" && campaign.urgent) ||
                         (filterBy === "category" && campaign.category === filterBy);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 relative overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      {/* Header */}
      <header className="relative z-10 bg-gray-900/90 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">MedFund</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/campaigns" className="text-blue-300 font-semibold">Campaigns</Link>
              <Link to="/start-campaign" className="text-white hover:text-blue-300 transition-colors">Start Campaign</Link>
              <span className="text-white hover:text-blue-300 transition-colors">Governance</span>
              <span className="text-white hover:text-blue-300 transition-colors">Rewards</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                Login
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Register
              </Button>
            </div>
          </nav>
        </div>
      </header>

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
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-800 text-lg">{campaign.title}</CardTitle>
                    {campaign.urgent && <Badge variant="destructive">Urgent</Badge>}
                  </div>
                  <CardDescription className="text-gray-600">
                    {campaign.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress value={(campaign.raised / campaign.goal) * 100} className="h-3" />
                    
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">A{campaign.raised.toLocaleString()} raised</span>
                      <span className="text-gray-600">A{campaign.goal.toLocaleString()} goal</span>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{campaign.donors} donors</span>
                      <span>{campaign.daysLeft} days left</span>
                    </div>
                    
                    <div className="flex gap-2">
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
          
          {filteredCampaigns.length === 0 && (
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
