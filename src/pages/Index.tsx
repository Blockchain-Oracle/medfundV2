
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, Zap, Users, ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock campaign data
  const featuredCampaigns = [
    {
      id: 1,
      title: "Emergency Heart Surgery",
      description: "Help John receive his life-saving heart surgery. Your contribution makes a difference!",
      raised: 35000,
      goal: 50000,
      urgent: true,
      image: "/lovable-uploads/c8f6df5b-72d3-4b7c-8838-1e28d2c229d1.png"
    },
    {
      id: 2,
      title: "Cancer Treatment Fund",
      description: "Supporting Maria through her cancer treatment journey.",
      raised: 22000,
      goal: 40000,
      urgent: false,
      image: "/lovable-uploads/c8f6df5b-72d3-4b7c-8838-1e28d2c229d1.png"
    },
    {
      id: 3,
      title: "Child's Surgery Fund",
      description: "Help little Emma get the surgery she needs to walk again.",
      raised: 18000,
      goal: 25000,
      urgent: true,
      image: "/lovable-uploads/c8f6df5b-72d3-4b7c-8838-1e28d2c229d1.png"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 relative overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      {/* Header */}
      <header className="relative z-10 bg-gray-900/90 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">MedFund</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/campaigns" className="text-white hover:text-blue-300 transition-colors">Campaigns</Link>
              <Link to="/start-campaign" className="text-white hover:text-blue-300 transition-colors">Start Campaign</Link>
              <span className="text-white hover:text-blue-300 transition-colors">Governance</span>
              <span className="text-white hover:text-blue-300 transition-colors">Rewards</span>
              <span className="text-white hover:text-blue-300 transition-colors">Analytics</span>
              <span className="text-white hover:text-blue-300 transition-colors">Testimonials</span>
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

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Transparent Medical
              <br />
              <span className="text-blue-300">Fundraising on the</span>
              <br />
              <span className="text-blue-400">Blockchain</span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              MedFund empowers patients and healthcare providers with secure, transparent fundraising powered by modern payment technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4">
                Browse Campaigns
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-4">
                Start a Campaign
              </Button>
            </div>
          </div>
          
          <div className="lg:block">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-800">Emergency Heart Surgery</CardTitle>
                  <Badge variant="destructive">Urgent</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress value={70} className="h-3" />
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">A35,000 raised</span>
                    <span className="text-gray-600">A50,000 goal</span>
                  </div>
                  <p className="text-gray-700">
                    Help John receive his life-saving heart surgery. Your contribution makes a difference!
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Donate Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 bg-white/5 backdrop-blur-sm py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Why Choose MedFund?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-400 mb-4" />
                <CardTitle>KYC Verified</CardTitle>
                <CardDescription className="text-blue-100">
                  All health needers go through rigorous identity verification to ensure legitimacy.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader>
                <Zap className="h-12 w-12 text-blue-400 mb-4" />
                <CardTitle>Fast & Secure</CardTitle>
                <CardDescription className="text-blue-100">
                  Instant payments with Stripe integration and cryptocurrency support.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-400 mb-4" />
                <CardTitle>Donor Rewards</CardTitle>
                <CardDescription className="text-blue-100">
                  Earn rewards and recognition for your generous contributions.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold text-white">Featured Campaigns</h2>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-800">{campaign.title}</CardTitle>
                    {campaign.urgent && <Badge variant="destructive">Urgent</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress value={(campaign.raised / campaign.goal) * 100} className="h-3" />
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">A{campaign.raised.toLocaleString()} raised</span>
                      <span className="text-gray-600">A{campaign.goal.toLocaleString()} goal</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      {campaign.description}
                    </p>
                    <Link to={`/campaign/${campaign.id}`}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 bg-blue-600/20 backdrop-blur-sm py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of donors who are helping people get the medical care they need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-4">
              Start Donating
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4">
              Create Campaign
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900/90 backdrop-blur-sm border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold text-white">MedFund</span>
              </div>
              <p className="text-gray-300">
                Transparent medical fundraising powered by modern technology.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Browse Campaigns</li>
                <li>Start Campaign</li>
                <li>How it Works</li>
                <li>Success Stories</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Safety & Trust</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Blog</li>
                <li>Forum</li>
                <li>Social Media</li>
                <li>Newsletter</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 MedFund. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
